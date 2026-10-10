"""
eda.py – Phase 1
==================
Generates EDA charts (Plotly) and a concise text report.
All findings are computed from actual data — nothing is hard-coded.
Findings are described as patterns/associations, NOT causal claims.
"""

from __future__ import annotations

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

from .config import TARGET_COL

# Candidate risk-pattern features to investigate (per hackathon brief)
CANDIDATE_FEATURES = [
    "OverTime",
    "JobRole",
    "MonthlyIncome",
    "TotalWorkingYears",
    "YearsAtCompany",
    "JobSatisfaction",
    "EnvironmentSatisfaction",
    "WorkLifeBalance",
    "BusinessTravel",
    "Age",
    "JobLevel",
    "MaritalStatus",
    "Department",
]

_PALETTE = px.colors.qualitative.Vivid
_ATTRITION_COLORS = {"Yes": "#ef4444", "No": "#6366f1"}


# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------

def generate_eda_report(df: pd.DataFrame) -> dict:
    """Return a dict with attrition rate, candidate risk patterns, and
    summary statistics computed from *df*.

    NOTE: All associations are correlational – not causal explanations.
    """
    total = len(df)
    # Support both encoded (0/1) and raw (Yes/No) target
    if df[TARGET_COL].dtype == object:
        pos_mask = df[TARGET_COL] == "Yes"
    else:
        pos_mask = df[TARGET_COL] == 1

    attrition_count = int(pos_mask.sum())
    attrition_rate = round(attrition_count / total, 4) if total else 0.0

    report = {
        "total_rows": total,
        "attrition_count": attrition_count,
        "retention_count": total - attrition_count,
        "attrition_rate": attrition_rate,
        "feature_patterns": {},
        "numeric_summary": df.select_dtypes(include="number").describe().to_dict(),
    }

    # Compute attrition rate per candidate feature level
    for feat in CANDIDATE_FEATURES:
        if feat not in df.columns:
            continue
        try:
            group = df.groupby(feat)[TARGET_COL].mean().round(4)
            report["feature_patterns"][feat] = group.to_dict()
        except Exception:
            pass

    return report


# ---------------------------------------------------------------------------
# Charts
# ---------------------------------------------------------------------------

def plot_attrition_rate(df: pd.DataFrame) -> go.Figure:
    """Plotly donut chart showing overall attrition rate."""
    if df[TARGET_COL].dtype == object:
        counts = df[TARGET_COL].value_counts()
        labels = counts.index.tolist()
        values = counts.values.tolist()
    else:
        counts = df[TARGET_COL].value_counts().rename({1: "Yes", 0: "No"})
        labels = counts.index.tolist()
        values = counts.values.tolist()

    colors = [_ATTRITION_COLORS.get(l, "#888") for l in labels]
    fig = go.Figure(go.Pie(
        labels=labels,
        values=values,
        hole=0.55,
        marker_colors=colors,
        textinfo="label+percent",
        hovertemplate="%{label}: %{value} employees<extra></extra>",
    ))
    fig.update_layout(
        title="Overall Attrition Distribution",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font_color="#e0e0ff",
        legend=dict(font=dict(color="#e0e0ff")),
        margin=dict(t=50, b=20, l=20, r=20),
    )
    return fig


def plot_attrition_by_feature(df: pd.DataFrame, feature: str) -> go.Figure:
    """Bar chart: attrition rate broken down by *feature* level."""
    if feature not in df.columns:
        raise ValueError(f"Feature '{feature}' not in DataFrame.")

    if df[TARGET_COL].dtype == object:
        target_binary = (df[TARGET_COL] == "Yes").astype(int)
    else:
        target_binary = df[TARGET_COL]

    temp = df.copy()
    temp["_attrition_int"] = target_binary

    group = (
        temp.groupby(feature)["_attrition_int"]
        .agg(["mean", "count"])
        .reset_index()
        .rename(columns={"mean": "attrition_rate", "count": "employee_count"})
        .sort_values("attrition_rate", ascending=False)
    )
    group["attrition_pct"] = (group["attrition_rate"] * 100).round(1)

    fig = px.bar(
        group,
        x=feature,
        y="attrition_pct",
        color="attrition_pct",
        color_continuous_scale="RdBu_r",
        text="attrition_pct",
        custom_data=["employee_count"],
        title=f"Attrition Rate by {feature}",
        labels={"attrition_pct": "Attrition Rate (%)", feature: feature},
    )
    fig.update_traces(
        texttemplate="%{text}%",
        textposition="outside",
        hovertemplate=(
            f"<b>{feature}</b>: %{{x}}<br>"
            "Attrition Rate: %{y:.1f}%<br>"
            "Employees: %{customdata[0]}<extra></extra>"
        ),
    )
    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font_color="#e0e0ff",
        coloraxis_showscale=False,
        margin=dict(t=55, b=30, l=40, r=20),
        xaxis=dict(tickangle=-30, gridcolor="rgba(255,255,255,0.05)"),
        yaxis=dict(gridcolor="rgba(255,255,255,0.08)"),
    )
    return fig


def plot_correlation_heatmap(df: pd.DataFrame) -> go.Figure:
    """Plotly heatmap of numeric feature correlations."""
    numeric_df = df.select_dtypes(include="number").copy()
    # Drop near-zero-variance columns
    numeric_df = numeric_df.loc[:, numeric_df.std() > 0]

    corr = numeric_df.corr().round(2)

    fig = go.Figure(go.Heatmap(
        z=corr.values,
        x=corr.columns.tolist(),
        y=corr.index.tolist(),
        colorscale="RdBu",
        zmid=0,
        text=corr.values.round(2),
        texttemplate="%{text}",
        textfont={"size": 8},
        hovertemplate="x: %{x}<br>y: %{y}<br>r: %{z:.2f}<extra></extra>",
        colorbar=dict(title="r", tickfont=dict(color="#e0e0ff")),
    ))
    fig.update_layout(
        title="Numeric Feature Correlation Matrix",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font_color="#e0e0ff",
        height=600,
        margin=dict(t=55, b=80, l=100, r=20),
        xaxis=dict(tickangle=-45, tickfont=dict(size=9)),
        yaxis=dict(tickfont=dict(size=9)),
    )
    return fig


def plot_income_distribution(df: pd.DataFrame) -> go.Figure:
    """Box plot: MonthlyIncome distribution by Attrition status."""
    if "MonthlyIncome" not in df.columns:
        raise ValueError("MonthlyIncome column not in DataFrame.")

    if df[TARGET_COL].dtype == object:
        label_col = TARGET_COL
        df_plot = df.copy()
    else:
        df_plot = df.copy()
        df_plot["AttritionLabel"] = df_plot[TARGET_COL].map({1: "Yes", 0: "No"})
        label_col = "AttritionLabel"

    fig = px.box(
        df_plot,
        x=label_col,
        y="MonthlyIncome",
        color=label_col,
        color_discrete_map=_ATTRITION_COLORS,
        notched=True,
        title="Monthly Income Distribution by Attrition",
        labels={label_col: "Attrition", "MonthlyIncome": "Monthly Income ($)"},
    )
    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font_color="#e0e0ff",
        showlegend=False,
        margin=dict(t=55, b=30, l=60, r=20),
        yaxis=dict(gridcolor="rgba(255,255,255,0.08)"),
    )
    return fig


def plot_age_distribution(df: pd.DataFrame) -> go.Figure:
    """Histogram: Age distribution split by Attrition."""
    if df[TARGET_COL].dtype == object:
        label_col = TARGET_COL
        df_plot = df.copy()
    else:
        df_plot = df.copy()
        df_plot["AttritionLabel"] = df_plot[TARGET_COL].map({1: "Yes", 0: "No"})
        label_col = "AttritionLabel"

    fig = px.histogram(
        df_plot,
        x="Age",
        color=label_col,
        color_discrete_map=_ATTRITION_COLORS,
        barmode="overlay",
        opacity=0.75,
        nbins=20,
        title="Age Distribution by Attrition",
        labels={label_col: "Attrition", "Age": "Age (years)"},
    )
    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font_color="#e0e0ff",
        margin=dict(t=55, b=30, l=50, r=20),
        xaxis=dict(gridcolor="rgba(255,255,255,0.05)"),
        yaxis=dict(gridcolor="rgba(255,255,255,0.08)", title="Count"),
    )
    return fig


def plot_overtime_attrition(df: pd.DataFrame) -> go.Figure:
    """Grouped bar: OverTime vs Attrition counts."""
    return plot_attrition_by_feature(df, "OverTime")


def plot_tenure_vs_attrition(df: pd.DataFrame) -> go.Figure:
    """Scatter: YearsAtCompany vs attrition probability (mean per year)."""
    if df[TARGET_COL].dtype == object:
        target_int = (df[TARGET_COL] == "Yes").astype(int)
    else:
        target_int = df[TARGET_COL]

    temp = df.copy()
    temp["_att"] = target_int
    group = temp.groupby("YearsAtCompany")["_att"].mean().reset_index()
    group.columns = ["YearsAtCompany", "AttritionRate"]
    group["AttritionRate"] = (group["AttritionRate"] * 100).round(1)

    fig = px.scatter(
        group,
        x="YearsAtCompany",
        y="AttritionRate",
        size="AttritionRate",
        trendline="lowess",
        title="Attrition Rate by Tenure (Years at Company)",
        labels={"YearsAtCompany": "Years at Company", "AttritionRate": "Attrition Rate (%)"},
        color_discrete_sequence=["#6366f1"],
    )
    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font_color="#e0e0ff",
        margin=dict(t=55, b=30, l=55, r=20),
        xaxis=dict(gridcolor="rgba(255,255,255,0.05)"),
        yaxis=dict(gridcolor="rgba(255,255,255,0.08)"),
    )
    return fig
