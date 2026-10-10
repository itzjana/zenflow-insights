"""
tests/test_phase1_validation.py – Phase 1 data validation tests
"""

import sys
from pathlib import Path

import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from talentguard.data_validation import (
    check_class_balance,
    check_constants,
    check_duplicates,
    check_missingness,
    check_schema,
    check_target,
)
from talentguard.config import DROP_COLS, TARGET_COL


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_df(**overrides) -> pd.DataFrame:
    """Minimal valid IBM-schema DataFrame."""
    base = {
        "EmployeeNumber": [1, 2, 3, 4, 5],
        "Age": [30, 25, 40, 35, 28],
        "Attrition": ["No", "Yes", "No", "No", "Yes"],
        "BusinessTravel": ["Travel_Rarely"] * 5,
        "DailyRate": [800, 600, 1000, 750, 500],
        "Department": ["Sales", "R&D", "HR", "Sales", "R&D"],
        "DistanceFromHome": [5, 10, 2, 8, 15],
        "Education": [3, 2, 4, 3, 2],
        "EducationField": ["Life Sciences"] * 5,
        "EmployeeCount": [1, 1, 1, 1, 1],
        "EnvironmentSatisfaction": [3, 1, 4, 2, 3],
        "Gender": ["Male", "Female", "Male", "Female", "Male"],
        "HourlyRate": [65, 55, 90, 72, 48],
        "JobInvolvement": [3, 2, 4, 3, 1],
        "JobLevel": [2, 1, 3, 2, 1],
        "JobRole": ["Sales Executive", "Research Scientist", "HR", "Sales Executive", "Lab Technician"],
        "JobSatisfaction": [4, 1, 3, 2, 1],
        "MaritalStatus": ["Single", "Married", "Divorced", "Single", "Married"],
        "MonthlyIncome": [5000, 3000, 8000, 4500, 2500],
        "MonthlyRate": [14000, 12000, 20000, 15000, 10000],
        "NumCompaniesWorked": [1, 3, 2, 1, 5],
        "Over18": ["Y", "Y", "Y", "Y", "Y"],
        "OverTime": ["No", "Yes", "No", "No", "Yes"],
        "PercentSalaryHike": [14, 11, 20, 13, 10],
        "PerformanceRating": [3, 3, 4, 3, 3],
        "RelationshipSatisfaction": [3, 2, 4, 3, 1],
        "StandardHours": [80, 80, 80, 80, 80],
        "StockOptionLevel": [1, 0, 2, 1, 0],
        "TotalWorkingYears": [10, 4, 18, 7, 20],
        "TrainingTimesLastYear": [3, 2, 4, 3, 1],
        "WorkLifeBalance": [3, 1, 4, 2, 1],
        "YearsAtCompany": [5, 2, 12, 4, 15],
        "YearsInCurrentRole": [4, 2, 8, 3, 10],
        "YearsSinceLastPromotion": [1, 2, 4, 0, 5],
        "YearsWithCurrManager": [3, 1, 7, 2, 8],
    }
    base.update(overrides)
    return pd.DataFrame(base)


# ---------------------------------------------------------------------------
# check_target
# ---------------------------------------------------------------------------

def test_check_target_valid():
    df = _make_df()
    assert check_target(df) == []


def test_check_target_missing_column():
    df = _make_df().drop(columns=["Attrition"])
    issues = check_target(df)
    assert any("missing" in i.lower() for i in issues)


def test_check_target_invalid_labels():
    df = _make_df(Attrition=["Maybe", "Yes", "No", "No", "Yes"])
    issues = check_target(df)
    assert any("unexpected" in i.lower() for i in issues)


def test_check_target_null_values():
    df = _make_df(Attrition=["Yes", None, "No", "No", "Yes"])
    issues = check_target(df)
    assert any("missing" in i.lower() for i in issues)


# ---------------------------------------------------------------------------
# check_duplicates
# ---------------------------------------------------------------------------

def test_no_duplicates():
    df = _make_df()
    assert check_duplicates(df) == 0


def test_detects_duplicates():
    df = _make_df()
    df_duped = pd.concat([df, df.iloc[[0]]], ignore_index=True)
    assert check_duplicates(df_duped) == 1


# ---------------------------------------------------------------------------
# check_constants
# ---------------------------------------------------------------------------

def test_finds_constant_columns():
    df = _make_df()
    constants = check_constants(df)
    # EmployeeCount, StandardHours, Over18 are all constant in our fixture
    assert "EmployeeCount" in constants
    assert "StandardHours" in constants
    assert "Over18" in constants


def test_no_false_constant():
    df = _make_df()
    constants = check_constants(df)
    assert "Age" not in constants
    assert "MonthlyIncome" not in constants


# ---------------------------------------------------------------------------
# check_missingness
# ---------------------------------------------------------------------------

def test_no_missing():
    df = _make_df()
    missing = check_missingness(df)
    assert len(missing) == 0


def test_detects_missing():
    df = _make_df()
    df.loc[0, "Age"] = None
    missing = check_missingness(df)
    assert "Age" in missing.index
    assert missing["Age"] == 1


# ---------------------------------------------------------------------------
# check_class_balance
# ---------------------------------------------------------------------------

def test_class_balance_keys():
    df = _make_df()
    balance = check_class_balance(df)
    for key in ("total", "positive_count", "negative_count", "positive_prevalence"):
        assert key in balance


def test_class_balance_values():
    df = _make_df()  # 2 Yes, 3 No
    balance = check_class_balance(df)
    assert balance["total"] == 5
    assert balance["positive_count"] == 2
    assert balance["negative_count"] == 3
    assert abs(balance["positive_prevalence"] - 0.4) < 0.01


# ---------------------------------------------------------------------------
# DROP_COLS exclusion
# ---------------------------------------------------------------------------

def test_drop_cols_defined():
    """All DROP_COLS must be specified in config."""
    for col in ["EmployeeNumber", "EmployeeCount", "StandardHours", "Over18"]:
        assert col in DROP_COLS, f"{col} should be in DROP_COLS"


def test_identifier_excluded_from_x():
    """EmployeeNumber must be in DROP_COLS so it never appears in X."""
    assert "EmployeeNumber" in DROP_COLS


def test_target_excluded_from_x():
    """Attrition must NOT be in DROP_COLS (it's the target, handled separately)."""
    assert TARGET_COL not in DROP_COLS
