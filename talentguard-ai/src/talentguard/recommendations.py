"""
recommendations.py – Phase 5
==============================
Auditable rule-based retention recommendation engine for the Top 10.

Rules map explanation signals to respectful HR discussion prompts.
Only actual feature values and valid explanation evidence are used.
Never invents personal circumstances, promises pay changes, or asserts causality.
"""

from __future__ import annotations

from datetime import datetime, timezone

import pandas as pd

from .config import (
    EXPLANATION_TOP_K,
    RETENTION_TOP_N,
    STATUS_PENDING,
)

# ---------------------------------------------------------------------------
# Rule table  (signal → HR discussion prompt)
# Matched against explanation factors: feature + direction.
# ---------------------------------------------------------------------------
RETENTION_RULES: list[dict] = [
    {
        "signal_feature": "OverTime",
        "direction": "increases_risk",
        "recommended_action": "Review workload, staffing, schedules, and work-life balance options.",
        "suggested_question": "How are you finding your current workload and work-life balance?",
        "category": "workload",
    },
    {
        "signal_feature": "JobSatisfaction",
        "direction": "increases_risk",
        "recommended_action": "Invite a confidential discussion about workplace support and satisfaction.",
        "suggested_question": "Is there anything we can do to improve your experience at work?",
        "category": "satisfaction",
    },
    {
        "signal_feature": "EnvironmentSatisfaction",
        "direction": "increases_risk",
        "recommended_action": "Invite feedback on the work environment and team dynamics.",
        "suggested_question": "Is there anything about the work environment we could improve?",
        "category": "satisfaction",
    },
    {
        "signal_feature": "WorkLifeBalance",
        "direction": "increases_risk",
        "recommended_action": "Explore flexible working arrangements or schedule adjustments.",
        "suggested_question": "What changes would help you better balance work and personal commitments?",
        "category": "workload",
    },
    {
        "signal_feature": "RelationshipSatisfaction",
        "direction": "increases_risk",
        "recommended_action": "Offer a safe space to discuss team relationships and dynamics.",
        "suggested_question": "How would you describe your working relationships with your team and manager?",
        "category": "satisfaction",
    },
    {
        "signal_feature": "YearsAtCompany",
        "direction": "increases_risk",
        "recommended_action": "Check onboarding quality, training opportunities, expectations, and manager support.",
        "suggested_question": "How supported have you felt during your time here so far?",
        "category": "tenure",
    },
    {
        "signal_feature": "JobLevel",
        "direction": "increases_risk",
        "recommended_action": "Discuss growth interests, mentorship options, and internal mobility opportunities.",
        "suggested_question": "What career development opportunities would be most meaningful to you?",
        "category": "career",
    },
    {
        "signal_feature": "JobInvolvement",
        "direction": "increases_risk",
        "recommended_action": "Discuss role enrichment, ownership opportunities, and meaningful project assignment.",
        "suggested_question": "Do you feel engaged and involved in your current projects?",
        "category": "career",
    },
    {
        "signal_feature": "MonthlyIncome",
        "direction": "increases_risk",
        "recommended_action": "Consider fair, policy-compliant compensation benchmarking.",
        "suggested_question": "Are you satisfied with your current compensation and benefits?",
        "category": "compensation",
    },
    {
        "signal_feature": "PercentSalaryHike",
        "direction": "increases_risk",
        "recommended_action": "Review salary progression history for policy-compliant benchmarking.",
        "suggested_question": "Do you feel your salary progression has kept pace with your contributions?",
        "category": "compensation",
    },
    {
        "signal_feature": "BusinessTravel",
        "direction": "increases_risk",
        "recommended_action": "Review travel burden, preferences, and scheduling flexibility.",
        "suggested_question": "How are you finding the current travel requirements of your role?",
        "category": "workload",
    },
    {
        "signal_feature": "DistanceFromHome",
        "direction": "increases_risk",
        "recommended_action": "Explore remote/hybrid work options or flexible hours to ease commute burden.",
        "suggested_question": "How is the commute working for you? Would flexible arrangements help?",
        "category": "workload",
    },
    {
        "signal_feature": "TrainingTimesLastYear",
        "direction": "increases_risk",
        "recommended_action": "Ensure access to relevant training, certification, and development programmes.",
        "suggested_question": "Do you feel you have enough opportunities to develop your skills?",
        "category": "career",
    },
    {
        "signal_feature": "StockOptionLevel",
        "direction": "increases_risk",
        "recommended_action": "Review equity and long-term incentive eligibility per policy.",
        "suggested_question": "Are you aware of the long-term incentive options available to you?",
        "category": "compensation",
    },
    {
        "signal_feature": "NumCompaniesWorked",
        "direction": "increases_risk",
        "recommended_action": "Discuss career aspirations and what would make this role a long-term fit.",
        "suggested_question": "What would make this role and company the right long-term place for you?",
        "category": "career",
    },
]


# ---------------------------------------------------------------------------
# Rule matching
# ---------------------------------------------------------------------------

def _match_rules(explanations: list[dict]) -> list[dict]:
    """Return matching rule entries for the given explanation factors."""
    # Build lookup: feature -> explanation (skip error dicts)
    matched = []
    seen_features = set()

    for exp in explanations:
        if "feature" not in exp:
            continue  # skip error / malformed explanation entries
        feat = exp["feature"]
        direction = exp.get("direction", "increases_risk")
        if feat in seen_features:
            continue
        for rule in RETENTION_RULES:
            if (
                rule["signal_feature"] == feat
                and rule["direction"] == direction
            ):
                matched.append({**rule, "magnitude": exp.get("magnitude", 0.0)})
                seen_features.add(feat)
                break

    return matched


# ---------------------------------------------------------------------------
# Draft generator
# ---------------------------------------------------------------------------

def generate_retention_draft(
    employee_id: str | int,
    risk_score: float,
    explanations: list[dict],
    employee_row: pd.Series | None = None,
) -> dict:
    """Generate a PENDING_APPROVAL retention draft for one employee.

    Only evidence-grounded actions are included.
    """
    matched_rules = _match_rules(explanations)

    risk_reasons = [
        f"{e['feature']}={e.get('observed_value', '')} ({str(e.get('direction', '')).replace('_', ' ')})"
        for e in explanations[:EXPLANATION_TOP_K]
        if isinstance(e, dict) and "feature" in e
    ]

    recommended_actions = [r["recommended_action"] for r in matched_rules]
    conversation_guide = [r["suggested_question"] for r in matched_rules]

    # Fallback if no rules matched
    if not recommended_actions:
        recommended_actions = [
            "Schedule a supportive one-to-one conversation to understand the employee's needs."
        ]
        conversation_guide = [
            "Is there anything we can do to better support you in your role?"
        ]

    return {
        "employee_id": str(employee_id),
        "risk_score": round(float(risk_score), 4),
        "risk_reasons": risk_reasons,
        "evidence": [
            {
                "feature": e["feature"],
                "observed_value": e["observed_value"],
                "direction": e["direction"],
                "magnitude": e.get("magnitude", 0.0),
            }
            for e in explanations
        ],
        "recommended_actions": recommended_actions,
        "conversation_guide": conversation_guide,
        "limitations": (
            "This draft is generated from model signals, not confirmed causes. "
            "HR professionals must review and adapt before any conversation. "
            "Do not contact employees automatically."
        ),
        "status": STATUS_PENDING,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "reviewed_by": None,
        "reviewed_at": None,
        "review_note": None,
    }


def generate_top10_drafts(
    watchlist: pd.DataFrame,
    explanations: dict,
    original_df: pd.DataFrame,
) -> list[dict]:
    """Generate drafts for the Top-10 employees in watchlist."""
    top10 = watchlist.head(RETENTION_TOP_N)
    drafts = []

    for _, row in top10.iterrows():
        emp_id = int(row["EmployeeNumber"]) if "EmployeeNumber" in row else row.name
        risk_score = float(row["attrition_probability"])
        exps = explanations.get(emp_id, [])

        # Fallback if explanations missing
        if not exps:
            exps = []

        draft = generate_retention_draft(
            employee_id=emp_id,
            risk_score=risk_score,
            explanations=exps,
            employee_row=row,
        )
        drafts.append(draft)

    return drafts
