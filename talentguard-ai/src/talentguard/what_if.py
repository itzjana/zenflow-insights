"""
what_if.py – Phase 7
======================
Retention What-If Simulator.

Uses the SAME fitted pipeline as the main scorer.
Validates all proposed changes. Never mutates the original record.

Formula:  Δp = p(y=1|x') - p(y=1|x)
⚠️ A negative Δp means the model gives a lower score to that hypothetical
input. It does NOT prove the real intervention will reduce resignation risk.
"""

from __future__ import annotations

import copy

import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline

from .config import DROP_COLS, ID_COL, TARGET_COL, WHATIF_MUTABLE_FEATURES
from .preprocessing import split_features_target

_CAVEAT = (
    "⚠️ HYPOTHETICAL MODEL SCENARIO — This comparison reflects how the model "
    "responds to different input values. Score changes are NOT causal effects "
    "or guarantees. A lower score does not prove that the real intervention "
    "will reduce resignation risk."
)

# Sensible numeric bounds (derived from IBM HR data range knowledge)
_NUMERIC_BOUNDS: dict[str, tuple] = {
    "DistanceFromHome": (1, 29),
    "MonthlyIncome": (1009, 19999),
    "PercentSalaryHike": (11, 25),
    "TrainingTimesLastYear": (0, 6),
    "JobLevel": (1, 5),
    "StockOptionLevel": (0, 3),
    "NumCompaniesWorked": (0, 9),
}

# Protected / sensitive attributes that must never be changed
_PROTECTED_ATTRS = {"Gender", "Age", "MaritalStatus", "EducationField", "Education"}
_IMMUTABLE_ATTRS = set(DROP_COLS) | {TARGET_COL, ID_COL} | _PROTECTED_ATTRS


def validate_changes(changes: dict, employee_row: pd.Series) -> None:
    """Raise ValueError for disallowed, out-of-range, or protected changes."""
    for feat, new_val in changes.items():
        if feat in _IMMUTABLE_ATTRS:
            raise ValueError(
                f"'{feat}' cannot be changed: it is an identifier, target, "
                "constant, or protected/sensitive attribute."
            )
        if feat not in WHATIF_MUTABLE_FEATURES:
            raise ValueError(
                f"'{feat}' is not in the approved list of mutable features. "
                f"Allowed: {WHATIF_MUTABLE_FEATURES}"
            )
        if feat in _NUMERIC_BOUNDS:
            lo, hi = _NUMERIC_BOUNDS[feat]
            try:
                val = float(new_val)
            except (TypeError, ValueError):
                raise ValueError(f"'{feat}' expects a numeric value, got {new_val!r}")
            if not (lo <= val <= hi):
                raise ValueError(
                    f"'{feat}' value {val} is outside allowed range [{lo}, {hi}]."
                )


def get_mutable_feature_options(df: pd.DataFrame) -> dict:
    """Return allowed values/range for each mutable feature from training data."""
    options = {}
    for feat in WHATIF_MUTABLE_FEATURES:
        if feat not in df.columns:
            continue
        if pd.api.types.is_numeric_dtype(df[feat]):
            if feat in _NUMERIC_BOUNDS:
                lo, hi = _NUMERIC_BOUNDS[feat]
            else:
                lo, hi = int(df[feat].min()), int(df[feat].max())
            options[feat] = {"type": "numeric", "min": lo, "max": hi}
        else:
            options[feat] = {"type": "categorical", "values": sorted(df[feat].dropna().unique().tolist())}
    return options


def simulate(
    employee_row: pd.Series,
    changes: dict,
    pipeline: Pipeline,
) -> dict:
    """Apply *changes* to a copy of *employee_row* and return comparison dict.

    Returns
    -------
    dict with: baseline_score, scenario_score, delta_pp, changed_fields, caveat

    Raises ValueError for disallowed changes. Never mutates employee_row.
    """
    validate_changes(changes, employee_row)

    # Build baseline input (copy – no mutation)
    baseline_series = employee_row.copy()
    scenario_series = employee_row.copy()

    for feat, new_val in changes.items():
        scenario_series[feat] = new_val

    def _score(series: pd.Series) -> float:
        row_df = series.to_frame().T.reset_index(drop=True)
        # Remove target/drop/ID cols before scoring
        cols_to_remove = [c for c in (list(DROP_COLS) + [TARGET_COL, ID_COL]) if c in row_df.columns]
        row_df = row_df.drop(columns=cols_to_remove, errors="ignore")
        return float(pipeline.predict_proba(row_df)[0, 1])

    baseline_score = _score(baseline_series)
    scenario_score = _score(scenario_series)
    delta_pp = round((scenario_score - baseline_score) * 100, 2)

    return {
        "baseline_score": round(baseline_score, 4),
        "scenario_score": round(scenario_score, 4),
        "delta_pp": delta_pp,
        "delta_direction": "lower_risk" if delta_pp < 0 else ("higher_risk" if delta_pp > 0 else "no_change"),
        "changed_fields": {
            feat: {"from": employee_row.get(feat), "to": new_val}
            for feat, new_val in changes.items()
        },
        "caveat": _CAVEAT,
    }
