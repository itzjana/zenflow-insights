"""
evaluate.py – Phase 3
=======================
Model evaluation: standard metrics + capacity metrics (Precision@K, Recall@K).
Always computed on held-out / out-of-fold predictions. Never on training data.
"""

from __future__ import annotations

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from sklearn.metrics import (
    ConfusionMatrixDisplay,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
    roc_curve,
)

from .config import WATCHLIST_SIZE


# ---------------------------------------------------------------------------
# Core metrics
# ---------------------------------------------------------------------------

def evaluate_model(
    y_true: pd.Series | np.ndarray,
    y_pred: np.ndarray,
    y_proba: np.ndarray,
) -> dict:
    """Return precision, recall, F1, accuracy, ROC-AUC, confusion matrix.

    Positive class = 1 (Attrition=Yes).
    Must be called with held-out predictions only.
    """
    y_true = np.asarray(y_true)
    cm = confusion_matrix(y_true, y_pred)
    tn, fp, fn, tp = cm.ravel()

    return {
        "roc_auc": float(roc_auc_score(y_true, y_proba)),
        "precision": float(precision_score(y_true, y_pred, zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, zero_division=0)),
        "f1": float(f1_score(y_true, y_pred, zero_division=0)),
        "accuracy": float((tp + tn) / len(y_true)),
        "confusion_matrix": {"tn": int(tn), "fp": int(fp), "fn": int(fn), "tp": int(tp)},
        "support": {"positive": int(y_true.sum()), "negative": int((1 - y_true).sum())},
    }


def precision_at_k(
    y_true: pd.Series | np.ndarray,
    y_proba: np.ndarray,
    k: int = WATCHLIST_SIZE,
) -> float:
    """Fraction of actual positives among the top-k ranked rows."""
    y_true = np.asarray(y_true)
    actual_k = min(k, len(y_true))
    top_idx = np.argsort(y_proba)[::-1][:actual_k]
    return float(y_true[top_idx].sum() / actual_k)


def recall_at_k(
    y_true: pd.Series | np.ndarray,
    y_proba: np.ndarray,
    k: int = WATCHLIST_SIZE,
) -> float:
    """Fraction of all actual positives captured in top-k."""
    y_true = np.asarray(y_true)
    actual_k = min(k, len(y_true))
    total_positives = y_true.sum()
    if total_positives == 0:
        return 0.0
    top_idx = np.argsort(y_proba)[::-1][:actual_k]
    return float(y_true[top_idx].sum() / total_positives)


# ---------------------------------------------------------------------------
# Report compiler
# ---------------------------------------------------------------------------

def generate_evaluation_report(
    model_name: str,
    y_true: np.ndarray,
    y_pred: np.ndarray,
    y_proba: np.ndarray,
    k: int = WATCHLIST_SIZE,
    prevalence: float | None = None,
    split_info: dict | None = None,
    cv_results: dict | None = None,
) -> dict:
    """Compile a complete evaluation report dict."""
    metrics = evaluate_model(y_true, y_pred, y_proba)
    p_at_k = precision_at_k(y_true, y_proba, k)
    r_at_k = recall_at_k(y_true, y_proba, k)

    return {
        "model_name": model_name,
        "metrics": metrics,
        f"precision_at_{k}": round(p_at_k, 4),
        f"recall_at_{k}": round(r_at_k, 4),
        "k": k,
        "prevalence": prevalence,
        "split_info": split_info or {},
        "cv_results": cv_results or {},
        "note": (
            "Metrics computed on held-out test set only. "
            "Accuracy is context only; primary metrics are ROC-AUC and capacity metrics."
        ),
    }


# ---------------------------------------------------------------------------
# Plotly chart helpers
# ---------------------------------------------------------------------------

def plot_roc_curve(
    y_true: np.ndarray,
    y_proba: np.ndarray,
    model_name: str = "Model",
) -> go.Figure:
    """Return a Plotly ROC curve figure."""
    fpr, tpr, _ = roc_curve(y_true, y_proba)
    auc = roc_auc_score(y_true, y_proba)

    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=fpr, y=tpr,
        mode="lines",
        name=f"{model_name} (AUC={auc:.3f})",
        line=dict(color="#6366f1", width=2),
        fill="tozeroy",
        fillcolor="rgba(99,102,241,0.15)",
    ))
    fig.add_trace(go.Scatter(
        x=[0, 1], y=[0, 1],
        mode="lines",
        name="Random (AUC=0.5)",
        line=dict(color="#888", width=1, dash="dash"),
    ))
    fig.update_layout(
        title=f"ROC Curve – {model_name}",
        xaxis_title="False Positive Rate",
        yaxis_title="True Positive Rate",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font_color="#e0e0ff",
        legend=dict(font=dict(color="#e0e0ff")),
        xaxis=dict(gridcolor="rgba(255,255,255,0.08)"),
        yaxis=dict(gridcolor="rgba(255,255,255,0.08)"),
        margin=dict(t=55, b=40, l=55, r=20),
    )
    return fig


def plot_confusion_matrix(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    model_name: str = "Model",
) -> go.Figure:
    """Return a Plotly annotated confusion matrix heatmap."""
    cm = confusion_matrix(y_true, y_pred)
    labels = ["Predicted No", "Predicted Yes"]
    row_labels = ["Actual No", "Actual Yes"]

    fig = go.Figure(go.Heatmap(
        z=cm,
        x=labels,
        y=row_labels,
        colorscale=[[0, "#1e1b4b"], [1, "#6366f1"]],
        text=cm,
        texttemplate="%{text}",
        textfont={"size": 18, "color": "white"},
        showscale=False,
        hovertemplate="%{y} / %{x}: %{z}<extra></extra>",
    ))
    fig.update_layout(
        title=f"Confusion Matrix – {model_name}",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font_color="#e0e0ff",
        margin=dict(t=55, b=40, l=90, r=20),
        height=320,
    )
    return fig


def plot_model_comparison(reports: list[dict]) -> go.Figure:
    """Bar chart comparing ROC-AUC, F1, Precision, Recall across models."""
    models = [r["model_name"] for r in reports]
    metrics_to_show = ["roc_auc", "f1", "precision", "recall"]
    labels = ["ROC-AUC", "F1", "Precision", "Recall"]
    colors = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981"]

    fig = go.Figure()
    for metric, label, color in zip(metrics_to_show, labels, colors):
        values = [r["metrics"][metric] for r in reports]
        fig.add_trace(go.Bar(
            name=label,
            x=models,
            y=values,
            marker_color=color,
            text=[f"{v:.3f}" for v in values],
            textposition="outside",
        ))

    fig.update_layout(
        barmode="group",
        title="Model Comparison (Held-out Test Set)",
        yaxis=dict(range=[0, 1.05], gridcolor="rgba(255,255,255,0.08)"),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font_color="#e0e0ff",
        legend=dict(font=dict(color="#e0e0ff")),
        margin=dict(t=55, b=40, l=55, r=20),
    )
    return fig
