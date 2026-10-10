# TalentGuard AI

> **HR Attrition Risk Prediction & Retention Decision-Support Tool**  
> Hackathon project · IBM HR Analytics dataset · Python 3.11+

---

## ⚠️ Important Disclaimer

TalentGuard AI is **decision support, not a resignation detector**. It must
not make automated hiring, firing, promotion, or disciplinary decisions.
Model outputs are estimates, not validated predictions for any specific
company without local data and validation.

---

## Features

| # | Feature |
|---|---------|
| 1 | Attrition probability prediction |
| 2 | Ranked Top-50 employee watch list |
| 3 | Top-3 local explanation factors per employee |
| 4 | Personalised Top-10 retention recommendations & conversation guides |
| 5 | Human approval workflow (every draft starts as `PENDING_APPROVAL`) |
| 6 | Streamlit HR dashboard with filters |
| 7 | CSV exports & model evaluation report |
| 8 | Responsible-AI notes & audit metadata |
| 9 | Retention What-If Simulator |
| 10 | Early-Warning Radar *(stretch)* |

---

## Tech Stack

- **Python** 3.11+
- **ML** scikit-learn (Pipeline, ColumnTransformer, HistGradientBoostingClassifier, LogisticRegression)
- **Explainability** SHAP (with rule-based fallback)
- **UI** Streamlit + Plotly
- **Testing** pytest
- **Tracking** MLflow *(optional)*

---

## Quick Start

### 1 · Clone & create virtual environment

```bash
# Windows (PowerShell)
git clone <repo-url>
cd talentguard-ai
python -m venv .venv
.venv\Scripts\Activate.ps1

# Linux / macOS
git clone <repo-url>
cd talentguard-ai
python -m venv .venv
source .venv/bin/activate
```

### 2 · Install dependencies

```bash
pip install -r requirements.txt
```

### 3 · Add the dataset

Download the **IBM HR Analytics Employee Attrition** dataset from
[Kaggle](https://www.kaggle.com/datasets/pavansubhasht/ibm-hr-analytics-attrition-dataset)
and place the CSV at:

```
data/WA_Fn-UseC_-HR-Employee-Attrition.csv
```

Or update `DATA_PATH` in `src/talentguard/config.py`.

### 4 · Run the app

```bash
streamlit run app.py
```

### 5 · Run tests

```bash
pytest tests/ -v
```

---

## Project Structure

```
talentguard-ai/
├── app.py                      # Streamlit entry point
├── requirements.txt
├── README.md
├── .gitignore
├── data/
│   └── README.md               # Dataset instructions (no CSV committed)
├── models/                     # Generated model artifacts (gitignored)
├── reports/                    # Generated charts & reports (gitignored)
├── notebooks/
│   └── exploratory_analysis.ipynb
├── src/talentguard/
│   ├── __init__.py
│   ├── config.py               # Paths, constants, feature lists
│   ├── data_validation.py      # Schema / quality checks
│   ├── preprocessing.py        # Leakage-safe pipeline
│   ├── eda.py                  # EDA charts & report
│   ├── train.py                # Model training
│   ├── evaluate.py             # Metrics & capacity metrics
│   ├── predict.py              # Scoring service & Top-50
│   ├── explain.py              # SHAP / fallback explanations
│   ├── recommendations.py      # Rule-based retention drafts
│   ├── what_if.py              # What-If Simulator
│   ├── approvals.py            # Approval workflow
│   ├── exports.py              # CSV / JSON exports
│   └── early_warning.py        # Snapshot trend analysis (stretch)
└── tests/
    ├── conftest.py
    └── test_placeholder.py
```

---

## Team Roles

| Member | Responsibility |
|--------|---------------|
| 1 | Data validation, EDA, dataset documentation |
| 2 | ML pipeline, model comparison, metrics |
| 3 | Explanations, recommendation rules, approval object |
| 4 | Streamlit integration, exports, demo, slides |

---

## Data Acquisition

This repository does **not** include any employee data.  
See `data/README.md` for instructions.

---

## Licence

For hackathon evaluation purposes only. Do not use real employee data.
