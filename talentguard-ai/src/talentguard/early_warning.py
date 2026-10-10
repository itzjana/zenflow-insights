"""
early_warning.py – Phase 10 (Stretch)
=======================================
Optional dated-snapshot risk trend analysis.

⚠️  The IBM HR dataset is a SINGLE snapshot. If no genuine longitudinal
    data is available, all demo data here is SYNTHETIC and must be
    clearly labelled as such. Never claim synthetic trends validate
    early-warning performance.

The core app works without this module.
"""

from __future__ import annotations

import warnings
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
import plotly.graph_objects as go
from sklearn.pipeline import Pipeline

from .config import RANDOM_SEED
from .preprocessing import split_features_target

SYNTHETIC_DEMO_LABEL = "⚠️ SYNTHETIC DEMO DATA — NOT REAL EMPLOYEE HISTORY"


# ---------------------------------------------------------------------------
# Snapshot loading
# ---------------------------------------------------------------------------

def load_snapshots(paths: list[str]) -> list[tuple[str, pd.DataFrame]]:
    """Load multiple dated CSV snapshots. Return list of (date_str, df) tuples.

    Each path should start with an ISO date prefix: YYYY-MM-DD_filename.csv
    """
    snapshots = []
    for path in sorted(paths):
        date_str = path.split("_")[0].split("/")[-1].split("\\")[-1]
        try:
            datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            warnings.warn(f"Cannot parse date from path {path!r}. Skipping.", stacklevel=2)
            continue
        df = pd.read_csv(path)
        snapshots.append((date_str, df))
    return snapshots


def compute_risk_deltas(
    snapshots: list[tuple[str, pd.DataFrame]],
    pipeline: Pipeline,
) -> pd.DataFrame:
    """Compute Δp = p_t − p_{t-1} for each employee across snapshots."""
    scored_snapshots = []
    for date_str, df in snapshots:
        X, _ = split_features_target(df) if "Attrition" in df.columns else (df, None)
        proba = pipeline.predict_proba(X)[:, 1]
        scored = df[["EmployeeNumber"]].copy() if "EmployeeNumber" in df.columns else pd.DataFrame()
        scored["date"] = date_str
        scored["risk_score"] = proba
        scored_snapshots.append(scored)

    combined = pd.concat(scored_snapshots, ignore_index=True)
    wide = combined.pivot(index="EmployeeNumber", columns="date", values="risk_score")
    wide = wide.sort_index(axis=1)

    dates = wide.columns.tolist()
    for i in range(1, len(dates)):
        wide[f"delta_{dates[i-1]}_{dates[i]}"] = wide[dates[i]] - wide[dates[i-1]]

    return wide.reset_index()


def flag_alerts(
    risk_deltas: pd.DataFrame,
    threshold: float = 0.10,
) -> pd.DataFrame:
    """Return rows where any risk delta exceeds *threshold*."""
    delta_cols = [c for c in risk_deltas.columns if c.startswith("delta_")]
    mask = (risk_deltas[delta_cols].abs() > threshold).any(axis=1)
    return risk_deltas[mask].copy()


# ---------------------------------------------------------------------------
# Synthetic demo generator
# ---------------------------------------------------------------------------

def generate_synthetic_demo(
    n_employees: int = 50,
    n_snapshots: int = 3,
    base_date: str = "2026-01-01",
) -> list[tuple[str, pd.DataFrame]]:
    """Generate synthetic snapshot data for UI demo ONLY.

    Output must be clearly labelled with SYNTHETIC_DEMO_LABEL.
    """
    rng = np.random.default_rng(RANDOM_SEED)
    snapshots = []
    base = datetime.strptime(base_date, "%Y-%m-%d")

    emp_ids = list(range(1001, 1001 + n_employees))
    base_risks = rng.uniform(0.1, 0.9, size=n_employees)

    for i in range(n_snapshots):
        date_str = (base + timedelta(days=30 * i)).strftime("%Y-%m-%d")
        noise = rng.normal(0, 0.05, size=n_employees)
        risks = np.clip(base_risks + noise * (i + 1), 0.0, 1.0)
        df = pd.DataFrame({
            "EmployeeNumber": emp_ids,
            "risk_score": risks,
            "synthetic": True,
            "label": SYNTHETIC_DEMO_LABEL,
        })
        snapshots.append((date_str, df))

    return snapshots


# ---------------------------------------------------------------------------
# Chart
# ---------------------------------------------------------------------------

def plot_risk_trends(risk_deltas: pd.DataFrame, top_n: int = 10) -> go.Figure:
    """Plot risk score trends for the top-n most-changed employees."""
    date_cols = [c for c in risk_deltas.columns if not c.startswith("delta_") and c != "EmployeeNumber"]

    if not date_cols:
        return go.Figure()

    delta_cols = [c for c in risk_deltas.columns if c.startswith("delta_")]
    max_delta = risk_deltas[delta_cols].abs().max(axis=1) if delta_cols else pd.Series(0, index=risk_deltas.index)
    top_ids = risk_deltas.nlargest(top_n, max_delta.name if hasattr(max_delta, "name") else max_delta.index[0])[
        "EmployeeNumber"
    ].tolist() if "EmployeeNumber" in risk_deltas.columns else risk_deltas.index[:top_n].tolist()

    fig = go.Figure()
    for emp_id in top_ids:
        row = risk_deltas[risk_deltas["EmployeeNumber"] == emp_id].iloc[0]
        y_vals = [row[d] for d in date_cols]
        fig.add_trace(go.Scatter(
            x=date_cols,
            y=y_vals,
            mode="lines+markers",
            name=f"EMP-{str(emp_id)[-4:]}",
            hovertemplate=f"EMP {emp_id}<br>Date: %{{x}}<br>Risk: %{{y:.2f}}<extra></extra>",
        ))

    fig.update_layout(
        title=f"{SYNTHETIC_DEMO_LABEL}<br>Risk Score Trends – Top {top_n} Most Changed",
        xaxis_title="Snapshot Date",
        yaxis_title="Attrition Risk Score",
        yaxis=dict(range=[0, 1], gridcolor="rgba(255,255,255,0.08)"),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font_color="#e0e0ff",
        legend=dict(font=dict(color="#e0e0ff", size=9)),
        margin=dict(t=80, b=40, l=55, r=20),
    )
    return fig
