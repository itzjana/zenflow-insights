"""
preprocessing.py – Phase 2
============================
Leakage-safe scikit-learn Pipeline and ColumnTransformer.
Fit imputers, encoders, and scaling ONLY on training data.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from .config import (
    DROP_COLS,
    ID_COL,
    METADATA_PATH,
    PIPELINE_PATH,
    RANDOM_SEED,
    TARGET_COL,
    TARGET_MAP,
    TEST_SIZE,
)


# ---------------------------------------------------------------------------
# Feature split helpers
# ---------------------------------------------------------------------------

def get_feature_columns(df: pd.DataFrame) -> tuple[list[str], list[str]]:
    """Return (numeric_cols, categorical_cols) after removing target/drop/ID cols."""
    exclude = set(DROP_COLS) | {TARGET_COL, ID_COL}
    X_cols = [c for c in df.columns if c not in exclude]

    numeric_cols = [
        c for c in X_cols
        if pd.api.types.is_numeric_dtype(df[c])
    ]
    categorical_cols = [
        c for c in X_cols
        if not pd.api.types.is_numeric_dtype(df[c])
    ]
    return numeric_cols, categorical_cols


def split_features_target(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    """Return (X, y) after dropping target, identifiers, and constant columns."""
    exclude = set(DROP_COLS) | {TARGET_COL, ID_COL}
    feature_cols = [c for c in df.columns if c not in exclude]
    X = df[feature_cols].copy()
    y = df[TARGET_COL].copy() if TARGET_COL in df.columns else None
    return X, y


# ---------------------------------------------------------------------------
# Pipeline builder
# ---------------------------------------------------------------------------

def build_pipeline(numeric_cols: list[str], categorical_cols: list[str]) -> Pipeline:
    """Build and return an unfitted scikit-learn Pipeline.

    Numeric:      SimpleImputer(median) → StandardScaler
    Categorical:  SimpleImputer(most_frequent) → OneHotEncoder(handle_unknown='ignore')
    """
    numeric_transformer = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])

    categorical_transformer = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_cols),
            ("cat", categorical_transformer, categorical_cols),
        ],
        remainder="drop",  # safety: drop any unexpected column
    )

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
    ])

    return pipeline


# ---------------------------------------------------------------------------
# Train / test split
# ---------------------------------------------------------------------------

def make_train_test_split(
    X: pd.DataFrame,
    y: pd.Series,
    test_size: float = TEST_SIZE,
    random_state: int = RANDOM_SEED,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """Stratified train/test split. Returns (X_train, X_test, y_train, y_test)."""
    return train_test_split(
        X, y,
        test_size=test_size,
        random_state=random_state,
        stratify=y,
    )


# ---------------------------------------------------------------------------
# Persist / load
# ---------------------------------------------------------------------------

def save_pipeline(pipeline: Pipeline, metadata: dict) -> None:
    """Persist fitted pipeline (joblib) and metadata (JSON)."""
    PIPELINE_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, PIPELINE_PATH)
    meta = {
        **metadata,
        "saved_at": datetime.now(timezone.utc).isoformat(),
        "pipeline_path": str(PIPELINE_PATH),
    }
    METADATA_PATH.write_text(json.dumps(meta, indent=2), encoding="utf-8")


def load_pipeline() -> tuple[Pipeline, dict]:
    """Load persisted pipeline and metadata. Raises FileNotFoundError if missing."""
    if not PIPELINE_PATH.exists():
        raise FileNotFoundError(
            f"No fitted pipeline found at {PIPELINE_PATH}. "
            "Run the training pipeline first."
        )
    pipeline = joblib.load(PIPELINE_PATH)
    metadata: dict = {}
    if METADATA_PATH.exists():
        metadata = json.loads(METADATA_PATH.read_text(encoding="utf-8"))
    return pipeline, metadata
