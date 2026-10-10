# TalentGuard AI

## Phased Development Documentation, Technical Design, and AI Coding Prompts

**Project:** P1 --- TalentGuard HR Attrition\
**Purpose:** A phase-by-phase implementation blueprint for a 3--4 person
hackathon team. Use each prompt in order with an AI coding assistant,
review the output, run the tests, and only then continue.

## 1. Executive summary

TalentGuard AI estimates employee attrition risk, explains
model-supported signals, and prepares retention actions for human
review. The hackathon brief specifies the IBM HR Analytics Employee
Attrition dataset (1,470 rows, 35 columns), a business scenario of a
12,000-person IT services company with approximately 16% annual
attrition, HR capacity for 50 retention conversations per cycle, a
ranked Top-50 watch list, each employee's top three risk reasons, and
retention recommendations for the Top 10.

**Important:** The IBM dataset is a benchmark sample, not a live
representation of the fictional 12,000-person company. Do not claim that
model outputs are validated predictions for that company without local
data and validation.

### Final features

**Core** 1. Attrition probability prediction. 2. Ranked Top-50 employee
watch list. 3. Top-three local explanation factors per employee. 4.
Personalized, evidence-grounded Top-10 retention recommendations and
conversation guides. 5. Human approval workflow; every draft begins as
`PENDING_APPROVAL`. 6. Streamlit HR dashboard and filters. 7. CSV
exports and model evaluation report. 8. Responsible-AI notes,
group-level checks where appropriate, and audit metadata.

**Differentiators** 9. Retention What-If Simulator: compare baseline and
hypothetical input scenarios. Clearly state that score changes are not
causal effects or guarantees. 10. Early-Warning Radar (stretch): compare
risk estimates across dated snapshots. The supplied data is a single
snapshot; use labelled synthetic data only for a UI demo, or wait for
real longitudinal data.

## 2. Business and ML objectives

-   **Business objective:** help HR prioritize supportive retention
    conversations within a capacity of 50 per cycle.
-   **ML objective:** rank employees by predicted probability of
    `Attrition = Yes` and measure ranking quality.
-   **Operational objective:** turn scores into reviewable actions
    without automatically contacting employees or making employment
    decisions.

The tool is decision support, not a resignation detector, and must not
make automated hiring, firing, promotion, or disciplinary decisions.

## 3. Recommended tech stack

  --------------------------------------------------------------------------------
  Layer                   Technology                       Purpose
  ----------------------- -------------------------------- -----------------------
  Language                Python 3.11+                     Application and ML

  Data                    pandas, NumPy                    Cleaning, validation,
                                                           EDA

  ML                      scikit-learn                     Pipelines, models,
                                                           evaluation

  Baseline                DummyClassifier,                 Baseline comparisons
                          LogisticRegression               

  Candidate model         HistGradientBoostingClassifier   Compare performance
                          or RandomForestClassifier        

  Preprocessing           Pipeline, ColumnTransformer,     Leakage-safe transforms
                          SimpleImputer, OneHotEncoder,    
                          StandardScaler where appropriate 

  Explainability          SHAP if compatible; otherwise a  Local/global
                          tested local explanation         explanations
                          fallback and permutation         
                          importance                       

  UI                      Streamlit                        HR dashboard

  Charts                  Plotly                           Risk and model charts

  Testing                 pytest                           Unit/integration tests

  Experiment tracking     MLflow (optional bonus)          Log runs, parameters,
                                                           metrics

  Export                  CSV/JSON                         Watch list, action
                                                           drafts, audit records

  Deployment              Streamlit Community Cloud        Public demo without
                          (optional)                       private data

  Version control         Git + GitHub                     Team collaboration
  --------------------------------------------------------------------------------

Start with deterministic Python rules for recommendations. An LLM is
optional, not required. Do not add a paid LLM, vector database, or
multi-agent framework until the required pipeline works.

## 4. Architecture

``` text
IBM HR CSV
  -> Data validation and EDA
  -> Leakage-safe preprocessing pipeline
  -> DummyClassifier baseline
  -> Logistic Regression baseline
  -> Candidate tree-based model
  -> Held-out evaluation and capacity metrics
  -> Scoring service
       -> Ranked Top-50
       -> Top-3 local explanations
       -> Top-10 retention drafts
       -> What-If Simulator
       -> (Stretch) risk history across snapshots
  -> Streamlit dashboard + CSV exports
  -> HR approval and audit
```

### Suggested repository structure

``` text
talentguard-ai/
├── app.py
├── requirements.txt
├── README.md
├── .gitignore
├── data/README.md
├── models/                  # generated artifacts; generally gitignored
├── reports/README.md
├── src/talentguard/
│   ├── __init__.py
│   ├── config.py
│   ├── data_validation.py
│   ├── preprocessing.py
│   ├── eda.py
│   ├── train.py
│   ├── evaluate.py
│   ├── predict.py
│   ├── explain.py
│   ├── recommendations.py
│   ├── what_if.py
│   ├── approvals.py
│   ├── exports.py
│   └── early_warning.py
├── tests/
└── notebooks/exploratory_analysis.ipynb
```

## 5. Data handling and hidden traps

Target: `Attrition`, with `Yes → 1` and `No → 0`.

Drop from model features: - `EmployeeNumber` --- identifier. -
`EmployeeCount` --- constant. - `StandardHours` --- constant. - `Over18`
--- constant.

Also exclude the target from `X`. Check schema, duplicates, missing
values, types, category levels, constants, target labels, and class
balance. Fit imputers, encoders, scalers, feature selection, and
resampling only on training folds. Use a scikit-learn
`Pipeline`/`ColumnTransformer`.

The hackathon answer key identifies overtime, job role, lower
income/tenure/age, satisfaction, and travel frequency as patterns to
investigate. Treat these as hypotheses to verify in the data, not
guaranteed findings or causal explanations.

## 6. Algorithms and formulas

### 6.1 Logistic Regression

\[ p(y=1`\mid `{=tex}x)=`\sigma`{=tex}(z)=`\frac{1}{1+e^{-z}}`{=tex} \]
where \[ z=`\beta`{=tex}*0+`\sum`{=tex}*{j=1}\^{p}`\beta`{=tex}\_jx_j \]

A common regularized binary log-loss objective is: \[
J(`\beta`{=tex})=-`\frac{1}{N}`{=tex}`\sum`{=tex}\_{i=1}\^{N}`\left[y_i\log(p_i)+(1-y_i)\log(1-p_i)\right]`{=tex}+`\lambda`{=tex}\|`\beta`{=tex}\|\_2\^2
\]

Use one-hot encoding for nominal categories and scale numeric values
when appropriate. In scikit-learn, smaller `C` means stronger
regularization. Coefficients are not causal effects.

### 6.2 Tree-based candidate

Compare Logistic Regression against `HistGradientBoostingClassifier` or
`RandomForestClassifier` using the same split policy. Tree split quality
can use Gini impurity: \[ Gini(S)=1-`\sum`{=tex}\_{k=1}^{K}p_k^2 \]

Gradient boosting forms an additive model: \[
F_M(x)=F_0(x)+`\sum`{=tex}\_{m=1}\^{M}`\eta `{=tex}h_m(x) \] where (h_m)
is a weak learner and (`\eta`{=tex}) is the learning rate. Select based
on validation results, not complexity.

### 6.3 Class imbalance and baseline

The brief's expected attrition prevalence is approximately 16.1%. An
always-No model can achieve about 84% accuracy while detecting no
positive cases. Therefore accuracy alone is inadequate.

Use `DummyClassifier` as a baseline. Start with Logistic Regression and
optionally `class_weight="balanced"`. Do not use SMOTE before splitting;
if resampling is tested, apply it only inside training folds. The final
test set must remain untouched during model selection.

### 6.4 Metrics

Let TP = true positives, FP = false positives, TN = true negatives, FN =
false negatives.

\[ Precision=`\frac{TP}{TP+FP}`{=tex} \]

\[ Recall=`\frac{TP}{TP+FN}`{=tex} \]

\[
F1=2`\cdot`{=tex}`\frac{Precision\cdot Recall}{Precision+Recall}`{=tex}
\]

\[ Accuracy=`\frac{TP+TN}{TP+TN+FP+FN}`{=tex} \]

ROC-AUC measures ranking across thresholds. Report ROC-AUC, precision,
recall, F1, confusion matrix, and the positive-class prevalence. Treat
accuracy as context, not the primary measure.

Capacity metrics: \[
Precision@50=`\frac{\text{actual positives among top 50}}{50}`{=tex} \]
\[
Recall@50=`\frac{\text{actual positives among top 50}}{\text{all actual positives in the evaluation set}}`{=tex}
\]

If fewer than 50 records exist, divide by actual list size and state it.
Calculate these on held-out or out-of-fold predictions, never on
training predictions.

### 6.5 Split strategy

For the benchmark, use a stratified train/test split such as 80/20 with
a fixed seed. Use training-only cross-validation for tuning. Evaluate
once on the untouched test set. With a small dataset, report split
details and, if possible, cross-validation variability. Never promise a
metric score before running the experiment.

### 6.6 Explainability

Use SHAP if compatible with the model and preprocessing pipeline.
Otherwise use a documented, tested local explanation fallback and
permutation importance for global insights. Display feature, observed
value, direction of contribution, and contribution magnitude on the
correct explanation scale. A top contribution is not proof of causation.

### 6.7 What-If Simulator

For baseline input (x) and hypothetical input (x'): \[
`\Delta `{=tex}p=p(y=1`\mid `{=tex}x')-p(y=1`\mid `{=tex}x) \]

A negative (`\Delta `{=tex}p) means the model gives a lower score to
that hypothetical input. It does not prove that the real intervention
will reduce resignation risk.

Validate allowed ranges and category values; do not change identifiers,
target, or protected/sensitive attributes. Show baseline score, scenario
score, percentage-point delta, changed fields, and a caveat. Avoid
impossible feature combinations.

### 6.8 Early-Warning Radar

For risk scores at two timestamps: \[ `\Delta `{=tex}p_t=p_t-p\_{t-1} \]

Show changes in percentage points and use configurable alert thresholds.
Compare only compatible model versions. Genuine dated snapshots are
needed to validate temporal usefulness; synthetic data must be visibly
labelled as simulated.

## 7. Retention recommendation logic

Start with a transparent, auditable rule table. These are discussion
prompts, not automatic prescriptions.

  -----------------------------------------------------------------------
  Signal supported by observed        Possible HR review prompt
  data/explanation                    
  ----------------------------------- -----------------------------------
  Overtime contributes strongly to    Review workload, staffing,
  risk                                schedules, and work-life balance

  Satisfaction feature contributes to Invite a confidential discussion
  risk                                about workplace support

  Short tenure contributes to risk    Check onboarding, training,
                                      expectations, and manager support

  Career progression signals          Discuss growth interests,
  contribute                          mentorship, and internal
                                      opportunities

  Compensation-related signal         Consider fair, policy-compliant
  contributes                         compensation benchmarking

  Frequent travel contributes         Review travel burden, preferences,
                                      and scheduling flexibility
  -----------------------------------------------------------------------

Only use a recommendation when the feature and explanation support it.
Do not invent personal circumstances, promise compensation, or assert
causality.

### Optional LLM guardrails

If an LLM is added, provide only minimum-necessary, de-identified
evidence. Require structured JSON fields such as `summary`, `evidence`,
`suggested_questions`, `recommended_actions`, `limitations`, and
`status`. Validate output and fall back to rules if invalid. Do not
allow the LLM to change risk scores, approve actions, or contact
employees. Do not send employee data to an external service without
authorization.

## 8. Approval object

``` json
{
  "employee_id": "masked-or-internal-id",
  "risk_score": 0.0,
  "risk_reasons": ["reason_1", "reason_2", "reason_3"],
  "recommended_actions": ["action_1"],
  "conversation_guide": ["question_1", "question_2"],
  "status": "PENDING_APPROVAL",
  "created_at": "ISO-8601 timestamp",
  "reviewed_by": null,
  "reviewed_at": null,
  "review_note": null
}
```

Support explicit transitions `PENDING_APPROVAL → APPROVED` or
`PENDING_APPROVAL → REJECTED`, with reviewer and timestamp. Session
state or local JSON is acceptable for a demo, but is not
production-grade multi-user audit storage. Mask identifiers in public
demos and exports.

## 9. Dashboard pages

1.  Overview: dataset size, observed attrition rate, risk distribution,
    model version and metrics.
2.  Top-50 Watch List: ranking, filters, probability, top-three reasons.
3.  Employee Detail: feature summary, local explanation, limitations.
4.  Retention Planner: Top-10 drafts, conversation guides,
    approval/rejection controls.
5.  What-If Simulator: baseline/scenario comparison and caveat.
6.  Model Evaluation: confusion matrix, precision, recall, F1, ROC-AUC,
    precision@50.
7.  Responsible AI: limitations, data-use notes, group-level checks
    where suitable.
8.  Early Warning (stretch): snapshot trends; synthetic demo data
    clearly labelled.

## 10. Phased development prompts

Run these prompts sequentially. Inspect code, run tests, and commit
working phases before moving on. Tell your coding assistant to modify
only the requested phase and avoid rewriting unrelated modules.

### Phase 0 --- Scaffold

**Prompt** \> Act as a senior Python ML engineer. Scaffold TalentGuard
AI using Python 3.11+, Streamlit, pandas, NumPy, scikit-learn, Plotly,
pytest, and optional SHAP/MLflow. Create the repository structure in
this document, requirements.txt, .gitignore, README, config, package
files, and placeholder modules. Do not implement the whole app. Include
Windows/Linux setup, run, and test commands. Do not commit data, model
binaries, secrets, or real employee records. Report files created and
exact verification commands.

**Done when:** environment installs, `streamlit run app.py` opens a
basic app, and `pytest` runs.

### Phase 1 --- Validation and EDA

**Prompt** \> Implement data loading and validation for the IBM HR
attrition CSV at a configurable path. Validate schema, target labels,
duplicates, missingness, types, category levels, constants, and class
balance. Drop EmployeeNumber, EmployeeCount, StandardHours, and Over18
from model features and exclude Attrition from X. Generate EDA charts
and a concise report on attrition rate and candidate patterns including
overtime, role, income, tenure, satisfaction, and travel. Findings must
be computed from the actual data and must not be described as causal.
Add tests for missing target, invalid labels, constant columns, and
identifier exclusion. Do not train a model yet.

**Done when:** shape and prevalence are accurate, dropped columns are
documented, and validation tests pass.

### Phase 2 --- Pipeline and baseline

**Prompt** \> Implement a leakage-safe scikit-learn Pipeline and
ColumnTransformer. Make a stratified train/test split with a fixed seed.
Fit imputers, encoders, and scaling only on training data. Train
DummyClassifier and LogisticRegression. Start with
class_weight='balanced' where supported; do not use SMOTE. Handle unseen
categories safely. Save the fitted pipeline and metadata (feature
schema, target mapping, seed, timestamp). Add tests proving the target,
identifier, and constants are excluded from model features.

**Done when:** no train/test overlap, test data is never fitted, and
both baselines run.

### Phase 3 --- Model comparison and evaluation

**Prompt** \> Compare LogisticRegression with
HistGradientBoostingClassifier or RandomForestClassifier using
training-only cross-validation and a fixed untouched test set. Report
precision, recall, F1, ROC-AUC, confusion matrix, precision@50 and
recall@50, plus DummyClassifier comparison. Define positive class as
Attrition=Yes. Document split, seed, prevalence, and metric variability.
Do not optimize accuracy alone, leak test data into tuning, or fabricate
scores. Add metric and top-k ranking tests.

**Done when:** the evaluation is reproducible and capacity metrics use
held-out or out-of-fold predictions.

### Phase 4 --- Top-50 and explanations

**Prompt** \> Build a scoring service returning Attrition=Yes
probabilities and a descending ranked list of at most 50 eligible
records. Add top-three local explanation factors using SHAP if
compatible; otherwise implement and document a tested fallback. Each
reason must identify feature, observed value, contribution direction,
and magnitude where supported. Keep IDs out of model features; add
stable tie-breaking and tests for ranking, list capacity, invalid
inputs, and explanation-to-record mapping. Never describe contributions
as proven causes.

**Done when:** ranking is correct, scores are in \[0,1\], and
explanations match each employee.

### Phase 5 --- Retention agent drafts

**Prompt** \> Implement an auditable rule-based recommendation engine
for the Top 10. Use only actual feature values and valid local
explanation evidence to select respectful HR discussion prompts and
actions. Include evidence, suggested questions, limitations, and status
PENDING_APPROVAL. Do not invent personal circumstances, promise pay
changes, or claim causality. If an optional LLM adapter is included,
keep it disabled by default, require validated JSON,
minimize/de-identify input, and fall back to rules on failure. Add tests
for missing/unsupported evidence and status initialization.

**Done when:** Top-10 drafts are evidence-grounded and all begin pending
approval.

### Phase 6 --- Approval workflow

**Prompt** \> Add explicit approve/reject controls, review notes,
reviewer identifier, timestamp, and audit records. Enforce allowed
transitions from PENDING_APPROVAL to APPROVED or REJECTED. For the demo
use local JSON or session state with a clear limitation note; do not
claim production-grade multi-user security. Mask identifiers and add
tests for valid/invalid transitions and audit metadata. Do not send
emails or update real employee records.

**Done when:** no draft can be approved or rejected silently and the
review metadata is retained.

### Phase 7 --- What-If Simulator

**Prompt** \> Build a Retention What-If Simulator using the same fitted
pipeline as the main scorer. Let the user select an employee and change
only approved, valid input features with realistic ranges. Show baseline
score, scenario score, percentage-point delta, changed fields, and a
prominent statement that this is a hypothetical model scenario, not a
causal estimate or guarantee. Reject impossible values and changes to
IDs, target, or protected/sensitive attributes. Do not mutate the
original record. Add validation and delta-calculation tests.

**Done when:** baseline/scenario calculations are consistent and the
original record remains unchanged.

### Phase 8 --- Streamlit UI and exports

**Prompt** \> Integrate Overview, Top-50 Watch List, Employee Detail,
Top-10 Retention Planner, What-If Simulator, Model Evaluation, and
Responsible AI pages. Add relevant filters, clear error/loading states,
Plotly charts, CSV downloads for the watch list and action drafts, and
model limitation notices. Omit unnecessary personal data from exports.
Keep ML logic in src/talentguard, not all inside app.py. Add integration
tests for the main user flow. The app must remain usable if optional
SHAP/MLflow is unavailable.

**Done when:** the end-to-end demo works and CSV exports have expected
fields.

### Phase 9 --- Responsible AI and robustness

**Prompt** \> Add a model card and responsible-use page documenting
intended use, prohibited use, data limitations, split method, actual
metrics, and human oversight. Where group sizes permit, report subgroup
sample sizes and metrics such as flag rate, precision, recall, and
false-positive/negative rates, with instability caveats for small
groups. Document sensitive-feature decisions; do not assume a few checks
prove fairness. Add schema, missingness, unseen-category, and
model-version checks. Do not automate hiring, firing, promotion, or
discipline.

**Done when:** limitations are visible and group metrics are responsibly
qualified.

### Phase 10 --- Early-Warning Radar (stretch)

**Prompt** \> Design an optional dated-snapshot input format and compute
risk over time using a fixed documented model version. Show
percentage-point change, trend charts, configurable thresholds, and
alerts. Validate timestamps and warn when model versions differ. The
provided IBM dataset is a single snapshot: if no genuine history exists,
create a visibly labelled synthetic demo only and never claim it
validates early-warning performance. Add tests for duplicate/missing
timestamps, ordering, model version changes, and thresholds.

**Done when:** synthetic data is unmistakably labelled and the core app
works without this module.

### Phase 11 --- MLflow, deployment, and pitch

**Prompt** \> Add optional MLflow tracking for model, parameters,
validation/test metrics, and artifact references. Complete reproducible
README instructions, dependency versions, and data acquisition guidance.
Prepare optional Streamlit Community Cloud deployment without committing
private data or secrets. Create a smoke-test checklist and three pitch
slides: problem/business value, architecture/model/evaluation, and live
Top-50-to-action demo. Populate all metrics from actual experiment
outputs; never fabricate results.

**Done when:** another teammate can reproduce the app and reported
metrics match saved outputs.

## 11. End-to-end acceptance checklist

-   [ ] Data validation and EDA are reproducible.
-   [ ] ID and constant columns are excluded.
-   [ ] Split occurs before fitting transforms.
-   [ ] Dummy and logistic baselines are evaluated.
-   [ ] A stronger candidate is fairly compared.
-   [ ] ROC-AUC, precision, recall, F1, precision@50 and recall@50 are
    reported.
-   [ ] Top-50 ranking and capacity are correct.
-   [ ] Each listed employee has up to three valid explanations.
-   [ ] Top-10 recommendations are evidence-grounded.
-   [ ] Drafts start at `PENDING_APPROVAL`.
-   [ ] What-If scenarios are validated and labelled hypothetical.
-   [ ] Dashboard and CSV exports work.
-   [ ] Responsible-AI limitations and model card are included.
-   [ ] Early-warning synthetic data is labelled.
-   [ ] README, tests, requirements, and pitch are complete.
-   [ ] No fabricated metrics, secrets, or private employee data are
    committed.

## 12. Four-hour build plan

  -----------------------------------------------------------------------
  Time                                Work
  ----------------------------------- -----------------------------------
  0:00--0:20                          Setup, load data, assign roles

  0:20--1:10                          Validation, EDA, identify leakage
                                      and constants

  1:10--2:20                          Baselines, candidate model,
                                      evaluation, Top-50

  2:20--3:10                          Explanations, Top-10 rule
                                      recommendations, basic dashboard

  3:10--3:40                          What-If Simulator if core flow
                                      works; otherwise tests and exports

  3:40--4:00                          Rehearse demo and pitch;
                                      early-warning only if everything
                                      else works
  -----------------------------------------------------------------------

For a four-hour event, complete a small but tested Phases 0--5 first,
then approval workflow and a minimal What-If Simulator. Treat
Early-Warning Radar as stretch.

## 13. Team roles

-   **Member 1:** data validation, EDA, dataset documentation.
-   **Member 2:** ML pipeline, model comparison, metrics.
-   **Member 3:** explanations, recommendation rules, approval object.
-   **Member 4:** Streamlit integration, exports, demo, slides.

For three members, combine UI/pitch with integration and combine
explanation logic with recommendations.

## 14. Final design principle

Do not build a generic chatbot and call it an agent. The value is the
complete workflow:

**reliable ranking → faithful explanation → grounded recommendation →
explicit HR approval → measurable evaluation.**

A small, reproducible system that produces a trustworthy Top-50 list and
reviewable Top-10 actions is stronger than a large system with
unvalidated features.
