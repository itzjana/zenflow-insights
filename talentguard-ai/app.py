"""
app.py – TalentGuard AI · Streamlit Entry Point (Phase 8 complete)
====================================================================
Run with:  streamlit run app.py

All 8 pages fully wired. ML logic lives in src/talentguard.
"""

import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "src"))

import numpy as np
import pandas as pd
import streamlit as st

# ── Page config ────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="TalentGuard AI",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── CSS ────────────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
html,body,[class*="css"]{font-family:'Inter',sans-serif;}
.stApp{background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);}
section[data-testid="stSidebar"]{
  background:rgba(255,255,255,0.05);
  backdrop-filter:blur(12px);
  border-right:1px solid rgba(255,255,255,0.08);
}
div[data-testid="metric-container"]{
  background:rgba(255,255,255,0.07);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:12px;padding:1rem;
  backdrop-filter:blur(8px);
}
.stButton>button{
  background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
  color:white;border:none;border-radius:8px;font-weight:600;
  transition:opacity 0.2s;
}
.stButton>button:hover{opacity:0.85;}
.approve-btn>button{background:linear-gradient(135deg,#10b981,#059669)!important;}
.reject-btn>button{background:linear-gradient(135deg,#ef4444,#dc2626)!important;}
.rai-banner{
  background:rgba(255,180,0,0.12);border-left:4px solid #ffb400;
  border-radius:8px;padding:.75rem 1rem;margin-bottom:1rem;
  font-size:.85rem;color:#ffe082;
}
.risk-high{color:#ef4444;font-weight:700;}
.risk-med{color:#f59e0b;font-weight:600;}
.risk-low{color:#10b981;font-weight:500;}
h1{color:#e0e0ff!important;font-weight:700;}
h2{color:#c5c5f5!important;font-weight:600;}
h3{color:#a5a5e5!important;}
.stDataFrame{border-radius:10px;overflow:hidden;}
.stTabs [data-baseweb="tab-list"]{
  gap:8px;background:rgba(255,255,255,0.04);
  border-radius:10px;padding:4px;
}
.stTabs [data-baseweb="tab"]{border-radius:8px;color:#aaa;font-weight:500;}
.stTabs [aria-selected="true"]{
  background:rgba(102,126,234,0.35)!important;color:white!important;
}
</style>
""", unsafe_allow_html=True)

# ── Imports from src ────────────────────────────────────────────────────────
from talentguard.config import (
    DATA_PATH, WATCHLIST_SIZE, RETENTION_TOP_N,
    STATUS_PENDING, STATUS_APPROVED, STATUS_REJECTED,
    WHATIF_MUTABLE_FEATURES,
)
from talentguard.data_validation import load_and_validate
from talentguard.eda import (
    generate_eda_report, plot_attrition_rate, plot_attrition_by_feature,
    plot_correlation_heatmap, plot_income_distribution,
    plot_age_distribution, plot_tenure_vs_attrition, CANDIDATE_FEATURES,
)
from talentguard.preprocessing import (
    split_features_target, make_train_test_split,
    build_pipeline, save_pipeline, load_pipeline, get_feature_columns,
)
from talentguard.train import run_full_training
from talentguard.evaluate import (
    evaluate_model, precision_at_k, recall_at_k,
    generate_evaluation_report, plot_roc_curve,
    plot_confusion_matrix, plot_model_comparison,
)
from talentguard.predict import score_employees, get_top_n_watchlist, predict_labels
from talentguard.explain import explain_employee, explain_batch, global_feature_importance
from talentguard.recommendations import generate_top10_drafts
from talentguard.approvals import (
    approve_draft, reject_draft, save_audit_log, load_audit_log,
    get_pending, get_approved, get_rejected,
)
from talentguard.what_if import simulate, validate_changes, get_mutable_feature_options
from talentguard.exports import export_watchlist_csv, export_drafts_csv, export_audit_json
from talentguard.early_warning import generate_synthetic_demo, plot_risk_trends, SYNTHETIC_DEMO_LABEL


# ══════════════════════════════════════════════════════════════════════════════
# Session state helpers
# ══════════════════════════════════════════════════════════════════════════════

def _init_state():
    defaults = {
        "df": None,
        "val_report": None,
        "pipeline": None,
        "metadata": None,
        "scored_df": None,
        "watchlist": None,
        "explanations": None,
        "drafts": None,
        "eval_reports": None,
        "trained": False,
        "X_train": None,
        "X_test": None,
        "y_train": None,
        "y_test": None,
        "numeric_cols": None,
        "categorical_cols": None,
    }
    for k, v in defaults.items():
        if k not in st.session_state:
            st.session_state[k] = v

_init_state()


def _run_pipeline():
    """Load data → validate → train → score → explain → recommend."""
    with st.spinner("Loading and validating data…"):
        df, report = load_and_validate()
        st.session_state.df = df
        st.session_state.val_report = report

    with st.spinner("Splitting data and training models…"):
        X, y = split_features_target(df)
        X_train, X_test, y_train, y_test = make_train_test_split(X, y)
        st.session_state.X_train = X_train
        st.session_state.X_test = X_test
        st.session_state.y_train = y_train
        st.session_state.y_test = y_test

        results = run_full_training(df, X_train, X_test, y_train, y_test)
        st.session_state.pipeline = results["candidate_pipe"]
        st.session_state.numeric_cols = results["numeric_cols"]
        st.session_state.categorical_cols = results["categorical_cols"]

        # Save pipeline
        save_pipeline(results["candidate_pipe"], {
            "model": "HistGradientBoostingClassifier",
            "seed": 42,
            "test_size": 0.20,
            "feature_schema": {"numeric": results["numeric_cols"], "categorical": results["categorical_cols"]},
        })
        st.session_state.trained = True

    with st.spinner("Evaluating all models…"):
        reports = []
        for name, pipe in [
            ("DummyClassifier", results["dummy_pipe"]),
            ("LogisticRegression", results["logistic_pipe"]),
            ("HistGradientBoostingClassifier", results["candidate_pipe"]),
        ]:
            y_proba = pipe.predict_proba(X_test)[:, 1]
            y_pred = pipe.predict(X_test)
            report = generate_evaluation_report(
                model_name=name,
                y_true=y_test.values,
                y_pred=y_pred,
                y_proba=y_proba,
                prevalence=report["prevalence"],
                split_info={"test_size": 0.20, "seed": 42, "n_test": len(y_test)},
                cv_results=results.get(f"cv_{name.lower().split('(')[0].strip()}", {}),
            )
            reports.append(report)
        st.session_state.eval_reports = reports

    with st.spinner("Scoring all employees and building watch list…"):
        scored = score_employees(df, results["candidate_pipe"])
        watchlist = get_top_n_watchlist(scored)
        st.session_state.scored_df = scored
        st.session_state.watchlist = watchlist

    with st.spinner("Generating explanations (this may take a moment)…"):
        top_df = watchlist.head(RETENTION_TOP_N).reset_index()
        X_background, _ = split_features_target(df)
        exps = explain_batch(top_df, results["candidate_pipe"], X_background)
        st.session_state.explanations = exps

    with st.spinner("Generating retention drafts…"):
        drafts = generate_top10_drafts(watchlist, st.session_state.explanations, df)
        existing = load_audit_log()
        # Merge: keep existing reviewed drafts
        existing_ids = {d["employee_id"] for d in existing}
        for d in drafts:
            if d["employee_id"] not in existing_ids:
                existing.append(d)
        save_audit_log(existing)
        st.session_state.drafts = existing


# ══════════════════════════════════════════════════════════════════════════════
# Sidebar
# ══════════════════════════════════════════════════════════════════════════════

PAGES = {
    "🏠 Overview": "overview",
    "📊 EDA": "eda",
    "📋 Top-50 Watch List": "watchlist",
    "👤 Employee Detail": "employee_detail",
    "🎯 Retention Planner": "retention_planner",
    "🔮 What-If Simulator": "what_if",
    "📈 Model Evaluation": "model_evaluation",
    "⚖️ Responsible AI": "responsible_ai",
    "📡 Early Warning *(stretch)*": "early_warning",
}

with st.sidebar:
    st.markdown("## 🛡️ TalentGuard AI")
    st.caption("HR Attrition Risk · Decision Support")
    st.markdown("---")
    page_label = st.radio("Navigate", list(PAGES.keys()), index=0, label_visibility="collapsed")
    st.markdown("---")

    if st.session_state.trained:
        st.success("✅ Models trained")
    else:
        st.warning("⚠️ Models not trained")

    if st.button("🚀 Run Full Pipeline", use_container_width=True):
        try:
            _run_pipeline()
            st.success("Pipeline complete!")
            st.rerun()
        except FileNotFoundError as e:
            st.error(str(e))
        except Exception as e:
            st.error(f"Error: {e}")

    st.markdown("---")
    st.caption(
        "⚠️ **Decision support only.** "
        "Not a resignation detector. Must not drive automated employment decisions."
    )

page = PAGES[page_label]

# ── Global disclaimer banner ────────────────────────────────────────────────
st.markdown(
    '<div class="rai-banner">'
    "⚠️ <strong>TalentGuard AI is decision support, not a resignation detector.</strong> "
    "Scores are probabilistic estimates, not guarantees. All drafts require human review."
    "</div>",
    unsafe_allow_html=True,
)


# ══════════════════════════════════════════════════════════════════════════════
# PAGE: Overview
# ══════════════════════════════════════════════════════════════════════════════
if page == "overview":
    st.title("🛡️ TalentGuard AI — Overview")
    st.markdown("Prioritise supportive retention conversations with data-driven insights.")

    r = st.session_state.val_report
    er = (st.session_state.eval_reports or [{}])[-1]  # best model (candidate)
    metrics = er.get("metrics", {})

    col1, col2, col3, col4, col5 = st.columns(5)
    col1.metric("Dataset Rows", f"{r['raw_shape'][0]:,}" if r else "—")
    col2.metric("Observed Attrition", f"{r['prevalence']*100:.1f}%" if r else "—")
    col3.metric("Best Model", "HGB Classifier" if st.session_state.trained else "—")
    col4.metric("ROC-AUC", f"{metrics.get('roc_auc', 0):.3f}" if metrics else "—")
    col5.metric(f"Precision@{WATCHLIST_SIZE}",
                f"{er.get(f'precision_at_{WATCHLIST_SIZE}', 0):.3f}" if metrics else "—")

    st.markdown("---")

    if not st.session_state.trained:
        st.info(
            "📂 **Getting Started**\n\n"
            f"1. Place the IBM HR CSV at: `{DATA_PATH}`\n"
            "2. Click **🚀 Run Full Pipeline** in the sidebar.\n"
            "3. Explore all pages!"
        )

    c1, c2 = st.columns(2)
    with c1:
        st.markdown("### Pipeline Architecture")
        st.code("""IBM HR CSV
  → Data validation & EDA
  → Leakage-safe preprocessing
  → DummyClassifier baseline
  → LogisticRegression baseline
  → HistGradientBoosting (candidate)
  → Held-out evaluation + Precision@50
  → Scoring service
       → Top-50 ranked watchlist
       → Top-3 local explanations
       → Top-10 retention drafts
  → What-If Simulator
  → HR approval workflow + audit
  → CSV exports""", language="text")
    with c2:
        st.markdown("### Four-Hour Build Plan")
        st.markdown("""
| Time | Work |
|------|------|
| 0:00–0:20 | Setup, load data, assign roles |
| 0:20–1:10 | Validation, EDA, leakage checks |
| 1:10–2:20 | Baselines, candidate model, evaluation |
| 2:20–3:10 | Explanations, Top-10 recommendations |
| 3:10–3:40 | What-If Simulator |
| 3:40–4:00 | Rehearse demo & pitch |
""")


# ══════════════════════════════════════════════════════════════════════════════
# PAGE: EDA
# ══════════════════════════════════════════════════════════════════════════════
elif page == "eda":
    st.title("📊 Exploratory Data Analysis")

    df = st.session_state.df
    if df is None:
        st.warning("Run the pipeline first to load data.")
        st.stop()

    report = generate_eda_report(df)

    col1, col2, col3 = st.columns(3)
    col1.metric("Total Employees", f"{report['total_rows']:,}")
    col2.metric("Attrition Count", f"{report['attrition_count']:,}")
    col3.metric("Attrition Rate", f"{report['attrition_rate']*100:.1f}%")

    st.markdown("---")
    tab1, tab2, tab3, tab4 = st.tabs(["Distribution", "Risk Patterns", "Feature Details", "Correlations"])

    with tab1:
        c1, c2 = st.columns(2)
        with c1:
            st.plotly_chart(plot_attrition_rate(df), use_container_width=True)
        with c2:
            st.plotly_chart(plot_age_distribution(df), use_container_width=True)
        st.plotly_chart(plot_income_distribution(df), use_container_width=True)

    with tab2:
        st.plotly_chart(plot_tenure_vs_attrition(df), use_container_width=True)
        feat = st.selectbox("Feature", [f for f in CANDIDATE_FEATURES if f in df.columns])
        st.plotly_chart(plot_attrition_by_feature(df, feat), use_container_width=True)

    with tab3:
        st.markdown("### Feature-level Attrition Rates")
        st.caption("⚠️ All patterns are associational, not causal.")
        patterns = report["feature_patterns"]
        for feat, rates in patterns.items():
            with st.expander(f"📌 {feat}"):
                rate_df = pd.DataFrame(list(rates.items()), columns=[feat, "Attrition Rate"])
                rate_df["Attrition Rate"] = (rate_df["Attrition Rate"] * 100).round(1).astype(str) + "%"
                st.dataframe(rate_df, use_container_width=True, hide_index=True)

    with tab4:
        st.plotly_chart(plot_correlation_heatmap(df), use_container_width=True)


# ══════════════════════════════════════════════════════════════════════════════
# PAGE: Top-50 Watch List
# ══════════════════════════════════════════════════════════════════════════════
elif page == "watchlist":
    st.title("📋 Top-50 At-Risk Watch List")
    st.markdown(f"Employees ranked by predicted attrition probability. HR capacity: **{WATCHLIST_SIZE} conversations/cycle.**")

    watchlist = st.session_state.watchlist
    if watchlist is None:
        st.warning("Run the pipeline to generate the watch list.")
        st.stop()

    # Filters
    col1, col2 = st.columns([3, 1])
    with col1:
        min_prob = st.slider("Minimum risk probability", 0.0, 1.0, 0.0, 0.05)
    with col2:
        show_n = st.number_input("Show top N", min_value=5, max_value=50, value=50)

    display = watchlist.reset_index()
    if "attrition_probability" in display.columns:
        display = display[display["attrition_probability"] >= min_prob].head(int(show_n))

    # Colour-code risk
    def _risk_badge(p):
        if p >= 0.7: return f'<span class="risk-high">🔴 {p:.2%}</span>'
        if p >= 0.4: return f'<span class="risk-med">🟡 {p:.2%}</span>'
        return f'<span class="risk-low">🟢 {p:.2%}</span>'

    show_cols = ["Rank", "EmployeeNumber", "attrition_probability"]
    show_cols = [c for c in show_cols if c in display.columns]

    st.dataframe(
        display[show_cols].rename(columns={"attrition_probability": "Risk Score", "EmployeeNumber": "Emp ID"}),
        use_container_width=True,
    )

    col1, col2 = st.columns(2)
    with col1:
        csv_bytes = export_watchlist_csv(watchlist)
        st.download_button("⬇️ Download Watch List CSV", data=csv_bytes,
                           file_name="watchlist.csv", mime="text/csv")


# ══════════════════════════════════════════════════════════════════════════════
# PAGE: Employee Detail
# ══════════════════════════════════════════════════════════════════════════════
elif page == "employee_detail":
    st.title("👤 Employee Detail")

    watchlist = st.session_state.watchlist
    df = st.session_state.df
    pipeline = st.session_state.pipeline
    exps = st.session_state.explanations

    if watchlist is None or df is None:
        st.warning("Run the pipeline first.")
        st.stop()

    wl = watchlist.reset_index()
    if "EmployeeNumber" in wl.columns:
        emp_options = wl["EmployeeNumber"].astype(str).tolist()
        selected_emp = st.selectbox("Select Employee (from Watch List)", emp_options)
        emp_row = df[df["EmployeeNumber"].astype(str) == selected_emp].iloc[0] \
            if "EmployeeNumber" in df.columns else df.iloc[int(selected_emp)]
        emp_id = int(selected_emp)
    else:
        selected_idx = st.selectbox("Select Rank", wl.index.tolist())
        emp_row = df.iloc[selected_idx]
        emp_id = selected_idx

    risk_score = float(wl[wl["EmployeeNumber"].astype(str) == str(emp_id)]["attrition_probability"].iloc[0]) \
        if "EmployeeNumber" in wl.columns else 0.0

    col1, col2, col3 = st.columns(3)
    col1.metric("Employee ID", f"EMP-{str(emp_id)[-4:]}")
    col2.metric("Attrition Risk", f"{risk_score:.2%}")
    col3.metric("Dept.", emp_row.get("Department", "—"))

    st.markdown("---")
    c1, c2 = st.columns(2)

    with c1:
        st.markdown("### Feature Summary")
        feature_data = {
            "Age": emp_row.get("Age", "—"),
            "Department": emp_row.get("Department", "—"),
            "Job Role": emp_row.get("JobRole", "—"),
            "Job Level": emp_row.get("JobLevel", "—"),
            "Monthly Income": f"${emp_row.get('MonthlyIncome', 0):,.0f}",
            "OverTime": emp_row.get("OverTime", "—"),
            "Job Satisfaction": emp_row.get("JobSatisfaction", "—"),
            "Work-Life Balance": emp_row.get("WorkLifeBalance", "—"),
            "Business Travel": emp_row.get("BusinessTravel", "—"),
            "Years at Company": emp_row.get("YearsAtCompany", "—"),
        }
        st.dataframe(pd.DataFrame(list(feature_data.items()), columns=["Feature", "Value"]),
                     use_container_width=True, hide_index=True)

    with c2:
        st.markdown("### Local Explanation Factors")
        st.caption("⚠️ Contributions are model signals, NOT proven causes of resignation.")
        emp_exps = exps.get(emp_id, []) if exps else []
        if emp_exps:
            for i, e in enumerate(emp_exps):
                icon = "🔴" if e.get("direction") == "increases_risk" else "🟢"
                direction = e.get("direction", "").replace("_", " ")
                st.markdown(
                    f"**{i+1}. {e['feature']}** = `{e['observed_value']}`  \n"
                    f"{icon} {direction} · magnitude: `{e.get('magnitude', 0):.4f}`"
                )
        else:
            st.info("Explanations available after pipeline run.")


# ══════════════════════════════════════════════════════════════════════════════
# PAGE: Retention Planner
# ══════════════════════════════════════════════════════════════════════════════
elif page == "retention_planner":
    st.title("🎯 Retention Planner — Top 10")
    st.markdown(
        "Evidence-grounded retention conversation guides. "
        "All drafts begin as **PENDING_APPROVAL** and require explicit HR review."
    )

    if st.session_state.drafts is None:
        st.warning("Run the pipeline to generate retention drafts.")
        st.stop()

    drafts = st.session_state.drafts

    # Reviewer identity
    reviewer_id = st.text_input("Your HR reviewer ID (for audit)", value="hr-reviewer-1")

    tab_pending, tab_approved, tab_rejected = st.tabs([
        f"⏳ Pending ({len(get_pending(drafts))})",
        f"✅ Approved ({len(get_approved(drafts))})",
        f"❌ Rejected ({len(get_rejected(drafts))})",
    ])

    def _render_draft(draft, idx, reviewer_id):
        emp = draft["employee_id"]
        risk = draft["risk_score"]
        with st.expander(f"EMP-{str(emp)[-4:]} · Risk: {risk:.2%} · Status: {draft['status']}", expanded=(idx == 0)):
            c1, c2 = st.columns(2)
            with c1:
                st.markdown("**Risk Reasons:**")
                for r in draft["risk_reasons"]:
                    st.markdown(f"- {r}")
                st.markdown("**Recommended Actions:**")
                for a in draft["recommended_actions"]:
                    st.markdown(f"- {a}")
            with c2:
                st.markdown("**Conversation Guide:**")
                for q in draft["conversation_guide"]:
                    st.markdown(f"- *{q}*")
                st.caption(draft.get("limitations", ""))

            if draft["status"] == STATUS_PENDING:
                note = st.text_input(f"Review note for EMP-{str(emp)[-4:]}", key=f"note_{emp}")
                bc1, bc2 = st.columns(2)
                with bc1:
                    if st.button(f"✅ Approve", key=f"approve_{emp}"):
                        updated = approve_draft(draft, reviewer_id, note)
                        for i, d in enumerate(drafts):
                            if d["employee_id"] == emp:
                                drafts[i] = updated
                        save_audit_log(drafts)
                        st.session_state.drafts = drafts
                        st.rerun()
                with bc2:
                    if st.button(f"❌ Reject", key=f"reject_{emp}"):
                        updated = reject_draft(draft, reviewer_id, note)
                        for i, d in enumerate(drafts):
                            if d["employee_id"] == emp:
                                drafts[i] = updated
                        save_audit_log(drafts)
                        st.session_state.drafts = drafts
                        st.rerun()

    with tab_pending:
        pending = get_pending(drafts)
        if not pending:
            st.success("All drafts have been reviewed!")
        for i, d in enumerate(pending):
            _render_draft(d, i, reviewer_id)

    with tab_approved:
        for i, d in enumerate(get_approved(drafts)):
            _render_draft(d, i, reviewer_id)

    with tab_rejected:
        for i, d in enumerate(get_rejected(drafts)):
            _render_draft(d, i, reviewer_id)

    st.markdown("---")
    c1, c2 = st.columns(2)
    with c1:
        st.download_button("⬇️ Download Drafts CSV",
                           data=export_drafts_csv(drafts),
                           file_name="retention_drafts.csv", mime="text/csv")
    with c2:
        st.download_button("⬇️ Download Audit JSON",
                           data=export_audit_json(drafts),
                           file_name="audit_log.json", mime="application/json")


# ══════════════════════════════════════════════════════════════════════════════
# PAGE: What-If Simulator
# ══════════════════════════════════════════════════════════════════════════════
elif page == "what_if":
    st.title("🔮 Retention What-If Simulator")
    st.error(
        "🔬 **HYPOTHETICAL MODEL SCENARIO** — Score changes are NOT causal effects "
        "or guarantees. A lower score does not prove that the real intervention will "
        "reduce resignation risk."
    )

    df = st.session_state.df
    pipeline = st.session_state.pipeline
    watchlist = st.session_state.watchlist

    if pipeline is None or df is None:
        st.warning("Run the pipeline first.")
        st.stop()

    wl = watchlist.reset_index()
    if "EmployeeNumber" in wl.columns:
        emp_options = wl["EmployeeNumber"].astype(str).tolist()
        selected = st.selectbox("Select Employee", emp_options)
        emp_row = df[df["EmployeeNumber"].astype(str) == selected].iloc[0]
    else:
        st.warning("EmployeeNumber not available.")
        st.stop()

    mutable_opts = get_mutable_feature_options(df)
    st.markdown("### Adjust Features")
    st.caption("Only approved, validated features can be modified.")

    changes = {}
    cols = st.columns(3)
    for i, (feat, opts) in enumerate(mutable_opts.items()):
        if feat not in emp_row.index:
            continue
        with cols[i % 3]:
            current_val = emp_row.get(feat)
            if opts["type"] == "numeric":
                new_val = st.number_input(
                    feat,
                    min_value=float(opts["min"]),
                    max_value=float(opts["max"]),
                    value=float(current_val) if pd.notna(current_val) else float(opts["min"]),
                    key=f"wi_{feat}",
                )
            else:
                vals = opts["values"]
                idx = vals.index(current_val) if current_val in vals else 0
                new_val = st.selectbox(feat, vals, index=idx, key=f"wi_{feat}")

            if str(new_val) != str(current_val):
                changes[feat] = new_val

    if st.button("🔮 Run Simulation"):
        if not changes:
            st.info("No changes made yet.")
        else:
            try:
                result = simulate(emp_row, changes, pipeline)
                st.markdown("---")
                col1, col2, col3 = st.columns(3)
                col1.metric("Baseline Risk", f"{result['baseline_score']:.2%}")
                col2.metric("Scenario Risk", f"{result['scenario_score']:.2%}",
                            delta=f"{result['delta_pp']:+.1f} pp")
                col3.metric("Direction", result["delta_direction"].replace("_", " ").title())

                st.markdown("**Changed Fields:**")
                for feat, chg in result["changed_fields"].items():
                    st.markdown(f"- **{feat}**: `{chg['from']}` → `{chg['to']}`")

                st.warning(result["caveat"])
            except ValueError as e:
                st.error(f"Validation error: {e}")


# ══════════════════════════════════════════════════════════════════════════════
# PAGE: Model Evaluation
# ══════════════════════════════════════════════════════════════════════════════
elif page == "model_evaluation":
    st.title("📈 Model Evaluation Report")
    st.markdown(
        "Held-out test set metrics only. Accuracy shown for context; "
        "primary metrics are **ROC-AUC** and capacity metrics."
    )

    if not st.session_state.trained or not st.session_state.eval_reports:
        st.warning("Run the pipeline to generate evaluation results.")
        st.stop()

    reports = st.session_state.eval_reports
    best = reports[-1]  # HistGradientBoosting
    metrics = best["metrics"]

    col1, col2, col3, col4, col5, col6 = st.columns(6)
    col1.metric("ROC-AUC", f"{metrics['roc_auc']:.3f}")
    col2.metric("Precision", f"{metrics['precision']:.3f}")
    col3.metric("Recall", f"{metrics['recall']:.3f}")
    col4.metric("F1", f"{metrics['f1']:.3f}")
    col5.metric(f"Precision@{WATCHLIST_SIZE}", f"{best.get(f'precision_at_{WATCHLIST_SIZE}', 0):.3f}")
    col6.metric(f"Recall@{WATCHLIST_SIZE}", f"{best.get(f'recall_at_{WATCHLIST_SIZE}', 0):.3f}")

    st.markdown("---")
    tab1, tab2, tab3 = st.tabs(["Model Comparison", "ROC Curve", "Confusion Matrix"])

    with tab1:
        st.plotly_chart(plot_model_comparison(reports), use_container_width=True)
        st.markdown("#### Detailed Metrics Table")
        rows = []
        for r in reports:
            m = r["metrics"]
            rows.append({
                "Model": r["model_name"],
                "ROC-AUC": f"{m['roc_auc']:.4f}",
                "Precision": f"{m['precision']:.4f}",
                "Recall": f"{m['recall']:.4f}",
                "F1": f"{m['f1']:.4f}",
                "Accuracy": f"{m['accuracy']:.4f}",
                f"P@{WATCHLIST_SIZE}": f"{r.get(f'precision_at_{WATCHLIST_SIZE}', 0):.4f}",
                f"R@{WATCHLIST_SIZE}": f"{r.get(f'recall_at_{WATCHLIST_SIZE}', 0):.4f}",
            })
        st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)

    with tab2:
        y_test = st.session_state.y_test
        X_test = st.session_state.X_test
        pipeline = st.session_state.pipeline
        if pipeline and X_test is not None:
            y_proba = pipeline.predict_proba(X_test)[:, 1]
            st.plotly_chart(
                plot_roc_curve(y_test.values, y_proba, "HistGradientBoostingClassifier"),
                use_container_width=True,
            )

    with tab3:
        if pipeline and X_test is not None:
            y_pred = pipeline.predict(X_test)
            st.plotly_chart(
                plot_confusion_matrix(y_test.values, y_pred, "HistGradientBoostingClassifier"),
                use_container_width=True,
            )
        cm = metrics["confusion_matrix"]
        st.markdown(f"TN={cm['tn']} · FP={cm['fp']} · FN={cm['fn']} · TP={cm['tp']}")
        st.caption(
            f"Positive-class prevalence in test set: {metrics['support']['positive']} / "
            f"{metrics['support']['positive'] + metrics['support']['negative']}"
        )


# ══════════════════════════════════════════════════════════════════════════════
# PAGE: Responsible AI
# ══════════════════════════════════════════════════════════════════════════════
elif page == "responsible_ai":
    st.title("⚖️ Responsible AI")

    r = st.session_state.val_report
    er = (st.session_state.eval_reports or [{}])[-1]
    metrics = er.get("metrics", {})

    st.markdown(f"""
### Model Card

| Field | Value |
|-------|-------|
| **Intended use** | Support HR in prioritising retention conversations |
| **Out-of-scope** | Automated hiring, firing, promotion, or disciplinary decisions |
| **Dataset** | IBM HR Analytics (1,470 rows, 35 cols) — synthetic benchmark |
| **Target** | Attrition = Yes (positive class) |
| **Split** | 80/20 stratified, seed 42 |
| **Primary metric** | ROC-AUC + Precision@{WATCHLIST_SIZE} |
| **Best model** | HistGradientBoostingClassifier (class_weight='balanced') |
| **ROC-AUC (test)** | {metrics.get('roc_auc', '—'):.3f} |
| **Precision (test)** | {metrics.get('precision', '—'):.3f} |
| **Recall (test)** | {metrics.get('recall', '—'):.3f} |

---

### ⚠️ Limitations & Caveats

- Outputs are **probabilistic estimates**, not validated resignation predictions.
- The IBM dataset is a **synthetic benchmark** — results may not generalise to real workforces.
- Feature contributions are **correlational signals**, not causes of resignation.
- The tool must not be used for automated hiring, firing, promotion, or discipline.
- **Every action draft requires explicit human review and approval** before any conversation is planned.
- Sensitive attributes (Gender, Age, MaritalStatus) are **not model features**.

---

### Human Oversight

All retention drafts begin as `PENDING_APPROVAL`. HR professionals review and
explicitly **Approve** or **Reject** each draft. No automated employee contact occurs.

---

### Group-Level Checks (Phase 9)

Where group sizes permit, subgroup metrics will be reported here with instability
caveats for small groups. Statistical checks do not prove fairness — they are one
input to ongoing human governance.

---

### Data Use

- No real employee data is committed to this repository.
- CSV exports omit raw feature vectors.
- Employee IDs are SHA-256 masked in public demos and exports.
    """)


# ══════════════════════════════════════════════════════════════════════════════
# PAGE: Early Warning (Stretch)
# ══════════════════════════════════════════════════════════════════════════════
elif page == "early_warning":
    st.title("📡 Early Warning Radar *(Stretch)*")
    st.warning(
        f"⚠️ **{SYNTHETIC_DEMO_LABEL}** — "
        "The IBM HR dataset is a single snapshot. Genuine dated snapshots are required "
        "to validate early-warning performance. All data below is synthetically generated."
    )

    n_emp = st.slider("Demo: Number of synthetic employees", 10, 100, 50)
    n_snap = st.slider("Demo: Number of snapshots", 2, 6, 3)
    threshold = st.slider("Alert threshold (Δp)", 0.05, 0.30, 0.10, 0.01)

    if st.button("🔄 Generate Synthetic Demo"):
        snapshots = generate_synthetic_demo(n_employees=n_emp, n_snapshots=n_snap)

        # Build a quick risk delta table from synthetic scores
        records = []
        for date_str, df_snap in snapshots:
            for _, row in df_snap.iterrows():
                records.append({"EmployeeNumber": row["EmployeeNumber"], "date": date_str, "risk_score": row["risk_score"]})
        combined = pd.DataFrame(records)
        wide = combined.pivot(index="EmployeeNumber", columns="date", values="risk_score")
        wide = wide.sort_index(axis=1)
        dates = wide.columns.tolist()
        for i in range(1, len(dates)):
            wide[f"delta_{dates[i-1]}_{dates[i]}"] = wide[dates[i]] - wide[dates[i-1]]
        risk_deltas = wide.reset_index()

        from talentguard.early_warning import flag_alerts
        alerts = flag_alerts(risk_deltas, threshold=threshold)

        col1, col2 = st.columns(2)
        col1.metric("Total Employees", n_emp)
        col2.metric(f"Alerts (Δp > {threshold:.0%})", len(alerts))

        st.plotly_chart(plot_risk_trends(risk_deltas, top_n=10), use_container_width=True)

        st.markdown(f"### Employees with Δp > {threshold:.0%}")
        if not alerts.empty:
            st.dataframe(alerts, use_container_width=True)
        else:
            st.info("No employees exceeded the alert threshold.")
