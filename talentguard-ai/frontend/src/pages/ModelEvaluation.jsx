import React, { useState, useEffect } from 'react';
import { getEvaluation } from '../api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function ModelEvaluation() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEvaluation()
      .then((res) => {
        setReports(res.data.reports || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch evaluation metrics.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return <div className="error-box">{error}</div>;
  }

  const chartComparison = reports.map((r) => ({
    name: r.model_name.replace('Classifier', ''),
    'ROC-AUC': Number(((r.metrics?.roc_auc || 0) * 100).toFixed(1)),
    'Precision@50': Number(((r.precision_at_50 || 0) * 100).toFixed(1)),
    'Recall@50': Number(((r.recall_at_50 || 0) * 100).toFixed(1)),
    F1: Number(((r.metrics?.f1 || 0) * 100).toFixed(1)),
  }));

  return (
    <div>
      <div className="page-header">
        <h1> Model Evaluation &amp; Benchmarking</h1>
        <p>Rigorous offline evaluation on held-out test splits with HR capacity constraints.</p>
      </div>

      {/* Comparison Chart */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>
          Model Benchmark Comparison
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Comparing baseline dummy against regularized Logistic Regression and Gradient Boosting (HistGBM).
        </p>

        <div style={{ height: '320px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartComparison} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-secondary)' }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#cbd5e1',
                  borderRadius: '8px',
                  color: '#0f172a',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
                formatter={(val) => [`${val}%`]}
              />
              <Legend />
              <Bar dataKey="ROC-AUC" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Precision@50" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Recall@50" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="F1" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Cards */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        {reports.map((r, i) => {
          const m = r.metrics || {};
          const isWinner = r.model_name.includes('HistGradient') || r.model_name.includes('Logistic');
          return (
            <div key={i} className="card" style={{ border: isWinner ? '1px solid rgba(99,102,241,0.3)' : '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {r.model_name}
                </h4>
                {r.model_name === 'HistGradientBoostingClassifier' && (
                  <span className="status-badge status-approved">Production</span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>ROC-AUC:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{(m.roc_auc || 0).toFixed(4)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Precision@50:</span>
                  <strong style={{ color: '#6ee7b7' }}>{((r.precision_at_50 || 0) * 100).toFixed(1)}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Recall@50:</span>
                  <strong style={{ color: '#fcd34d' }}>{((r.recall_at_50 || 0) * 100).toFixed(1)}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>F1-Score:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{(m.f1 || 0).toFixed(4)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Accuracy:</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{((m.accuracy || 0) * 100).toFixed(1)}%</span>
                </div>
              </div>

              {m.confusion_matrix && (
                <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', fontSize: '0.75rem' }}>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>CONFUSION MATRIX (TEST SET)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', textAlign: 'center' }}>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '4px' }}>TN: {m.confusion_matrix.tn}</div>
                    <div style={{ background: 'rgba(239,68,68,0.1)', padding: '4px', color: '#fca5a5' }}>FP: {m.confusion_matrix.fp}</div>
                    <div style={{ background: 'rgba(239,68,68,0.1)', padding: '4px', color: '#fca5a5' }}>FN: {m.confusion_matrix.fn}</div>
                    <div style={{ background: 'rgba(16,185,129,0.1)', padding: '4px', color: '#6ee7b7' }}>TP: {m.confusion_matrix.tp}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Production Reasoning Card */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>
           Why Capacity-Constrained Metrics (Precision@K) Matter in HR
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Standard accuracy (e.g. 84%) is misleading in imbalanced datasets because a naïve classifier predicting nobody leaves achieves 84% accuracy while catching zero churners. HR business partners can realistically conduct 50 proactive check-ins per cycle. Therefore, <strong>Precision@50</strong> (how many of our 50 flagged employees were genuinely at-risk) is the primary metric governing operational ROI.
        </p>
      </div>
    </div>
  );
}
