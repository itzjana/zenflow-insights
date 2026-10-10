import React, { useEffect, useState } from 'react';
import { getOverview } from '../api';
import { useNavigate } from 'react-router-dom';

function MetricCard({ label, value, sub, color }) {
  return (
    <div className="metric-card">
      <div className="label">{label}</div>
      <div className="value" style={color ? { color } : {}}>{value ?? '—'}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
}

export default function Overview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getOverview()
      .then(r => setData(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner"/></div>;

  return (
    <div>
      <div className="page-header">
        <h1> TalentGuard AI</h1>
        <p>Prioritise supportive retention conversations with data-driven insights.</p>
      </div>

      {error && <div className="error-box"> API unavailable — ensure the backend is running on port 8000.<br/><small>{error}</small></div>}

      <div className="metrics-grid">
        <MetricCard label="Dataset Rows" value={data?.dataset?.rows?.toLocaleString()} sub="IBM HR Analytics" />
        <MetricCard label="Observed Attrition" value={data ? `${data.dataset.attrition_rate}%` : '—'} sub={`${data?.dataset?.attrition_count ?? '—'} employees`} color="#f59e0b" />
        <MetricCard label="Best Model" value={data?.model?.trained ? 'HGB' : 'Untrained'} sub={data?.model?.name} color={data?.model?.trained ? '#6366f1' : '#ef4444'} />
        <MetricCard label="ROC-AUC" value={data?.metrics?.roc_auc ? data.metrics.roc_auc.toFixed(3) : '—'} sub="Held-out test" color="#10b981" />
        <MetricCard label="Precision@50" value={data?.metrics?.precision_at_50 ? data.metrics.precision_at_50.toFixed(3) : '—'} sub="Capacity metric" />
        <MetricCard label="Recall@50" value={data?.metrics?.recall_at_50 ? data.metrics.recall_at_50.toFixed(3) : '—'} sub="Coverage" />
      </div>

      <div className="grid-2" style={{gap:20}}>
        <div className="card">
          <h3 style={{color:'var(--text-primary)',marginBottom:16}}>Pipeline Architecture</h3>
          <pre style={{fontSize:'0.78rem',color:'var(--text-secondary)',lineHeight:1.7,overflowX:'auto'}}>
{`IBM HR CSV
  → Data validation & EDA
  → Leakage-safe preprocessing
  → DummyClassifier baseline
  → LogisticRegression baseline
  → HistGradientBoosting (best)
  → Held-out evaluation + Precision@50
  → Scoring service
       → Ranked Top-50 watchlist
       → Top-3 local explanations
       → Top-10 retention drafts
  → What-If Simulator
  → HR approval workflow + audit
  → CSV exports`}
          </pre>
        </div>

        <div className="card">
          <h3 style={{color:'var(--text-primary)',marginBottom:16}}>Quick Actions</h3>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {[
              [' View Top-50 Watch List', '/watchlist'],
              [' Review Retention Drafts', '/retention'],
              [' Run What-If Simulation', '/whatif'],
              [' Explore EDA Charts', '/eda'],
              [' Model Evaluation Report', '/evaluation'],
            ].map(([label, path]) => (
              <button key={path} className="btn btn-ghost" style={{justifyContent:'flex-start'}} onClick={() => navigate(path)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop:20}}>
        <h3 style={{color:'var(--text-primary)',marginBottom:12}}> Important Disclaimer</h3>
        <p style={{color:'var(--text-secondary)',fontSize:'0.875rem',lineHeight:1.7}}>
          TalentGuard AI is <strong>decision support</strong>, not a resignation detector.
          Model outputs are <strong>probabilistic estimates</strong>, not validated predictions.
          All retention actions require <strong>explicit human review and approval</strong>.
          The tool must not be used for automated hiring, firing, promotion, or disciplinary decisions.
          The IBM dataset is a synthetic benchmark — results may not generalise to all workforces.
        </p>
      </div>
    </div>
  );
}
