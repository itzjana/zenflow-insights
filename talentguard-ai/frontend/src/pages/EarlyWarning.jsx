import React, { useState, useEffect } from 'react';
import { getEarlyWarning } from '../api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function EarlyWarning() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmp, setSelectedEmp] = useState(null);

  useEffect(() => {
    getEarlyWarning(50, 3)
      .then((res) => {
        setData(res.data);
        const snaps = res.data.snapshots || [];
        if (snaps.length > 0 && snaps[0].employees?.length > 0) {
          setSelectedEmp(snaps[0].employees[0].EmployeeNumber);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load Early Warning simulation data.');
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

  const snapshots = data?.snapshots || [];

  // Build employee list
  const empList = snapshots[0]?.employees?.map((e) => e.EmployeeNumber) || [];

  // Build chart data for the selected employee across snapshots
  const chartPoints = snapshots.map((snap) => {
    const match = snap.employees.find((e) => e.EmployeeNumber === selectedEmp);
    return {
      date: snap.date,
      risk_score: match ? Number((match.risk_score * 100).toFixed(1)) : 0,
    };
  });

  // Calculate velocity delta
  const initialRisk = chartPoints[0]?.risk_score ?? 0;
  const currentRisk = chartPoints[chartPoints.length - 1]?.risk_score ?? 0;
  const delta = (currentRisk - initialRisk).toFixed(1);
  const isSurging = Number(delta) >= 15;

  return (
    <div>
      <div className="page-header">
        <h1> Longitudinal Early-Warning Trajectories</h1>
        <p>Monitor multi-cycle risk velocity to detect flight risk acceleration before formal notice.</p>
      </div>

      <div className="rai-banner" style={{ background: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.3)', color: '#c7d2fe' }}>
         <strong>Synthetic Methodology Notice:</strong> {data?.label || 'Synthetic Demonstration. The IBM HR dataset is cross-sectional without native temporal snapshots; this demonstrates production longitudinal delta tracking.'}
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <label htmlFor="emp-select">Select Tracked Employee</label>
            <select
              id="emp-select"
              value={selectedEmp || ''}
              onChange={(e) => setSelectedEmp(Number(e.target.value))}
              style={{ minWidth: '220px' }}
            >
              {empList.slice(0, 30).map((id) => (
                <option key={id} value={id}>
                  EMP-{id}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CURRENT TRAJECTORY DELTA</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: Number(delta) > 0 ? '#fca5a5' : '#6ee7b7' }}>
                {Number(delta) > 0 ? `+${delta}%` : `${delta}%`}
              </div>
            </div>
            {isSurging && (
              <span className="risk-badge risk-high" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                 Velocity Alert: Rapid Acceleration
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>
             3-Month Risk Progression (EMP-{selectedEmp})
          </h3>

          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartPoints} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fill: 'var(--text-secondary)' }} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-secondary)' }} unit="%" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '8px',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                  formatter={(val) => [`${val}%`, 'Risk Score']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="risk_score"
                  name="Calibrated Attrition Risk"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#3b82f6' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>
             Production Velocity Threshold Rules
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div style={{ background: 'rgba(239,68,68,0.08)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div style={{ fontWeight: 600, color: '#fca5a5', marginBottom: '4px' }}>
                 Tier 1 Surge: &Delta; Risk &gt; +15% within 60 Days
              </div>
              <div>Immediate HRBP alert triggered. Schedule retention intervention check-in within 7 business days.</div>
            </div>

            <div style={{ background: 'rgba(245,158,11,0.08)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div style={{ fontWeight: 600, color: '#fcd34d', marginBottom: '4px' }}>
                 Tier 2 Drift: &Delta; Risk &gt; +7% over 2 Consecutive Snapshots
              </div>
              <div>Flagged for quarterly manager calibration review. Monitor workload and overtime hours.</div>
            </div>

            <div style={{ background: 'rgba(16,185,129,0.08)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div style={{ fontWeight: 600, color: '#6ee7b7', marginBottom: '4px' }}>
                 Tier 3 Stabilized: &Delta; Risk &le; 0%
              </div>
              <div>Employee risk stable or decreasing following intervention. Re-evaluate quarterly.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
