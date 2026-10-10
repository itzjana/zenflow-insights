"""
tests/test_placeholder.py – Phase 0 smoke tests
=================================================
These pass as soon as the package imports correctly.
Real tests are added per-phase.
"""

import importlib
import sys
from pathlib import Path

# Ensure src/ is on the path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))


def test_package_importable():
    """The talentguard package must be importable."""
    import talentguard  # noqa: F401


def test_config_importable():
    """config.py must be importable and expose required constants."""
    from talentguard.config import (
        TARGET_COL,
        DROP_COLS,
        WATCHLIST_SIZE,
        RETENTION_TOP_N,
        EXPLANATION_TOP_K,
        STATUS_PENDING,
        STATUS_APPROVED,
        STATUS_REJECTED,
    )
    assert TARGET_COL == "Attrition"
    assert "EmployeeNumber" in DROP_COLS
    assert "EmployeeCount" in DROP_COLS
    assert "StandardHours" in DROP_COLS
    assert "Over18" in DROP_COLS
    assert WATCHLIST_SIZE == 50
    assert RETENTION_TOP_N == 10
    assert EXPLANATION_TOP_K == 3
    assert STATUS_PENDING == "PENDING_APPROVAL"
    assert STATUS_APPROVED == "APPROVED"
    assert STATUS_REJECTED == "REJECTED"


def test_all_modules_importable():
    """All placeholder modules must import without errors."""
    modules = [
        "talentguard.data_validation",
        "talentguard.eda",
        "talentguard.preprocessing",
        "talentguard.train",
        "talentguard.evaluate",
        "talentguard.predict",
        "talentguard.explain",
        "talentguard.recommendations",
        "talentguard.approvals",
        "talentguard.what_if",
        "talentguard.exports",
        "talentguard.early_warning",
    ]
    for mod in modules:
        importlib.import_module(mod)


def test_allowed_transitions():
    """PENDING_APPROVAL must only allow transition to APPROVED or REJECTED."""
    from talentguard.config import ALLOWED_TRANSITIONS, STATUS_PENDING, STATUS_APPROVED, STATUS_REJECTED

    allowed = ALLOWED_TRANSITIONS.get(STATUS_PENDING, set())
    assert STATUS_APPROVED in allowed
    assert STATUS_REJECTED in allowed
    assert STATUS_PENDING not in allowed  # cannot transition back to itself


def test_watchlist_capacity():
    """WATCHLIST_SIZE must be >= RETENTION_TOP_N."""
    from talentguard.config import WATCHLIST_SIZE, RETENTION_TOP_N

    assert WATCHLIST_SIZE >= RETENTION_TOP_N


def test_recommendations_rule_table_not_empty():
    """RETENTION_RULES must contain at least one rule."""
    from talentguard.recommendations import RETENTION_RULES

    assert len(RETENTION_RULES) > 0
    for rule in RETENTION_RULES:
        assert "signal_feature" in rule
        assert "recommended_action" in rule
        assert "suggested_question" in rule
