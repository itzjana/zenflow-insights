import React, { useState, useEffect } from 'react';
import { getEDA, getEDAFeatures, getEDAChart } from '../api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function EDA() {
  const [edaData, setEdaData] = useState(null);
  const [features, setFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState('OverTime');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getEDA(), getEDAFeatures()])
      .then(([edaRes, featRes]) => {
        setEdaData(edaRes.data);
        const feats = featRes.data.features || [];
        setFeatures(feats);
        if (feats.length > 0) {
          setSelectedFeature(feats[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load EDA data from backend. Make sure the API is running.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedFeature) return;
    setChartLoading(true);
    getEDAChart(selectedFeature)
      .then((res) => {
        const formatted = res.data.map((item) => ({
          ...item,
          attrition_pct: Number((item.attrition_rate * 100).toFixed(1)),
          category: String(item[selectedFeature]),
        }));
        setChartData(formatted);
        setChartLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setChartLoading(false);
      });
  }, [selectedFeature]);

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

  const baselineRate = edaData?.summary?.attrition_rate != null
    ? (edaData.summary.attrition_rate * 100).toFixed(1)
    : '16.1';

  return (
    <div>
      <div className="page-header">
        <h1> Exploratory Data Analysis</h1>
        <p>Analyze historical attrition distributions, demographic correlations, and behavioral patterns.</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="label">Total Workforce</div>
          <div className="value">{edaData?.summary?.total_rows?.toLocaleString() ?? '1,470'}</div>
          <div className="sub">Cleaned records analyzed</div>
        </div>
        <div className="metric-card">
          <div className="label">Baseline Attrition Rate</div>
          <div className="value" style={{ color: 'var(--amber)' }}>{baselineRate}%</div>
          <div className="sub">Company-wide historical churn</div>
        </div>
        <div className="metric-card">
          <div className="label">Analyzed Features</div>
          <div className="value">{features.length}</div>
          <div className="sub">Key behavioural variables</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Feature Deep Dive</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Compare attrition rates across groups for selected variable
            </span>
          </div>
          <div style={{ minWidth: '220px' }}>
            <label htmlFor="feature-select">Select Feature</label>
            <select
              id="feature-select"
              value={selectedFeature}
              onChange={(e) => setSelectedFeature(e.target.value)}
            >
              {features.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {chartLoading ? (
          <div className="loading-spinner" style={{ height: '300px' }}>
            <div className="spinner" />
          </div>
        ) : (
          <div style={{ height: '320px', width: '100%', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="category"
                  stroke="var(--text-muted)"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '8px',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                  formatter={(val, name) => [`${val}%`, 'Attrition Rate']}
                  labelFormatter={(lbl) => `${selectedFeature}: ${lbl}`}
                />
                <Bar dataKey="attrition_pct" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>
             Key Empirical Findings
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <li style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
               <strong style={{ color: 'var(--text-primary)' }}>OverTime:</strong> Employees working overtime exhibit ~30.5% attrition vs ~10.4% for non-overtime peers (3x difference).
            </li>
            <li style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
               <strong style={{ color: 'var(--text-primary)' }}>Role Level & Income:</strong> Entry-level roles (Sales Representatives, Lab Techs) and MonthlyIncome &lt; $3,000 carry highest vulnerability.
            </li>
            <li style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
               <strong style={{ color: 'var(--text-primary)' }}>Marital Status:</strong> Single employees display ~25.5% attrition vs ~12.5% for married/divorced peers.
            </li>
            <li>
              ⏳ <strong style={{ color: 'var(--text-primary)' }}>Tenure Cliff:</strong> Highest hazard within Year 0-2 under current managers.
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>
             Production Guidance
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
            Historical correlations reflect organizational symptoms rather than unilateral individual intent. In production deployments:
          </p>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            • Never use demographic traits (marital status, age) as criteria for adverse retention decisions.<br />
            • Focus interventions on mutable operational factors: compensation adjustments, manager coaching, and overtime workload rebalancing.
          </div>
        </div>
      </div>
    </div>
  );
}
