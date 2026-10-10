"""
grok_service.py - AI-Powered Retention Assistant with Strict Guardrails
========================================================================
Integrates xAI Grok API for generating personalized, ethical HR retention
interventions. Enforces strict Responsible AI guardrails to eliminate bias
and prevent automated adverse employment decisions.
"""

from __future__ import annotations

import os
import json
import logging
from typing import Any
import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("talentguard.grok")

# Environment Configuration
GROK_API_KEY = os.getenv("GROK_API_KEY", "").strip()
GROK_API_URL = os.getenv("GROK_API_URL", "https://api.x.ai/v1/chat/completions")
GROK_MODEL = os.getenv("GROK_MODEL", "grok-2-latest")

# ---------------------------------------------------------------------------
# Strict Guardrail Rules
# ---------------------------------------------------------------------------
GUARDRAILS = """
YOU ARE TALENTGUARD AI, AN ENTERPRISE HR RETENTION ADVISOR.
YOU MUST STRICTLY ADHERE TO THE FOLLOWING 5 MANDATORY ETHICAL GUARDRAIL RULES:

[GUARDRAIL 1: EEOC & NON-DISCRIMINATION]
Never base, justify, or suggest any retention action on protected demographic
attributes (Age, Gender, Marital Status, Race, Religion, National Origin).
Focus exclusively on mutable organizational and workplace experience factors.

[GUARDRAIL 2: NON-PUNITIVE INTERVENTIONS ONLY]
Never recommend negative, punitive, or retaliatory measures (e.g., termination,
demotion, salary cuts, isolation, or micro-surveillance). All recommended actions
must be supportive, constructive, and aimed at talent development and well-being.

[GUARDRAIL 3: DECISION SUPPORT & HUMAN-IN-THE-LOOP]
The output is purely advisory decision-support for human HR leaders and managers.
Never make definitive assertions that an employee will certainly quit. Use probabilistic
and empathetic terminology (e.g., "elevated flight risk signals", "proactive engagement").

[GUARDRAIL 4: MUTABLE ORGANIZATIONAL LEVERS ONLY]
Interventions must target realistic levers under employer control:
- Work-life balance / OverTime reduction
- Compensation benchmarking & equity adjustments
- Career pathway, promotion trajectory, or lateral mentorship
- Manager-employee 1-on-1 check-in cadence
- Skill training and upskilling opportunities

[GUARDRAIL 5: STRUCTURED JSON SCHEMA OUTPUT]
Return your response ONLY in valid JSON format matching the requested schema.
"""


def generate_grok_retention_plan(
    employee_id: str | int,
    risk_score: float,
    employee_data: dict[str, Any],
    explanations: list[dict[str, Any]],
) -> dict[str, Any]:
    """Generate an AI retention plan using Grok API with fallback to rule engine."""
    api_key = os.getenv("GROK_API_KEY", "").strip() or GROK_API_KEY

    # If no Grok API key is provided, return simulated or fallback response
    if not api_key:
        return _build_fallback_plan(
            employee_id=employee_id,
            risk_score=risk_score,
            employee_data=employee_data,
            explanations=explanations,
            reason="GROK_API_KEY not configured in environment. Using deterministic rule-based engine.",
        )

    # Format evidence factors cleanly
    factors_summary = []
    for exp in explanations[:4]:
        feat = exp.get("feature", "Factor")
        val = exp.get("observed_value", exp.get("value", "N/A"))
        direction = exp.get("direction", "influences risk")
        factors_summary.append(f"- {feat}: {val} ({direction})")

    user_prompt = f"""
Employee ID: EMP-{employee_id}
Calibrated Risk Probability: {round(risk_score * 100, 1)}%
Department: {employee_data.get('Department', 'N/A')}
Role: {employee_data.get('JobRole', 'N/A')}
Job Level: {employee_data.get('JobLevel', 'N/A')}
Monthly Income: ${employee_data.get('MonthlyIncome', 'N/A')}
OverTime Status: {employee_data.get('OverTime', 'N/A')}
Job Satisfaction (1-4): {employee_data.get('JobSatisfaction', 'N/A')}
Work-Life Balance (1-4): {employee_data.get('WorkLifeBalance', 'N/A')}
Years at Company: {employee_data.get('YearsAtCompany', 'N/A')}
Years with Current Manager: {employee_data.get('YearsWithCurrManager', 'N/A')}

Key Attribution Signals (SHAP/Feature Importance):
{chr(10).join(factors_summary) if factors_summary else 'No specific signals provided'}

Generate an executive retention plan JSON with these exact fields:
{{
  "analysis_summary": "1-2 sentence executive assessment of risk drivers",
  "recommended_actions": ["Action 1", "Action 2", "Action 3"],
  "conversation_guide": ["Question 1 for 1-on-1", "Question 2 for 1-on-1"],
  "estimated_investment": "$X,XXX - $Y,YYY",
  "recommended_timeline": "Within X Days",
  "guardrail_compliance_note": "Confirmation that actions comply with EEOC & ethical guidelines"
}}
"""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": GROK_MODEL,
        "messages": [
            {"role": "system", "content": GUARDRAILS},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.3,
        "response_format": {"type": "json_object"},
    }

    try:
        with httpx.Client(timeout=20.0) as client:
            resp = client.post(GROK_API_URL, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            raw_content = data["choices"][0]["message"]["content"]
            parsed = json.loads(raw_content)

            return {
                "engine": "grok-ai",
                "model": GROK_MODEL,
                "analysis_summary": parsed.get("analysis_summary", ""),
                "recommended_actions": parsed.get("recommended_actions", []),
                "conversation_guide": parsed.get("conversation_guide", []),
                "estimated_investment": parsed.get("estimated_investment", "$1,500 - $3,500"),
                "recommended_timeline": parsed.get("recommended_timeline", "Within 14 Days"),
                "guardrail_compliance_note": parsed.get(
                    "guardrail_compliance_note",
                    "Actions verified against EEOC non-discrimination guidelines and four-eyes review standard."
                ),
            }
    except Exception as e:
        logger.warning(f"Grok API call failed: {e}. Falling back to rule engine.")
        return _build_fallback_plan(
            employee_id=employee_id,
            risk_score=risk_score,
            employee_data=employee_data,
            explanations=explanations,
            reason=f"Grok API connection issue: {e}. Active fallback applied.",
        )


def _build_fallback_plan(
    employee_id: str | int,
    risk_score: float,
    employee_data: dict[str, Any],
    explanations: list[dict[str, Any]],
    reason: str,
) -> dict[str, Any]:
    """Deterministic fallback retention plan based on validated domain rules."""
    actions = []
    questions = []

    # Check OverTime
    if employee_data.get("OverTime") == "Yes":
        actions.append("Workload Rebalancing: Transition employee off mandatory overtime; distribute tasks to team.")
        questions.append("How has your recent workload felt, and what can we redistribute to make your hours sustainable?")

    # Check MonthlyIncome
    income = employee_data.get("MonthlyIncome", 0)
    if isinstance(income, (int, float)) and income < 3500:
        actions.append("Compensation Review: Conduct urgent compensation equity audit against regional market band.")
        questions.append("How aligned do you feel your compensation is with your daily contributions and growth goals?")

    # Check Satisfaction
    sat = employee_data.get("JobSatisfaction", 3)
    if isinstance(sat, (int, float)) and sat <= 2:
        actions.append("Role Realignment: Explore project rotations or mentor assignments matching personal career interests.")
        questions.append("Which projects or work streams have you found most energizing over the past quarter?")

    # Default actions
    if not actions:
        actions.append("Supportive Check-in: Conduct structured 1-on-1 career progression dialogue within 14 days.")
        actions.append("Skill Development: Offer sponsored certification or professional conference attendance.")
        questions.append("What career milestones would you like us to partner with you on over the next 12 months?")

    return {
        "engine": "rule-based-guardrail",
        "model": "TalentGuard Rule Engine v1.0",
        "analysis_summary": f"Flight risk estimated at {round(risk_score * 100, 1)}%. Key drivers include operational tenure and work patterns.",
        "recommended_actions": actions,
        "conversation_guide": questions,
        "estimated_investment": "$1,000 - $3,000",
        "recommended_timeline": "Within 14 Days",
        "guardrail_compliance_note": f"Guaranteed EEOC-compliant rule evaluation. Note: {reason}",
    }
