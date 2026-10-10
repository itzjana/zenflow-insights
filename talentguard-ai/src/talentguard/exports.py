"""
exports.py – Phase 8
======================
CSV / JSON exports for the watch list, retention drafts, and audit records.
Omits unnecessary personal data. Masks identifiers in public exports.
"""

from __future__ import annotations

import hashlib
import io
import json
from datetime import datetime, timezone

import pandas as pd


# ---------------------------------------------------------------------------
# ID masking
# ---------------------------------------------------------------------------

def mask_employee_id(employee_id: str | int, salt: str = "talentguard-demo") -> str:
    """Return a short, consistent masked ID for public exports."""
    raw = f"{salt}-{employee_id}"
    return "EMP-" + hashlib.sha256(raw.encode()).hexdigest()[:8].upper()


# ---------------------------------------------------------------------------
# Watch list export
# ---------------------------------------------------------------------------

WATCHLIST_EXPORT_COLS = [
    "Rank",
    "masked_id",
    "attrition_probability",
    "risk_pct",
]

def export_watchlist_csv(watchlist: pd.DataFrame, mask_ids: bool = True) -> bytes:
    """Return the Top-50 watch list as UTF-8 CSV bytes.

    Includes: rank, masked ID, attrition probability, risk percentage.
    Omits raw feature vectors.
    """
    df = watchlist.reset_index()  # brings Rank back as column
    if "Rank" not in df.columns:
        df.insert(0, "Rank", range(1, len(df) + 1))

    df["risk_pct"] = (df["attrition_probability"] * 100).round(1).astype(str) + "%"

    if mask_ids and "EmployeeNumber" in df.columns:
        df["masked_id"] = df["EmployeeNumber"].apply(mask_employee_id)
    elif "EmployeeNumber" in df.columns:
        df["masked_id"] = df["EmployeeNumber"]
    else:
        df["masked_id"] = df.index

    # Add top risk reasons if available
    for i in range(1, 4):
        col = f"risk_reason_{i}"
        if col in df.columns:
            WATCHLIST_EXPORT_COLS.append(col)

    export_cols = [c for c in ["Rank", "masked_id", "attrition_probability", "risk_pct"] if c in df.columns]

    buf = io.StringIO()
    df[export_cols].to_csv(buf, index=False)
    return buf.getvalue().encode("utf-8")


# ---------------------------------------------------------------------------
# Drafts export
# ---------------------------------------------------------------------------

def export_drafts_csv(drafts: list[dict], mask_ids: bool = True) -> bytes:
    """Return the retention drafts as UTF-8 CSV bytes."""
    rows = []
    for draft in drafts:
        emp_id = draft.get("employee_id", "")
        rows.append({
            "masked_id": mask_employee_id(emp_id) if mask_ids else emp_id,
            "risk_score": draft.get("risk_score", ""),
            "status": draft.get("status", ""),
            "risk_reasons": "; ".join(draft.get("risk_reasons", [])),
            "recommended_actions": "; ".join(draft.get("recommended_actions", [])),
            "conversation_guide": "; ".join(draft.get("conversation_guide", [])),
            "limitations": draft.get("limitations", ""),
            "created_at": draft.get("created_at", ""),
            "reviewed_by": draft.get("reviewed_by") or "",
            "reviewed_at": draft.get("reviewed_at") or "",
            "review_note": draft.get("review_note") or "",
        })
    df = pd.DataFrame(rows)
    buf = io.StringIO()
    df.to_csv(buf, index=False)
    return buf.getvalue().encode("utf-8")


# ---------------------------------------------------------------------------
# Audit log export
# ---------------------------------------------------------------------------

def export_audit_json(drafts: list[dict], mask_ids: bool = True) -> str:
    """Return the full audit log as a JSON string."""
    export_drafts = []
    for draft in drafts:
        d = dict(draft)
        if mask_ids and "employee_id" in d:
            d["employee_id"] = mask_employee_id(d["employee_id"])
        export_drafts.append(d)

    return json.dumps(
        {
            "exported_at": datetime.now(timezone.utc).isoformat(),
            "disclaimer": "Demo export. IDs are masked. Not for production use.",
            "drafts": export_drafts,
        },
        indent=2,
    )
