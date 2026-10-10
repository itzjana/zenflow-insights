"""
train_model.py – One-shot training script
==========================================
Run with: python train_model.py
Trains DummyClassifier, LogisticRegression, and HistGradientBoostingClassifier.
Saves the best pipeline + metadata + evaluation report to models/.
"""

import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "src"))

import numpy as np
from talentguard.config import DATA_PATH, MODELS_DIR, WATCHLIST_SIZE
from talentguard.data_validation import load_and_validate
from talentguard.preprocessing import split_features_target, make_train_test_split, save_pipeline, get_feature_columns
from talentguard.train import train_dummy, train_logistic, train_candidate, run_cross_validation
from talentguard.evaluate import evaluate_model, precision_at_k, recall_at_k, generate_evaluation_report
from talentguard.predict import score_employees, get_top_n_watchlist
from talentguard.explain import explain_batch
from talentguard.recommendations import generate_top10_drafts
from talentguard.approvals import save_audit_log

print("="*60)
print("  TalentGuard AI — Model Training Pipeline")
print("="*60)

# 1. Load & validate
print(f"\n[1/7] Loading data from: {DATA_PATH}")
df, val_report = load_and_validate()
print(f"  Shape: {df.shape}, Attrition prevalence: {val_report['prevalence']*100:.1f}%")
print(f"  Dropped cols: {val_report['dropped_cols']}")
# Filter out known-OK warnings about pre-removed constant columns
real_issues = [i for i in val_report['issues'] if 'EmployeeCount' not in i and 'StandardHours' not in i and 'Over18' not in i]
if real_issues:
    print(f"  Issues: {real_issues}")

# 2. Split
print("\n[2/7] Splitting features and target...")
X, y = split_features_target(df)
X_train, X_test, y_train, y_test = make_train_test_split(X, y)
print(f"  X_train: {X_train.shape}, X_test: {X_test.shape}")
print(f"  Positive in train: {y_train.sum()}/{len(y_train)}, test: {y_test.sum()}/{len(y_test)}")

numeric_cols, categorical_cols = get_feature_columns(df)
print(f"  Numeric features: {len(numeric_cols)}, Categorical: {len(categorical_cols)}")

# 3. Train all models
print("\n[3/7] Training models...")
dummy_pipe  = train_dummy(X_train, y_train, numeric_cols, categorical_cols)
print("  [OK] DummyClassifier")
lr_pipe     = train_logistic(X_train, y_train, numeric_cols, categorical_cols)
print("  [OK] LogisticRegression")
hgb_pipe    = train_candidate(X_train, y_train, numeric_cols, categorical_cols)
print("  [OK] HistGradientBoostingClassifier")

# 4. Cross-validate on training data only
print("\n[4/7] Cross-validating on training data...")
cv_hgb = run_cross_validation(hgb_pipe, X_train, y_train, cv=5)
print(f"  HGB CV ROC-AUC: {cv_hgb['roc_auc']['mean']:.4f} ± {cv_hgb['roc_auc']['std']:.4f}")
print(f"  HGB CV Recall:  {cv_hgb['recall']['mean']:.4f} ± {cv_hgb['recall']['std']:.4f}")

# 5. Evaluate on held-out test set
print("\n[5/7] Evaluating on held-out test set...")
all_reports = []
for name, pipe in [
    ("DummyClassifier", dummy_pipe),
    ("LogisticRegression", lr_pipe),
    ("HistGradientBoostingClassifier", hgb_pipe),
]:
    y_proba = pipe.predict_proba(X_test)[:, 1]
    y_pred  = pipe.predict(X_test)
    rep = generate_evaluation_report(
        model_name=name,
        y_true=y_test.values,
        y_pred=y_pred,
        y_proba=y_proba,
        k=WATCHLIST_SIZE,
        prevalence=val_report["prevalence"],
        split_info={"test_size": 0.20, "seed": 42, "n_test": len(y_test), "n_train": len(y_train)},
        cv_results=cv_hgb if name == "HistGradientBoostingClassifier" else {},
    )
    all_reports.append(rep)
    m = rep["metrics"]
    print(f"\n  {name}:")
    print(f"    ROC-AUC:         {m['roc_auc']:.4f}")
    print(f"    Precision:       {m['precision']:.4f}")
    print(f"    Recall:          {m['recall']:.4f}")
    print(f"    F1:              {m['f1']:.4f}")
    print(f"    Precision@50:    {rep[f'precision_at_{WATCHLIST_SIZE}']:.4f}")
    print(f"    Recall@50:       {rep[f'recall_at_{WATCHLIST_SIZE}']:.4f}")
    cm = m["confusion_matrix"]
    print(f"    Confusion:       TN={cm['tn']} FP={cm['fp']} FN={cm['fn']} TP={cm['tp']}")

# 6. Save best pipeline (HGB)
print("\n[6/7] Saving best model pipeline...")
metadata = {
    "model": "HistGradientBoostingClassifier",
    "seed": 42,
    "test_size": 0.20,
    "prevalence": val_report["prevalence"],
    "n_rows": int(df.shape[0]),
    "n_features": int(X_train.shape[1]),
    "feature_schema": {"numeric": numeric_cols, "categorical": categorical_cols},
    "metrics": all_reports[-1]["metrics"],
    "cv_results": cv_hgb,
    "evaluation_reports": all_reports,
}
save_pipeline(hgb_pipe, metadata)
MODELS_DIR.mkdir(parents=True, exist_ok=True)
(MODELS_DIR / "evaluation_report.json").write_text(json.dumps(all_reports, indent=2), encoding="utf-8")
print(f"  [OK] Pipeline saved to: {MODELS_DIR}")

# 7. Score, explain, recommend
print("\n[7/7] Generating watchlist, explanations, and retention drafts...")
scored  = score_employees(df, hgb_pipe)
watchlist = get_top_n_watchlist(scored, n=50)
top10   = watchlist.head(10).reset_index()
X_bg, _ = split_features_target(df)
exps    = explain_batch(top10, hgb_pipe, X_bg)
drafts  = generate_top10_drafts(watchlist, exps, df)
save_audit_log(drafts)
print(f"  [OK] Watchlist: {len(watchlist)} employees")
print(f"  [OK] Explanations generated for {len(exps)} employees")
print(f"  [OK] {len(drafts)} retention drafts saved")

print("\n" + "="*60)
print("  TRAINING COMPLETE! Run the backend next:")
print("  python backend/main.py")
print("="*60)
