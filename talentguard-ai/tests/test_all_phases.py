"""
tests/test_all_phases.py – Comprehensive test suite for Phases 2-8
"""

import sys
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from talentguard.config import (
    DROP_COLS, TARGET_COL, WATCHLIST_SIZE, RETENTION_TOP_N,
    STATUS_PENDING, STATUS_APPROVED, STATUS_REJECTED, WHATIF_MUTABLE_FEATURES,
)


# ─── Shared fixture ──────────────────────────────────────────────────────────

def _make_df(n=20):
    """Synthetic IBM-schema DataFrame."""
    rng = np.random.default_rng(42)
    size = n
    return pd.DataFrame({
        "EmployeeNumber": range(1, size + 1),
        "Age": rng.integers(22, 60, size),
        "Attrition": ["Yes" if i % 5 == 0 else "No" for i in range(size)],
        "BusinessTravel": rng.choice(["Travel_Rarely", "Travel_Frequently", "Non-Travel"], size),
        "DailyRate": rng.integers(200, 1500, size),
        "Department": rng.choice(["Sales", "Research & Development", "Human Resources"], size),
        "DistanceFromHome": rng.integers(1, 29, size),
        "Education": rng.integers(1, 5, size),
        "EducationField": rng.choice(["Life Sciences", "Medical", "Marketing", "Technical Degree"], size),
        "EmployeeCount": [1] * size,
        "EnvironmentSatisfaction": rng.integers(1, 4, size),
        "Gender": rng.choice(["Male", "Female"], size),
        "HourlyRate": rng.integers(30, 100, size),
        "JobInvolvement": rng.integers(1, 4, size),
        "JobLevel": rng.integers(1, 5, size),
        "JobRole": rng.choice(["Sales Executive", "Research Scientist", "Laboratory Technician", "Manager"], size),
        "JobSatisfaction": rng.integers(1, 4, size),
        "MaritalStatus": rng.choice(["Single", "Married", "Divorced"], size),
        "MonthlyIncome": rng.integers(1009, 19999, size),
        "MonthlyRate": rng.integers(2000, 26000, size),
        "NumCompaniesWorked": rng.integers(0, 9, size),
        "Over18": ["Y"] * size,
        "OverTime": rng.choice(["Yes", "No"], size),
        "PercentSalaryHike": rng.integers(11, 25, size),
        "PerformanceRating": rng.integers(3, 4, size),
        "RelationshipSatisfaction": rng.integers(1, 4, size),
        "StandardHours": [80] * size,
        "StockOptionLevel": rng.integers(0, 3, size),
        "TotalWorkingYears": rng.integers(0, 40, size),
        "TrainingTimesLastYear": rng.integers(0, 6, size),
        "WorkLifeBalance": rng.integers(1, 4, size),
        "YearsAtCompany": rng.integers(0, 20, size),
        "YearsInCurrentRole": rng.integers(0, 18, size),
        "YearsSinceLastPromotion": rng.integers(0, 15, size),
        "YearsWithCurrManager": rng.integers(0, 17, size),
    })


@pytest.fixture
def raw_df():
    return _make_df(40)


@pytest.fixture
def encoded_df(raw_df):
    from talentguard.data_validation import load_and_validate
    df = raw_df.copy()
    df[TARGET_COL] = df[TARGET_COL].map({"Yes": 1, "No": 0})
    cols_to_drop = [c for c in DROP_COLS if c in df.columns]
    return df.drop(columns=cols_to_drop)


@pytest.fixture
def split_data(encoded_df):
    from talentguard.preprocessing import split_features_target, make_train_test_split
    X, y = split_features_target(encoded_df)
    return make_train_test_split(X, y)


@pytest.fixture
def trained_pipeline(encoded_df, split_data):
    from talentguard.preprocessing import get_feature_columns
    from talentguard.train import train_candidate
    X_train, X_test, y_train, y_test = split_data
    numeric_cols, categorical_cols = get_feature_columns(encoded_df)
    pipe = train_candidate(X_train, y_train, numeric_cols, categorical_cols)
    return pipe, X_train, X_test, y_train, y_test


# ─── Phase 2: Preprocessing ──────────────────────────────────────────────────

class TestPreprocessing:
    def test_target_not_in_X(self, encoded_df):
        from talentguard.preprocessing import split_features_target
        X, y = split_features_target(encoded_df)
        assert TARGET_COL not in X.columns

    def test_drop_cols_not_in_X(self, encoded_df):
        from talentguard.preprocessing import split_features_target
        X, _ = split_features_target(encoded_df)
        for col in DROP_COLS:
            assert col not in X.columns

    def test_no_train_test_overlap(self, encoded_df, split_data):
        X_train, X_test, _, _ = split_data
        common = set(X_train.index) & set(X_test.index)
        assert len(common) == 0

    def test_test_size_approx(self, encoded_df, split_data):
        X_train, X_test, _, _ = split_data
        ratio = len(X_test) / (len(X_train) + len(X_test))
        assert 0.15 <= ratio <= 0.25

    def test_pipeline_builds(self, encoded_df):
        from talentguard.preprocessing import build_pipeline, get_feature_columns
        num, cat = get_feature_columns(encoded_df)
        pipe = build_pipeline(num, cat)
        assert pipe is not None

    def test_pipeline_fits_and_transforms(self, encoded_df, split_data):
        from talentguard.preprocessing import build_pipeline, get_feature_columns
        X_train, X_test, y_train, _ = split_data
        num, cat = get_feature_columns(encoded_df)
        pipe = build_pipeline(num, cat)
        pipe.fit(X_train, y_train)
        out = pipe.transform(X_test)
        assert out.shape[0] == len(X_test)


# ─── Phase 3: Training & Evaluation ─────────────────────────────────────────

class TestTrainEvaluate:
    def test_dummy_trains(self, encoded_df, split_data):
        from talentguard.preprocessing import get_feature_columns
        from talentguard.train import train_dummy
        X_train, _, y_train, _ = split_data
        num, cat = get_feature_columns(encoded_df)
        pipe = train_dummy(X_train, y_train, num, cat)
        assert hasattr(pipe, "predict_proba")

    def test_logistic_trains(self, encoded_df, split_data):
        from talentguard.preprocessing import get_feature_columns
        from talentguard.train import train_logistic
        X_train, _, y_train, _ = split_data
        num, cat = get_feature_columns(encoded_df)
        pipe = train_logistic(X_train, y_train, num, cat)
        assert hasattr(pipe, "predict_proba")

    def test_candidate_trains(self, trained_pipeline):
        pipe, _, _, _, _ = trained_pipeline
        assert hasattr(pipe, "predict_proba")

    def test_scores_in_unit_interval(self, trained_pipeline):
        pipe, _, X_test, _, _ = trained_pipeline
        proba = pipe.predict_proba(X_test)[:, 1]
        assert (proba >= 0).all() and (proba <= 1).all()

    def test_precision_at_k(self):
        from talentguard.evaluate import precision_at_k
        y_true = np.array([1, 1, 0, 0, 1, 0, 0, 0, 0, 0])
        y_proba = np.array([0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05])
        p = precision_at_k(y_true, y_proba, k=5)
        assert 0 <= p <= 1

    def test_recall_at_k(self):
        from talentguard.evaluate import recall_at_k
        y_true = np.array([1, 1, 0, 0, 1, 0, 0, 0, 0, 0])
        y_proba = np.array([0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05])
        r = recall_at_k(y_true, y_proba, k=3)
        assert 0 <= r <= 1

    def test_precision_at_k_uses_held_out(self):
        """Top-2 among [1,1,0] = 2/2 = 1.0."""
        from talentguard.evaluate import precision_at_k
        y_true = np.array([1, 1, 0])
        y_proba = np.array([0.9, 0.8, 0.1])
        assert precision_at_k(y_true, y_proba, k=2) == 1.0

    def test_recall_at_k_correct(self):
        """Top-2 captures 2 out of 2 positives → recall=1.0."""
        from talentguard.evaluate import recall_at_k
        y_true = np.array([1, 1, 0])
        y_proba = np.array([0.9, 0.8, 0.1])
        assert recall_at_k(y_true, y_proba, k=2) == 1.0


# ─── Phase 4: Predict ────────────────────────────────────────────────────────

class TestPredict:
    def test_score_employees_shape(self, trained_pipeline, encoded_df):
        from talentguard.predict import score_employees
        pipe, _, _, _, _ = trained_pipeline
        scored = score_employees(encoded_df, pipe)
        assert "attrition_probability" in scored.columns
        assert len(scored) == len(encoded_df)

    def test_scores_in_bounds(self, trained_pipeline, encoded_df):
        from talentguard.predict import score_employees, validate_scores
        pipe, _, _, _, _ = trained_pipeline
        scored = score_employees(encoded_df, pipe)
        validate_scores(scored)  # should not raise

    def test_watchlist_max_size(self, trained_pipeline, encoded_df):
        from talentguard.predict import score_employees, get_top_n_watchlist
        pipe, _, _, _, _ = trained_pipeline
        scored = score_employees(encoded_df, pipe)
        wl = get_top_n_watchlist(scored, n=10)
        assert len(wl) <= 10

    def test_watchlist_descending_order(self, trained_pipeline, encoded_df):
        from talentguard.predict import score_employees, get_top_n_watchlist
        pipe, _, _, _, _ = trained_pipeline
        scored = score_employees(encoded_df, pipe)
        wl = get_top_n_watchlist(scored, n=10).reset_index()
        probs = wl["attrition_probability"].tolist()
        assert probs == sorted(probs, reverse=True)

    def test_employee_number_not_model_feature(self, encoded_df):
        from talentguard.preprocessing import split_features_target
        X, _ = split_features_target(encoded_df)
        assert "EmployeeNumber" not in X.columns


# ─── Phase 5: Recommendations ────────────────────────────────────────────────

class TestRecommendations:
    def test_draft_status_pending(self):
        from talentguard.recommendations import generate_retention_draft
        draft = generate_retention_draft(
            employee_id=1,
            risk_score=0.85,
            explanations=[{
                "feature": "OverTime",
                "observed_value": "Yes",
                "direction": "increases_risk",
                "magnitude": 0.22,
            }],
        )
        assert draft["status"] == STATUS_PENDING

    def test_draft_has_required_fields(self):
        from talentguard.recommendations import generate_retention_draft
        draft = generate_retention_draft(1, 0.7, [])
        for field in ["employee_id", "risk_score", "risk_reasons",
                      "recommended_actions", "conversation_guide",
                      "status", "created_at", "reviewed_by", "reviewed_at"]:
            assert field in draft

    def test_rule_matches_evidence(self):
        from talentguard.recommendations import _match_rules
        exps = [{"feature": "OverTime", "direction": "increases_risk", "magnitude": 0.2}]
        matched = _match_rules(exps)
        assert len(matched) >= 1
        assert matched[0]["signal_feature"] == "OverTime"

    def test_no_rule_without_evidence(self):
        from talentguard.recommendations import _match_rules
        exps = []  # no explanations
        matched = _match_rules(exps)
        assert len(matched) == 0

    def test_unsupported_feature_no_rule(self):
        from talentguard.recommendations import _match_rules
        exps = [{"feature": "SomeRandomFeature", "direction": "increases_risk", "magnitude": 0.5}]
        matched = _match_rules(exps)
        assert len(matched) == 0


# ─── Phase 6: Approvals ──────────────────────────────────────────────────────

class TestApprovals:
    def _make_draft(self):
        return {
            "employee_id": "1",
            "risk_score": 0.8,
            "risk_reasons": [],
            "recommended_actions": [],
            "conversation_guide": [],
            "status": STATUS_PENDING,
            "created_at": "2026-01-01T00:00:00Z",
            "reviewed_by": None,
            "reviewed_at": None,
            "review_note": None,
        }

    def test_approve_valid_transition(self):
        from talentguard.approvals import approve_draft
        draft = self._make_draft()
        approved = approve_draft(draft, reviewer_id="hr-1", note="Looks good")
        assert approved["status"] == STATUS_APPROVED
        assert approved["reviewed_by"] == "hr-1"

    def test_reject_valid_transition(self):
        from talentguard.approvals import reject_draft
        draft = self._make_draft()
        rejected = reject_draft(draft, reviewer_id="hr-1", note="Not needed")
        assert rejected["status"] == STATUS_REJECTED

    def test_approve_does_not_mutate_original(self):
        from talentguard.approvals import approve_draft
        draft = self._make_draft()
        _ = approve_draft(draft, "hr-1")
        assert draft["status"] == STATUS_PENDING  # original unchanged

    def test_invalid_transition_raises(self):
        from talentguard.approvals import approve_draft
        draft = self._make_draft()
        draft["status"] = STATUS_APPROVED  # already approved
        with pytest.raises(ValueError):
            approve_draft(draft, "hr-1")

    def test_pending_to_pending_raises(self):
        from talentguard.approvals import validate_transition
        with pytest.raises(ValueError):
            validate_transition(STATUS_PENDING, STATUS_PENDING)

    def test_approved_to_rejected_raises(self):
        from talentguard.approvals import validate_transition
        with pytest.raises(ValueError):
            validate_transition(STATUS_APPROVED, STATUS_REJECTED)

    def test_review_metadata_set(self):
        from talentguard.approvals import approve_draft
        draft = self._make_draft()
        approved = approve_draft(draft, "hr-test", "all good")
        assert approved["reviewed_at"] is not None
        assert approved["review_note"] == "all good"


# ─── Phase 7: What-If Simulator ──────────────────────────────────────────────

class TestWhatIf:
    def _make_row(self):
        return pd.Series({
            "EmployeeNumber": 1, "Age": 35, "Attrition": 1,
            "OverTime": "Yes", "JobSatisfaction": 2, "MonthlyIncome": 3000,
            "BusinessTravel": "Travel_Frequently", "DistanceFromHome": 20,
            "WorkLifeBalance": 1, "EnvironmentSatisfaction": 2,
            "RelationshipSatisfaction": 2, "TrainingTimesLastYear": 1,
            "JobLevel": 1, "PercentSalaryHike": 11,
            "StockOptionLevel": 0, "NumCompaniesWorked": 3,
            "EmployeeCount": 1, "StandardHours": 80, "Over18": "Y",
        })

    def test_reject_protected_attribute(self):
        from talentguard.what_if import validate_changes
        row = self._make_row()
        with pytest.raises(ValueError, match="protected"):
            validate_changes({"Gender": "Female"}, row)

    def test_reject_target_change(self):
        from talentguard.what_if import validate_changes
        row = self._make_row()
        with pytest.raises(ValueError):
            validate_changes({"Attrition": 0}, row)

    def test_reject_identifier_change(self):
        from talentguard.what_if import validate_changes
        row = self._make_row()
        with pytest.raises(ValueError):
            validate_changes({"EmployeeNumber": 999}, row)

    def test_reject_out_of_range(self):
        from talentguard.what_if import validate_changes
        row = self._make_row()
        with pytest.raises(ValueError, match="range"):
            validate_changes({"DistanceFromHome": 9999}, row)

    def test_reject_unmutable_feature(self):
        from talentguard.what_if import validate_changes
        row = self._make_row()
        with pytest.raises(ValueError):
            validate_changes({"SomeRandomCol": 5}, row)

    def test_valid_change_passes(self):
        from talentguard.what_if import validate_changes
        row = self._make_row()
        validate_changes({"OverTime": "No"}, row)  # should not raise


# ─── Phase 8: Exports ────────────────────────────────────────────────────────

class TestExports:
    def test_mask_employee_id_consistent(self):
        from talentguard.exports import mask_employee_id
        m1 = mask_employee_id(123)
        m2 = mask_employee_id(123)
        assert m1 == m2
        assert m1.startswith("EMP-")

    def test_mask_different_ids_differ(self):
        from talentguard.exports import mask_employee_id
        assert mask_employee_id(1) != mask_employee_id(2)

    def test_export_drafts_csv_fields(self):
        from talentguard.exports import export_drafts_csv
        import io
        drafts = [{
            "employee_id": "1", "risk_score": 0.8, "status": STATUS_PENDING,
            "risk_reasons": ["r1"], "recommended_actions": ["a1"],
            "conversation_guide": ["q1"], "limitations": "L",
            "created_at": "2026-01-01", "reviewed_by": None,
            "reviewed_at": None, "review_note": None,
        }]
        csv_bytes = export_drafts_csv(drafts)
        df = pd.read_csv(io.BytesIO(csv_bytes))
        assert "masked_id" in df.columns
        assert "status" in df.columns
        assert "risk_score" in df.columns

    def test_export_watchlist_csv_no_feature_columns(self, trained_pipeline, encoded_df):
        from talentguard.predict import score_employees, get_top_n_watchlist
        from talentguard.exports import export_watchlist_csv
        import io
        pipe, _, _, _, _ = trained_pipeline
        scored = score_employees(encoded_df, pipe)
        wl = get_top_n_watchlist(scored, n=10)
        csv_bytes = export_watchlist_csv(wl)
        df = pd.read_csv(io.BytesIO(csv_bytes))
        # Feature vectors should not appear
        assert "MonthlyIncome" not in df.columns
        assert "Age" not in df.columns
