"""
train.py – Phase 2 / Phase 3
==============================
Train DummyClassifier, LogisticRegression, and HistGradientBoostingClassifier.
All fitting on training data only; test set never touched during tuning.
"""

from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.pipeline import Pipeline

from .config import RANDOM_SEED
from .preprocessing import build_pipeline, get_feature_columns


# ---------------------------------------------------------------------------
# Model builders  (return full pipeline = preprocessor + classifier)
# ---------------------------------------------------------------------------

def train_dummy(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    numeric_cols: list[str],
    categorical_cols: list[str],
) -> Pipeline:
    """Fit and return a DummyClassifier pipeline (strategy='most_frequent')."""
    pipe = build_pipeline(numeric_cols, categorical_cols)
    pipe.steps.append(("classifier", DummyClassifier(strategy="most_frequent", random_state=RANDOM_SEED)))
    pipe.fit(X_train, y_train)
    return pipe


def train_logistic(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    numeric_cols: list[str],
    categorical_cols: list[str],
    C: float = 1.0,
) -> Pipeline:
    """Fit and return a LogisticRegression pipeline with class_weight='balanced'."""
    pipe = build_pipeline(numeric_cols, categorical_cols)
    pipe.steps.append((
        "classifier",
        LogisticRegression(
            C=C,
            class_weight="balanced",
            max_iter=1000,
            random_state=RANDOM_SEED,
            solver="lbfgs",
        ),
    ))
    pipe.fit(X_train, y_train)
    return pipe


def train_candidate(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    numeric_cols: list[str],
    categorical_cols: list[str],
) -> Pipeline:
    """Fit and return a HistGradientBoostingClassifier pipeline.

    HGBC natively handles missing values and does not require scaling,
    but we keep the preprocessor for consistent API / unseen category safety.
    """
    pipe = build_pipeline(numeric_cols, categorical_cols)
    pipe.steps.append((
        "classifier",
        HistGradientBoostingClassifier(
            max_iter=300,
            learning_rate=0.05,
            max_leaf_nodes=31,
            class_weight="balanced",
            random_state=RANDOM_SEED,
            early_stopping=True,
            validation_fraction=0.1,
            n_iter_no_change=20,
        ),
    ))
    pipe.fit(X_train, y_train)
    return pipe


# ---------------------------------------------------------------------------
# Cross-validation (training data only)
# ---------------------------------------------------------------------------

def run_cross_validation(
    pipeline: Pipeline,
    X_train: pd.DataFrame,
    y_train: pd.Series,
    cv: int = 5,
) -> dict:
    """Stratified k-fold CV on training data only.

    Returns dict with mean ± std for roc_auc, precision, recall, f1.
    """
    scoring = ["roc_auc", "precision", "recall", "f1"]
    cv_strategy = StratifiedKFold(n_splits=cv, shuffle=True, random_state=RANDOM_SEED)
    results = cross_validate(
        pipeline, X_train, y_train,
        cv=cv_strategy,
        scoring=scoring,
        return_train_score=False,
        n_jobs=-1,
    )
    summary = {}
    for metric in scoring:
        key = f"test_{metric}"
        summary[metric] = {
            "mean": float(np.mean(results[key])),
            "std": float(np.std(results[key])),
            "scores": results[key].tolist(),
        }
    return summary


# ---------------------------------------------------------------------------
# Full training run
# ---------------------------------------------------------------------------

def run_full_training(
    df: pd.DataFrame,
    X_train: pd.DataFrame,
    X_test: pd.DataFrame,
    y_train: pd.Series,
    y_test: pd.Series,
) -> dict:
    """Train all models and return a results dict.

    Returns
    -------
    dict with keys: dummy_pipe, logistic_pipe, candidate_pipe,
                    numeric_cols, categorical_cols,
                    cv_logistic, cv_candidate
    """
    numeric_cols, categorical_cols = get_feature_columns(df)

    dummy_pipe = train_dummy(X_train, y_train, numeric_cols, categorical_cols)
    logistic_pipe = train_logistic(X_train, y_train, numeric_cols, categorical_cols)
    candidate_pipe = train_candidate(X_train, y_train, numeric_cols, categorical_cols)

    # CV on training folds only
    cv_logistic = run_cross_validation(
        train_logistic(X_train, y_train, numeric_cols, categorical_cols),
        X_train, y_train,
    )
    cv_candidate = run_cross_validation(
        train_candidate(X_train, y_train, numeric_cols, categorical_cols),
        X_train, y_train,
    )

    return {
        "dummy_pipe": dummy_pipe,
        "logistic_pipe": logistic_pipe,
        "candidate_pipe": candidate_pipe,
        "numeric_cols": numeric_cols,
        "categorical_cols": categorical_cols,
        "cv_logistic": cv_logistic,
        "cv_candidate": cv_candidate,
    }
