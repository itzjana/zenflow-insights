"""
predict.py – Phase 4
======================
Scoring service: Attrition=Yes probabilities and ranked Top-50 watch list.
EmployeeNumber is never a model feature; attached after scoring.
"""

from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline

from .config import EXPLANATION_TOP_K, WATCHLIST_SIZE
from .preprocessing import split_features_target


def score_employees(df: pd.DataFrame, pipeline: Pipeline) -> pd.DataFrame:
    """Score all employees and return a DataFrame with attrition probabilities.

    Columns returned: EmployeeNumber (if present), all original features,
    attrition_probability.

    Scores are in [0, 1]. EmployeeNumber is NOT a model feature.
    """
    X, _ = split_features_target(df)
    proba = pipeline.predict_proba(X)[:, 1]  # P(Attrition=Yes)

    scored = df.copy()
    scored["attrition_probability"] = proba
    validate_scores(scored)
    return scored


def get_top_n_watchlist(
    scored_df: pd.DataFrame,
    n: int | None = None,
) -> pd.DataFrame:
    """Return top-n rows sorted descending by attrition_probability.

    Uses config.WATCHLIST_SIZE when n is None.
    Stable tie-breaking: secondary sort by EmployeeNumber (ascending).
    """
    k = n if n is not None else WATCHLIST_SIZE

    sort_cols = ["attrition_probability"]
    sort_asc = [False]

    if "EmployeeNumber" in scored_df.columns:
        sort_cols.append("EmployeeNumber")
        sort_asc.append(True)

    ranked = (
        scored_df
        .sort_values(sort_cols, ascending=sort_asc)
        .head(k)
        .reset_index(drop=True)
    )
    ranked.index = ranked.index + 1  # 1-based rank
    ranked.index.name = "Rank"
    return ranked


def validate_scores(scored_df: pd.DataFrame) -> None:
    """Raise ValueError if any score is outside [0, 1] or NaN."""
    col = scored_df["attrition_probability"]
    if col.isna().any():
        raise ValueError("attrition_probability contains NaN values.")
    if (col < 0).any() or (col > 1).any():
        bad = col[(col < 0) | (col > 1)]
        raise ValueError(f"Scores outside [0,1] found: {bad.values[:5]}")


def predict_labels(scored_df: pd.DataFrame, threshold: float = 0.5) -> pd.Series:
    """Return binary labels (1/0) at a given probability threshold."""
    return (scored_df["attrition_probability"] >= threshold).astype(int)
