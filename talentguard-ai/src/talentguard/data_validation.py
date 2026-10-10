"""
data_validation.py – Phase 1
==============================
Validates the IBM HR Attrition CSV for schema, target labels,
duplicates, missingness, types, category levels, constants, and class
balance. Returns a validated DataFrame and a structured report dict.
"""

from __future__ import annotations

import warnings
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd

from .config import (
    DATA_PATH,
    DROP_COLS,
    TARGET_COL,
    TARGET_MAP,
)

# ---------------------------------------------------------------------------
# Expected IBM HR schema  (column → expected dtype category)
# ---------------------------------------------------------------------------
EXPECTED_NUMERIC_COLS = {
    "Age", "DailyRate", "DistanceFromHome", "Education",
    "EmployeeCount", "EmployeeNumber", "EnvironmentSatisfaction",
    "HourlyRate", "JobInvolvement", "JobLevel", "JobSatisfaction",
    "MonthlyIncome", "MonthlyRate", "NumCompaniesWorked",
    "PercentSalaryHike", "PerformanceRating", "RelationshipSatisfaction",
    "StandardHours", "StockOptionLevel", "TotalWorkingYears",
    "TrainingTimesLastYear", "WorkLifeBalance", "YearsAtCompany",
    "YearsInCurrentRole", "YearsSinceLastPromotion", "YearsWithCurrManager",
}

EXPECTED_CATEGORICAL_COLS = {
    "Attrition", "BusinessTravel", "Department", "EducationField",
    "Gender", "JobRole", "MaritalStatus", "Over18", "OverTime",
}


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def load_and_validate(path: str | Path | None = None) -> tuple[pd.DataFrame, dict]:
    """Load the CSV from *path* (defaults to config.DATA_PATH) and run all
    validation checks.

    Returns
    -------
    df : pd.DataFrame
        Cleaned DataFrame ready for EDA and preprocessing.
        - Target encoded to 0/1 (kept as 'Attrition' int column)
        - DROP_COLS removed
    report : dict
        Structured validation report.

    Raises
    ------
    FileNotFoundError : if the CSV does not exist.
    ValueError : if critical checks fail.
    """
    csv_path = Path(path) if path else DATA_PATH

    if not csv_path.exists():
        raise FileNotFoundError(
            f"IBM HR CSV not found at: {csv_path}\n"
            "See data/README.md for download instructions."
        )

    df_raw = pd.read_csv(csv_path)

    report: dict[str, Any] = {
        "path": str(csv_path),
        "raw_shape": df_raw.shape,
        "issues": [],
        "warnings": [],
    }

    # --- Run all checks ---
    schema_issues = check_schema(df_raw)
    report["schema_issues"] = schema_issues
    report["issues"].extend(schema_issues)

    target_issues = check_target(df_raw)
    report["target_issues"] = target_issues
    report["issues"].extend(target_issues)

    if target_issues:
        raise ValueError(f"Critical target column issues: {target_issues}")

    dup_count = check_duplicates(df_raw)
    report["duplicate_rows"] = dup_count
    if dup_count > 0:
        report["warnings"].append(f"{dup_count} duplicate rows found.")
        df_raw = df_raw.drop_duplicates().reset_index(drop=True)

    missing = check_missingness(df_raw)
    report["missing_values"] = missing.to_dict()
    if missing.sum() > 0:
        report["warnings"].append(f"Missing values in: {missing[missing > 0].index.tolist()}")

    constant_cols = check_constants(df_raw)
    report["constant_cols"] = constant_cols

    balance = check_class_balance(df_raw)
    report["class_balance"] = balance

    # --- Clean & prepare ---
    df = df_raw.copy()

    # Encode target
    df[TARGET_COL] = df[TARGET_COL].map(TARGET_MAP)
    if df[TARGET_COL].isna().any():
        raise ValueError("Unexpected target label after mapping – check TARGET_MAP in config.")

    df[TARGET_COL] = df[TARGET_COL].astype(int)

    # Drop constant columns (keep EmployeeNumber as identifier for scoring and UI)
    cols_to_drop = [c for c in DROP_COLS if c in df.columns and c != "EmployeeNumber"]
    df = df.drop(columns=cols_to_drop)
    report["dropped_cols"] = cols_to_drop

    report["clean_shape"] = df.shape
    report["prevalence"] = balance["positive_prevalence"]

    return df, report


def check_schema(df: pd.DataFrame) -> list[str]:
    """Return a list of schema violation messages (empty == OK)."""
    issues = []
    all_expected = EXPECTED_NUMERIC_COLS | EXPECTED_CATEGORICAL_COLS
    missing_cols = all_expected - set(df.columns)
    extra_cols = set(df.columns) - all_expected
    if missing_cols:
        issues.append(f"Missing expected columns: {sorted(missing_cols)}")
    if extra_cols:
        issues.append(f"Unexpected extra columns: {sorted(extra_cols)}")

    # Numeric type check
    for col in EXPECTED_NUMERIC_COLS:
        if col in df.columns and not pd.api.types.is_numeric_dtype(df[col]):
            issues.append(f"Column '{col}' expected numeric, got {df[col].dtype}")

    return issues


def check_target(df: pd.DataFrame) -> list[str]:
    """Validate target column presence and label values."""
    issues = []
    if TARGET_COL not in df.columns:
        issues.append(f"Target column '{TARGET_COL}' is missing.")
        return issues

    valid_labels = set(TARGET_MAP.keys())
    actual_labels = set(df[TARGET_COL].dropna().unique())
    unexpected = actual_labels - valid_labels
    if unexpected:
        issues.append(f"Unexpected target labels: {unexpected}. Expected: {valid_labels}")

    if df[TARGET_COL].isna().any():
        n = df[TARGET_COL].isna().sum()
        issues.append(f"Target column has {n} missing values.")

    return issues


def check_duplicates(df: pd.DataFrame) -> int:
    """Return number of duplicate rows."""
    return int(df.duplicated().sum())


def check_missingness(df: pd.DataFrame) -> pd.Series:
    """Return per-column missing-value counts (only columns with > 0 missing)."""
    missing = df.isnull().sum()
    return missing[missing > 0]


def check_constants(df: pd.DataFrame) -> list[str]:
    """Return list of constant (zero-variance) column names."""
    return [col for col in df.columns if df[col].nunique(dropna=False) <= 1]


def check_class_balance(df: pd.DataFrame) -> dict:
    """Return class counts and prevalence of the positive class."""
    counts = df[TARGET_COL].value_counts()
    total = len(df)
    yes_count = int(counts.get("Yes", 0))
    no_count = int(counts.get("No", 0))
    prevalence = round(yes_count / total, 4) if total > 0 else 0.0
    return {
        "total": total,
        "positive_count": yes_count,
        "negative_count": no_count,
        "positive_prevalence": prevalence,
        "negative_prevalence": round(1 - prevalence, 4),
    }
