import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getWhatIfOptions, runWhatIf, getEmployee } from '../api';

export default function WhatIf() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '1';

  const [employeeId, setEmployeeId] = useState(initialId);
  const [empProfile, setEmpProfile] = useState(null);
  const [options, setOptions] = useState({});
  const [changes, setChanges] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getWhatIfOptions()
      .then((res) => {
        setOptions(res.data || {});
      })
      .catch((err) => console.error(err));
  }, []);

  const loadEmployee = (idToLoad) => {
    setLoading(true);
    setError(null);
    setResult(null);
    getEmployee(idToLoad)
      .then((res) => {
        setEmpProfile(res.data);
        // Pre-fill editable changes with current employee values
        const currentFeatures = res.data.features || {};
        const initialChanges = {};
        if (currentFeatures.OverTime !== undefined) initialChanges.OverTime = currentFeatures.OverTime;
        if (currentFeatures.MonthlyIncome !== undefined) initialChanges.MonthlyIncome = currentFeatures.MonthlyIncome;
        if (currentFeatures.JobSatisfaction !== undefined) initialChanges.JobSatisfaction = currentFeatures.JobSatisfaction;
        if (currentFeatures.WorkLifeBalance !== undefined) initialChanges.WorkLifeBalance = currentFeatures.WorkLifeBalance;
        setChanges(initialChanges);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(`Could not load baseline for Employee ${idToLoad}`);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (employeeId) {
      loadEmployee(employeeId);
    }
  }, [employeeId]);

  const handleSimulate = (e) => {
    e.preventDefault();
    setSimulating(true);
    setError(null);
    runWhatIf(Number(employeeId), changes)
      .then((res) => {
        setResult(res.data);
        setSimulating(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.detail || 'Simulation failed.');
        setSimulating(false);
      });
  };

  const handleFieldChange = (field, val) => {
    setChanges((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  return (
    <div>
      <div className="page-header">
        <h1> Counterfactual What-If Simulator</h1>
        <p>Explore hypothetical HR policy changes and measure their projected impact on attrition probability.</p>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', maxWidth: '380px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="sim-emp">Select Employee</label>
            <input
              id="sim-emp"
              type="number"
              placeholder="e.g. 1"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>
          <button className="btn btn-ghost" onClick={() => loadEmployee(employeeId)}>
            Reload Baseline
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      ) : error ? (
        <div className="error-box">{error}</div>
      ) : empProfile ? (
        <div>
          <div className="grid-2" style={{ marginBottom: '24px' }}>
            {/* Policy Interventions Form */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>
                 Configure Proposed Interventions
              </h3>

              {/* OverTime */}
              <div className="form-group">
                <label>OverTime Requirement</label>
                <select
                  value={changes.OverTime || 'No'}
                  onChange={(e) => handleFieldChange('OverTime', e.target.value)}
                >
                  <option value="No">No (Eliminate OverTime)</option>
                  <option value="Yes">Yes (Mandatory OverTime)</option>
                </select>
              </div>

              {/* MonthlyIncome */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label>Adjust Monthly Salary ($)</label>
                  <span style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 600 }}>
                    ${Number(changes.MonthlyIncome || empProfile.features?.MonthlyIncome || 3000).toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="20000"
                  step="250"
                  value={changes.MonthlyIncome || empProfile.features?.MonthlyIncome || 3000}
                  onChange={(e) => handleFieldChange('MonthlyIncome', Number(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>$1,000</span>
                  <span>Baseline: ${empProfile.features?.MonthlyIncome?.toLocaleString()}</span>
                  <span>$20,000</span>
                </div>
              </div>

              {/* JobSatisfaction */}
              <div className="form-group">
                <label>Job Satisfaction Rating (1: Low &rarr; 4: Very High)</label>
                <select
                  value={changes.JobSatisfaction || 3}
                  onChange={(e) => handleFieldChange('JobSatisfaction', Number(e.target.value))}
                >
                  <option value={1}>1 - Low</option>
                  <option value={2}>2 - Medium</option>
                  <option value={3}>3 - High</option>
                  <option value={4}>4 - Very High</option>
                </select>
              </div>

              {/* WorkLifeBalance */}
              <div className="form-group">
                <label>Work Life Balance Rating (1: Bad &rarr; 4: Best)</label>
                <select
                  value={changes.WorkLifeBalance || 3}
                  onChange={(e) => handleFieldChange('WorkLifeBalance', Number(e.target.value))}
                >
                  <option value={1}>1 - Poor</option>
                  <option value={2}>2 - Fair</option>
                  <option value={3}>3 - Good</option>
                  <option value={4}>4 - Excellent</option>
                </select>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '8px' }}
                disabled={simulating}
                onClick={handleSimulate}
              >
                {simulating ? 'Computing Model Inference...' : ' Run Simulation'}
              </button>
            </div>

            {/* Results Preview */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>
                 Projected Outcome
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border)', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CURRENT BASELINE RISK</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {empProfile.risk_pct}%
                  </div>
                </div>
                <div style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>&rarr;</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SIMULATED POST-ACTION RISK</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: result ? '#a5b4fc' : 'var(--text-muted)' }}>
                    {result ? `${(result.simulated_probability * 100).toFixed(1)}%` : '—'}
                  </div>
                </div>
              </div>

              {result ? (
                <div className="scenario-result">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Net Estimated Risk Delta:</span>
                    <span className={result.delta <= 0 ? 'delta-negative' : 'delta-positive'}>
                      {result.delta <= 0 ? ' ' : ' '}
                      {Math.abs(result.delta * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
                    {result.delta < 0
                      ? `Applying these changes yields a projected ${(Math.abs(result.delta) * 100).toFixed(1)} percentage point reduction in attrition propensity.`
                      : 'The simulated policy changes do not reduce attrition probability for this employee.'}
                  </p>
                </div>
              ) : (
                <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Adjust variables on the left and click "Run Simulation" to compute projected probability shift.
                </div>
              )}

              <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                 <strong>Causal Disclaimer:</strong> Simulates predictive score changes assuming statistical associations hold. Does not guarantee absolute behavioral compliance.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
