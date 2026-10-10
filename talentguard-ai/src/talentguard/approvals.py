"""
approvals.py – Phase 6
========================
Explicit approve/reject workflow with reviewer metadata and audit log.

Allowed transitions: PENDING_APPROVAL → APPROVED | REJECTED
No silent approvals. No automated employee contact.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from .config import (
    ALLOWED_TRANSITIONS,
    MODELS_DIR,
    STATUS_APPROVED,
    STATUS_PENDING,
    STATUS_REJECTED,
)

AUDIT_LOG_PATH = MODELS_DIR.parent / "reports" / "audit_log.json"


# ---------------------------------------------------------------------------
# Transition enforcement
# ---------------------------------------------------------------------------

def validate_transition(current_status: str, new_status: str) -> None:
    """Raise ValueError if the transition is not in ALLOWED_TRANSITIONS."""
    allowed = ALLOWED_TRANSITIONS.get(current_status, set())
    if new_status not in allowed:
        raise ValueError(
            f"Invalid transition: {current_status!r} → {new_status!r}. "
            f"Allowed from {current_status!r}: {allowed}"
        )


def _apply_review(
    draft: dict,
    new_status: str,
    reviewer_id: str,
    note: str,
) -> dict:
    """Internal: apply a review decision to a draft copy."""
    validate_transition(draft["status"], new_status)
    updated = dict(draft)
    updated["status"] = new_status
    updated["reviewed_by"] = str(reviewer_id)
    updated["reviewed_at"] = datetime.now(timezone.utc).isoformat()
    updated["review_note"] = note
    return updated


# ---------------------------------------------------------------------------
# Public workflow
# ---------------------------------------------------------------------------

def approve_draft(draft: dict, reviewer_id: str, note: str = "") -> dict:
    """Transition draft status PENDING_APPROVAL → APPROVED.

    Raises ValueError if the current status does not allow this.
    Returns a NEW dict; does not mutate the original.
    """
    return _apply_review(draft, STATUS_APPROVED, reviewer_id, note)


def reject_draft(draft: dict, reviewer_id: str, note: str = "") -> dict:
    """Transition draft status PENDING_APPROVAL → REJECTED.

    Raises ValueError if the current status does not allow this.
    Returns a NEW dict; does not mutate the original.
    """
    return _apply_review(draft, STATUS_REJECTED, reviewer_id, note)


# ---------------------------------------------------------------------------
# Audit log (local JSON – demo only)
# ---------------------------------------------------------------------------

def save_audit_log(drafts: list[dict], path: Path | str | None = None) -> Path:
    """Persist the list of drafts (with review metadata) to a local JSON file.

    ⚠️ Demo only – not production-grade multi-user audit storage.
    """
    log_path = Path(path) if path else AUDIT_LOG_PATH
    log_path.parent.mkdir(parents=True, exist_ok=True)
    log_path.write_text(
        json.dumps(
            {"saved_at": datetime.now(timezone.utc).isoformat(), "drafts": drafts},
            indent=2,
        ),
        encoding="utf-8",
    )
    return log_path


def load_audit_log(path: Path | str | None = None) -> list[dict]:
    """Load persisted audit log. Returns empty list if file does not exist."""
    log_path = Path(path) if path else AUDIT_LOG_PATH
    if not log_path.exists():
        return []
    data = json.loads(log_path.read_text(encoding="utf-8"))
    return data.get("drafts", [])


def get_pending(drafts: list[dict]) -> list[dict]:
    return [d for d in drafts if d["status"] == STATUS_PENDING]


def get_approved(drafts: list[dict]) -> list[dict]:
    return [d for d in drafts if d["status"] == STATUS_APPROVED]


def get_rejected(drafts: list[dict]) -> list[dict]:
    return [d for d in drafts if d["status"] == STATUS_REJECTED]
