"""
TalentGuard AI – Central configuration
=======================================
Edit DATA_PATH to point to your local IBM HR Attrition CSV.
All other modules import from here; do not hard-code paths elsewhere.
"""

from pathlib import Path

# ---------------------------------------------------------------------------
# Repository root (two levels up from this file: src/talentguard/config.py)
# ---------------------------------------------------------------------------
ROOT_DIR = Path(__file__).resolve().parents[2]

# ---------------------------------------------------------------------------
# Data
# ---------------------------------------------------------------------------
DATA_DIR = ROOT_DIR / "data"

# ← Update this path if your CSV lives elsewhere
DATA_PATH = DATA_DIR / "WA_Fn-UseC_-HR-Employee-Attrition.csv"

# ---------------------------------------------------------------------------
# Model artifacts
# ---------------------------------------------------------------------------
MODELS_DIR = ROOT_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

PIPELINE_PATH = MODELS_DIR / "pipeline.joblib"
METADATA_PATH = MODELS_DIR / "metadata.json"

# ---------------------------------------------------------------------------
# Reports
# ---------------------------------------------------------------------------
REPORTS_DIR = ROOT_DIR / "reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# Target & identifier columns
# ---------------------------------------------------------------------------
TARGET_COL = "Attrition"
TARGET_MAP = {"Yes": 1, "No": 0}

ID_COL = "EmployeeNumber"

# Columns to exclude from feature matrices X (identifiers + constants)
DROP_COLS = ["EmployeeNumber", "EmployeeCount", "StandardHours", "Over18"]

# ---------------------------------------------------------------------------
# Train/test split
# ---------------------------------------------------------------------------
TEST_SIZE = 0.20
RANDOM_SEED = 42

# ---------------------------------------------------------------------------
# Watch list & retention capacity
# ---------------------------------------------------------------------------
WATCHLIST_SIZE = 50      # Top-N employees to flag
RETENTION_TOP_N = 10     # Employees to generate retention drafts for
EXPLANATION_TOP_K = 3    # Top-K SHAP / fallback explanation factors

# ---------------------------------------------------------------------------
# Approval statuses
# ---------------------------------------------------------------------------
STATUS_PENDING = "PENDING_APPROVAL"
STATUS_APPROVED = "APPROVED"
STATUS_REJECTED = "REJECTED"
ALLOWED_TRANSITIONS = {
    STATUS_PENDING: {STATUS_APPROVED, STATUS_REJECTED},
}

# ---------------------------------------------------------------------------
# What-If: features the user IS allowed to modify
# Sensitive / protected attributes are not in this list.
# ---------------------------------------------------------------------------
WHATIF_MUTABLE_FEATURES = [
    "OverTime",
    "JobSatisfaction",
    "WorkLifeBalance",
    "EnvironmentSatisfaction",
    "RelationshipSatisfaction",
    "TrainingTimesLastYear",
    "JobLevel",
    "MonthlyIncome",
    "BusinessTravel",
    "DistanceFromHome",
    "NumCompaniesWorked",
    "PercentSalaryHike",
    "StockOptionLevel",
]

# ---------------------------------------------------------------------------
# MLflow (optional)
# ---------------------------------------------------------------------------
MLFLOW_EXPERIMENT_NAME = "talentguard-attrition"
MLFLOW_TRACKING_URI = str(ROOT_DIR / "mlruns")
