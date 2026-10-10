"""
explain.py – Phase 4
======================
Local and global explanations using SHAP when compatible;
otherwise a documented, tested permutation-importance fallback.

⚠️  A top contribution is NOT proof of causation – always display caveats.
"""

from __future__ import annotations

import warnings

import numpy as np
import pandas as pd
from sklearn.inspection import permutation_importance
from sklearn.pipeline import Pipeline

from .config import DROP_COLS, EXPLANATION_TOP_K, ID_COL, TARGET_COL
from .preprocessing import split_features_target


# ---------------------------------------------------------------------------
# SHAP availability check
# ---------------------------------------------------------------------------

import importlib

def _shap_available() -> bool:
    try:
        importlib.import_module("shap")
        return True
    except (ImportError, Exception):
        return False


def _get_feature_names(pipeline: Pipeline, X: pd.DataFrame) -> list[str]:
    """Extract feature names from the fitted ColumnTransformer."""
    try:
        preprocessor = pipeline.named_steps["preprocessor"]
        return list(preprocessor.get_feature_names_out())
    except Exception:
        return [f"feature_{i}" for i in range(X.shape[1])]


# ---------------------------------------------------------------------------
# SHAP explainer
# ---------------------------------------------------------------------------

def _explain_shap(
    employee_row: pd.DataFrame,
    pipeline: Pipeline,
    top_k: int,
) -> list[dict]:
    """Use SHAP TreeExplainer or KernelExplainer for local explanation."""
    shap = importlib.import_module("shap")

    preprocessor = pipeline.named_steps["preprocessor"]
    classifier = pipeline.named_steps["classifier"]
    X_transformed = preprocessor.transform(employee_row)
    feature_names = _get_feature_names(pipeline, employee_row)

    try:
        explainer = shap.TreeExplainer(classifier)
        shap_values = explainer.shap_values(X_transformed)
        # For binary classification some models return list of arrays
        if isinstance(shap_values, list):
            vals = shap_values[1][0]
        else:
            vals = shap_values[0]
    except Exception:
        # Fall back to KernelExplainer (slower but universal)
        background = shap.maskers.Independent(X_transformed, max_samples=50)
        explainer = shap.KernelExplainer(
            lambda x: classifier.predict_proba(x)[:, 1], background
        )
        vals = explainer.shap_values(X_transformed)[0]

    return _format_factors(vals, feature_names, employee_row, top_k)


# ---------------------------------------------------------------------------
# Fallback: permutation-based local explanation
# ---------------------------------------------------------------------------

def _explain_fallback(
    employee_row: pd.DataFrame,
    pipeline: Pipeline,
    X_background: pd.DataFrame,
    top_k: int,
) -> list[dict]:
    """Estimate local feature importance by perturbing each feature.

    For each feature, replace the employee's value with the column median/mode
    and measure the change in predicted probability. This is a simple,
    documented fallback – not as faithful as SHAP.
    """
    preprocessor = pipeline.named_steps["preprocessor"]
    classifier = pipeline.named_steps["classifier"]

    base_proba = classifier.predict_proba(
        preprocessor.transform(employee_row)
    )[0, 1]

    feature_cols = [c for c in employee_row.columns if c in X_background.columns]
    contributions = []

    for col in feature_cols:
        perturbed = employee_row.copy()
        if pd.api.types.is_numeric_dtype(X_background[col]):
            perturbed[col] = X_background[col].median()
        else:
            perturbed[col] = X_background[col].mode().iloc[0]

        try:
            perturbed_proba = classifier.predict_proba(
                preprocessor.transform(perturbed)
            )[0, 1]
            delta = base_proba - perturbed_proba  # positive = feature increases risk
        except Exception:
            delta = 0.0

        contributions.append((col, delta))

    # Sort by absolute delta descending → take top_k
    contributions.sort(key=lambda x: abs(x[1]), reverse=True)
    top = contributions[:top_k]

    results = []
    for col, delta in top:
        obs = employee_row.iloc[0][col]
        results.append({
            "feature": str(col),
            "observed_value": str(obs) if not pd.isna(obs) else "N/A",
            "direction": "increases_risk" if delta > 0 else "decreases_risk",
            "magnitude": float(round(abs(delta), 4)),
            "method": "perturbation_fallback",
        })
    return results


def _format_factors(
    shap_vals: np.ndarray,
    feature_names: list[str],
    employee_row: pd.DataFrame,
    top_k: int,
) -> list[dict]:
    """Format raw SHAP values into explanation factor dicts."""
    indices = np.argsort(np.abs(shap_vals))[::-1][:top_k]
    results = []
    for idx in indices:
        fname = feature_names[idx]
        # Map back to original column name (strip transformer prefix if present)
        original_col = fname.split("__")[-1] if "__" in fname else fname
        # Try to get observed value from original row
        obs = employee_row.iloc[0].get(original_col, "N/A")
        results.append({
            "feature": str(original_col),
            "observed_value": str(obs) if not pd.isna(obs) else "N/A",
            "direction": "increases_risk" if shap_vals[idx] > 0 else "decreases_risk",
            "magnitude": float(round(float(abs(shap_vals[idx])), 4)),
            "method": "shap",
        })
    return results


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def explain_employee(
    employee_row: pd.Series | pd.DataFrame,
    pipeline: Pipeline,
    X_background: pd.DataFrame | None = None,
    top_k: int | None = None,
) -> list[dict]:
    """Return top-k explanation factors for a single employee.

    Tries SHAP first; falls back to perturbation method on failure.

    Each factor dict has keys:
        feature, observed_value, direction, magnitude, method

    ⚠️ Contributions are model signals, NOT proven causes.
    """
    k = top_k or EXPLANATION_TOP_K

    if isinstance(employee_row, pd.Series):
        employee_row = employee_row.to_frame().T.reset_index(drop=True)

    # Select only feature columns that pipeline expects
    if X_background is not None:
        feature_cols = [c for c in X_background.columns if c in employee_row.columns]
    else:
        exclude = set(DROP_COLS) | {TARGET_COL, ID_COL, "attrition_probability", "Rank"}
        feature_cols = [c for c in employee_row.columns if c not in exclude]
    X_row = employee_row[feature_cols].copy()

    try:
        if _shap_available():
            return _explain_shap(X_row, pipeline, k)
    except Exception as e:
        warnings.warn(f"SHAP failed ({e}), using perturbation fallback.", stacklevel=2)

    if X_background is None:
        raise ValueError("X_background is required for the perturbation fallback.")
    return _explain_fallback(X_row, pipeline, X_background, k)


def explain_batch(
    df: pd.DataFrame,
    pipeline: Pipeline,
    X_background: pd.DataFrame | None = None,
    top_k: int | None = None,
) -> dict:
    """Return explanation factors for every employee, keyed by EmployeeNumber or index."""
    results = {}
    for idx, row in df.iterrows():
        key = int(row["EmployeeNumber"]) if "EmployeeNumber" in df.columns else idx
        try:
            results[key] = explain_employee(row, pipeline, X_background, top_k)
        except Exception as e:
            results[key] = [{"error": str(e)}]
    return results


def global_feature_importance(
    pipeline: Pipeline,
    X_train: pd.DataFrame,
    y_train: pd.Series,
    n_repeats: int = 10,
) -> pd.DataFrame:
    """Return a DataFrame [feature, importance] using permutation importance."""
    perm = permutation_importance(
        pipeline, X_train, y_train,
        n_repeats=n_repeats,
        random_state=42,
        scoring="roc_auc",
        n_jobs=-1,
    )
    feature_names = X_train.columns.tolist()
    importance_df = pd.DataFrame({
        "feature": feature_names,
        "importance_mean": perm.importances_mean,
        "importance_std": perm.importances_std,
    }).sort_values("importance_mean", ascending=False).reset_index(drop=True)
    return importance_df
