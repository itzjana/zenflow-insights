"""
backend/main.py – TalentGuard AI FastAPI Backend
==================================================
Run locally:  uvicorn backend.main:app --reload --port 8000
Run in Render: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
"""

import sys
import os
import json
from pathlib import Path
from datetime import datetime, timezone
from typing import Any

from dotenv import load_dotenv
load_dotenv()

# Add src to python path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pandas as pd
import numpy as np

# TalentGuard core modules
from talentguard.config import (
    DATA_PATH, MODELS_DIR, WATCHLIST_SIZE, RETENTION_TOP_N,
    STATUS_PENDING, STATUS_APPROVED, STATUS_REJECTED, WHATIF_MUTABLE_FEATURES,
    ID_COL,
)
from talentguard.data_validation import load_and_validate
from talentguard.preprocessing import (
    split_features_target, load_pipeline, get_feature_columns,
)
from talentguard.predict import score_employees, get_top_n_watchlist
from talentguard.explain import explain_employee
from talentguard.recommendations import generate_top10_drafts
from talentguard.approvals import (
    approve_draft, reject_draft, save_audit_log, load_audit_log,
    get_pending, get_approved, get_rejected,
)
from talentguard.what_if import simulate, get_mutable_feature_options
from talentguard.exports import export_watchlist_csv, export_drafts_csv
from talentguard.eda import generate_eda_report, CANDIDATE_FEATURES
from talentguard.early_warning import generate_synthetic_demo, SYNTHETIC_DEMO_LABEL
from talentguard.grok_service import generate_grok_retention_plan

# ─── App init ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="TalentGuard AI API",
    description="HR Attrition Risk Prediction & Ethical Retention Decision Support Platform",
    version="1.0.0",
)

# Allow all origins or configurable via CORS_ORIGINS
cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── App state (loaded once at startup) ─────────────────────────────────────
class AppState:
    df: pd.DataFrame | None = None
    val_report: dict | None = None
    pipeline: Any = None
    metadata: dict | None = None
    scored_df: pd.DataFrame | None = None
    watchlist: pd.DataFrame | None = None
    explanations: dict | None = None
    eval_reports: list | None = None
    X_background: pd.DataFrame | None = None

state = AppState()


def _load_state():
    """Load data + trained pipeline at startup."""
    try:
        state.df, state.val_report = load_and_validate()
        pipeline, metadata = load_pipeline()
        state.pipeline = pipeline
        state.metadata = metadata

        state.scored_df = score_employees(state.df, pipeline)
        state.watchlist = get_top_n_watchlist(state.scored_df)
        X_bg, _ = split_features_target(state.df)
        state.X_background = X_bg

        # Load eval reports
        eval_path = MODELS_DIR / "evaluation_report.json"
        if eval_path.exists():
            state.eval_reports = json.loads(eval_path.read_text(encoding="utf-8"))

        # Load explanations from audit log
        drafts = load_audit_log()
        state.explanations = {str(d["employee_id"]): d.get("evidence", []) for d in drafts}

        print(f"[API] State loaded successfully. Total employees: {len(state.df)}, Watchlist: {len(state.watchlist)}")
    except Exception as e:
        print(f"[API] Warning: Could not load state: {e}")


@app.on_event("startup")
async def startup_event():
    _load_state()


# ─── Helpers ────────────────────────────────────────────────────────────────

def _require_pipeline():
    if state.pipeline is None:
        raise HTTPException(503, "Model not trained. Run train_model.py first.")

def _require_data():
    if state.df is None:
        raise HTTPException(503, "Data not loaded.")

def _sanitize_for_json(obj: Any) -> Any:
    """Recursively convert numpy types to native Python types for JSON serialization."""
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating,)):
        return float(obj)
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, dict):
        return {str(k): _sanitize_for_json(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple, set)):
        return [_sanitize_for_json(x) for x in obj]
    return obj


# ─── Pydantic models ────────────────────────────────────────────────────────

class ApprovalRequest(BaseModel):
    reviewer_id: str
    note: str = ""

class WhatIfRequest(BaseModel):
    employee_id: int
    changes: dict[str, Any]

class RejectRequest(BaseModel):
    reviewer_id: str
    note: str = ""


# ══════════════════════════════════════════════════════════════════════════════
# ROUTES
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "TalentGuard AI API",
        "model_loaded": state.pipeline is not None,
        "data_loaded": state.df is not None,
        "grok_configured": bool(os.getenv("GROK_API_KEY", "").strip()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/overview")
def overview():
    _require_data()
    r = state.val_report or {}
    er = (state.eval_reports or [{}])[-1]
    metrics = er.get("metrics", {})
    return {
        "dataset": {
            "rows": int(state.df.shape[0]),
            "features": int(state.df.shape[1]) - 1,
            "attrition_rate": round(r.get("prevalence", 0) * 100, 1),
            "attrition_count": r.get("class_balance", {}).get("positive_count", int((state.df["Attrition"] == 1).sum())),
        },
        "model": {
            "name": state.metadata.get("model", "HistGradientBoostingClassifier") if state.metadata else "Not trained",
            "trained": state.pipeline is not None,
        },
        "metrics": {
            "roc_auc": round(metrics.get("roc_auc", 0), 4),
            "precision": round(metrics.get("precision", 0), 4),
            "recall": round(metrics.get("recall", 0), 4),
            "f1": round(metrics.get("f1", 0), 4),
            f"precision_at_{WATCHLIST_SIZE}": round(er.get(f"precision_at_{WATCHLIST_SIZE}", 0), 4),
            f"recall_at_{WATCHLIST_SIZE}": round(er.get(f"recall_at_{WATCHLIST_SIZE}", 0), 4),
        },
    }


@app.get("/api/eda")
def eda_report():
    _require_data()
    report = generate_eda_report(state.df)
    return report


@app.get("/api/eda/chart/{feature}")
def eda_feature(feature: str):
    _require_data()
    if feature not in state.df.columns:
        raise HTTPException(404, f"Feature '{feature}' not found.")
    df = state.df.copy()
    target_col = "Attrition"
    group = (
        df.groupby(feature)[target_col]
        .agg(["mean", "count"])
        .reset_index()
        .rename(columns={"mean": "attrition_rate", "count": "count"})
        .sort_values("attrition_rate", ascending=False)
    )
    return group.to_dict(orient="records")


@app.get("/api/eda/features")
def eda_features():
    _require_data()
    available = [f for f in CANDIDATE_FEATURES if f in state.df.columns]
    return {"features": available}


@app.get("/api/watchlist")
def watchlist(limit: int = Query(default=50, le=50)):
    _require_pipeline()
    wl = state.watchlist.reset_index()
    top = wl.head(limit)
    records = []
    for _, row in top.iterrows():
        emp_id = int(row.get("EmployeeNumber", row.name))
        exps = state.explanations.get(str(emp_id), []) if state.explanations else []
        records.append({
            "rank": int(row.get("Rank", _ + 1)),
            "employee_id": emp_id,
            "attrition_probability": round(float(row["attrition_probability"]), 4),
            "risk_pct": round(float(row["attrition_probability"]) * 100, 1),
            "department": str(row.get("Department", "—")),
            "job_role": str(row.get("JobRole", "—")),
            "overtime": str(row.get("OverTime", "—")),
            "monthly_income": int(row.get("MonthlyIncome", 0)),
            "years_at_company": int(row.get("YearsAtCompany", 0)),
            "top_reasons": [e.get("feature", "") for e in exps[:3] if "feature" in e],
        })
    return {"count": len(records), "watchlist": records}


@app.get("/api/employees")
def list_employees(limit: int = 200):
    _require_pipeline()
    df = state.scored_df.head(limit)
    records = []
    for _, row in df.iterrows():
        emp_id = int(row.get("EmployeeNumber", row.name))
        records.append({
            "employee_id": emp_id,
            "job_role": str(row.get("JobRole", "—")),
            "department": str(row.get("Department", "—")),
            "risk_pct": round(float(row.get("attrition_probability", 0)) * 100, 1),
            "overtime": str(row.get("OverTime", "—")),
        })
    return {"count": len(records), "employees": records}


@app.get("/api/employee/{employee_id}")
def employee_detail(employee_id: int):
    _require_pipeline()
    df = state.df
    if "EmployeeNumber" not in df.columns:
        raise HTTPException(404, "EmployeeNumber column is not present.")

    matches = df[df["EmployeeNumber"] == employee_id]
    if matches.empty:
        # Fallback to positional index if someone inputs 0..N
        if 0 <= employee_id < len(df):
            actual_id = int(df.iloc[employee_id]["EmployeeNumber"])
            matches = df[df["EmployeeNumber"] == actual_id]
            employee_id = actual_id
        else:
            raise HTTPException(404, f"Employee ID {employee_id} not found.")

    row = matches.iloc[0]
    scored_matches = state.scored_df[state.scored_df["EmployeeNumber"] == employee_id]
    if not scored_matches.empty:
        risk = float(scored_matches.iloc[0]["attrition_probability"])
    else:
        risk = 0.5

    # Get explanation
    exps = state.explanations.get(str(employee_id), [])
    if not exps:
        try:
            exps = explain_employee(row, state.pipeline, state.X_background, top_k=4)
        except Exception as e:
            exps = [{"feature": "Workplace Patterns", "observed_value": "Standard", "direction": "elevates_risk"}]

    return _sanitize_for_json({
        "employee_id": int(employee_id),
        "attrition_probability": round(risk, 4),
        "risk_pct": round(risk * 100, 1),
        "summary": {
            "department": str(row.get("Department", "")),
            "job_role": str(row.get("JobRole", "")),
            "job_level": int(row.get("JobLevel", 1)),
            "monthly_income": int(row.get("MonthlyIncome", 0)),
            "overtime": str(row.get("OverTime", "No")),
            "years_at_company": int(row.get("YearsAtCompany", 0)),
            "years_with_manager": int(row.get("YearsWithCurrManager", 0)),
            "satisfaction_score": int(row.get("JobSatisfaction", 3)),
            "work_life_balance": int(row.get("WorkLifeBalance", 3)),
        },
        "features": {
            "Age": int(row.get("Age", 0)),
            "Department": str(row.get("Department", "")),
            "JobRole": str(row.get("JobRole", "")),
            "JobLevel": int(row.get("JobLevel", 0)),
            "MonthlyIncome": int(row.get("MonthlyIncome", 0)),
            "OverTime": str(row.get("OverTime", "")),
            "JobSatisfaction": int(row.get("JobSatisfaction", 0)),
            "WorkLifeBalance": int(row.get("WorkLifeBalance", 0)),
            "BusinessTravel": str(row.get("BusinessTravel", "")),
            "YearsAtCompany": int(row.get("YearsAtCompany", 0)),
            "TotalWorkingYears": int(row.get("TotalWorkingYears", 0)),
            "MaritalStatus": str(row.get("MaritalStatus", "")),
            "DistanceFromHome": int(row.get("DistanceFromHome", 0)),
            "EnvironmentSatisfaction": int(row.get("EnvironmentSatisfaction", 0)),
            "RelationshipSatisfaction": int(row.get("RelationshipSatisfaction", 0)),
        },
        "explanations": exps,
        "caveat": "Feature contributions are probabilistic signals to assist human HR leaders. Not an automated dismissal indicator.",
    })


@app.post("/api/grok/plan/{employee_id}")
def grok_plan_endpoint(employee_id: int):
    """Generate an AI-driven, guardrailed retention plan using xAI Grok (or validated fallback)."""
    _require_pipeline()
    emp = employee_detail(employee_id)
    plan = generate_grok_retention_plan(
        employee_id=employee_id,
        risk_score=emp["attrition_probability"],
        employee_data=emp["features"],
        explanations=emp["explanations"],
    )
    return plan


@app.get("/api/retention/drafts")
def get_drafts(status: str = Query(default="all")):
    drafts = load_audit_log()
    if status == "pending":
        return {"drafts": get_pending(drafts), "count": len(get_pending(drafts))}
    elif status == "approved":
        return {"drafts": get_approved(drafts), "count": len(get_approved(drafts))}
    elif status == "rejected":
        return {"drafts": get_rejected(drafts), "count": len(get_rejected(drafts))}
    return {"drafts": drafts, "count": len(drafts)}


@app.post("/api/retention/approve/{employee_id}")
def approve(employee_id: str, req: ApprovalRequest):
    drafts = load_audit_log()
    for i, d in enumerate(drafts):
        if str(d["employee_id"]) == str(employee_id):
            if d["status"] != STATUS_PENDING:
                raise HTTPException(400, f"Draft is already {d['status']}")
            drafts[i] = approve_draft(d, req.reviewer_id, req.note)
            save_audit_log(drafts)
            return {"success": True, "draft": drafts[i]}
    raise HTTPException(404, f"Draft for employee {employee_id} not found.")


@app.post("/api/retention/reject/{employee_id}")
def reject(employee_id: str, req: RejectRequest):
    drafts = load_audit_log()
    for i, d in enumerate(drafts):
        if str(d["employee_id"]) == str(employee_id):
            if d["status"] != STATUS_PENDING:
                raise HTTPException(400, f"Draft is already {d['status']}")
            drafts[i] = reject_draft(d, req.reviewer_id, req.note)
            save_audit_log(drafts)
            return {"success": True, "draft": drafts[i]}
    raise HTTPException(404, f"Draft for employee {employee_id} not found.")


@app.post("/api/whatif")
def what_if(req: WhatIfRequest):
    _require_pipeline()
    df = state.df
    matches = df[df["EmployeeNumber"] == req.employee_id]
    if matches.empty:
        # Check positional index
        if 0 <= req.employee_id < len(df):
            row = df.iloc[req.employee_id]
        else:
            raise HTTPException(404, f"Employee {req.employee_id} not found.")
    else:
        row = matches.iloc[0]

    try:
        result = simulate(row, req.changes, state.pipeline)
        return _sanitize_for_json({
            "baseline_probability": result["baseline_score"],
            "simulated_probability": result["scenario_score"],
            "delta": result["delta_pp"] / 100.0,
            "delta_pp": result["delta_pp"],
            "delta_direction": result.get("delta_direction", ""),
            "changed_fields": result["changed_fields"],
            "caveat": result["caveat"],
        })
    except ValueError as e:
        raise HTTPException(400, str(e))


@app.get("/api/whatif/options")
def whatif_options():
    _require_data()
    return _sanitize_for_json(get_mutable_feature_options(state.df))


@app.get("/api/evaluation")
def evaluation():
    if not state.eval_reports:
        raise HTTPException(503, "No evaluation report found. Run train_model.py.")
    return {"reports": state.eval_reports}


@app.get("/api/earlywarning/demo")
def early_warning_demo(n_employees: int = 50, n_snapshots: int = 3):
    snapshots = generate_synthetic_demo(n_employees=n_employees, n_snapshots=n_snapshots)
    result = []
    for date_str, df_snap in snapshots:
        result.append({
            "date": date_str,
            "label": SYNTHETIC_DEMO_LABEL,
            "employees": df_snap[["EmployeeNumber", "risk_score"]].to_dict(orient="records"),
        })
    return {"label": SYNTHETIC_DEMO_LABEL, "snapshots": result}


@app.get("/api/export/watchlist")
def export_watchlist():
    _require_pipeline()
    from fastapi.responses import Response
    csv_bytes = export_watchlist_csv(state.watchlist)
    return Response(
        content=csv_bytes,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=watchlist.csv"},
    )


@app.get("/api/export/drafts")
def export_drafts_endpoint():
    from fastapi.responses import Response
    drafts = load_audit_log()
    csv_bytes = export_drafts_csv(drafts)
    return Response(
        content=csv_bytes,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=retention_drafts.csv"},
    )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("backend.main:app", host=host, port=port, reload=True)
