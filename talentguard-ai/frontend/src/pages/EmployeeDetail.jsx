import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployee, getEmployees, generateGrokPlan } from '../api';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentId, setCurrentId] = useState(id || '167');
  const [employee, setEmployee] = useState(null);
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Grok AI Plan state
  const [grokPlan, setGrokPlan] = useState(null);
  const [grokLoading, setGrokLoading] = useState(false);
  const [grokError, setGrokError] = useState(null);

  // Load employee list for quick selector
  useEffect(() => {
    getEmployees()
      .then((res) => {
        setEmployeeList(res.data.employees || []);
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchEmployeeData = (targetId) => {
    if (!targetId && targetId !== 0) return;
    setLoading(true);
    setError(null);
    setGrokPlan(null);
    setGrokError(null);

    getEmployee(targetId)
      .then((res) => {
        setEmployee(res.data);
        setCurrentId(String(res.data.employee_id));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(`Employee records for ID "${targetId}" could not be retrieved. Please select an employee from the dropdown.`);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id !== undefined) {
      setCurrentId(id);
      fetchEmployeeData(id);
    } else {
      fetchEmployeeData(currentId);
    }
  }, [id]);

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    setCurrentId(selected);
    navigate(`/employee/${selected}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (currentId) {
      navigate(`/employee/${currentId}`);
    }
  };

  const handleGenerateGrok = () => {
    if (!employee) return;
    setGrokLoading(true);
    setGrokError(null);

    generateGrokPlan(employee.employee_id)
      .then((res) => {
        setGrokPlan(res.data);
        setGrokLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setGrokError(err.response?.data?.detail || 'Failed to generate AI plan.');
        setGrokLoading(false);
      });
  };

  const getRiskBadge = (pct) => {
    if (pct >= 50) return { label: 'High Flight Risk', cls: 'risk-badge risk-high' };
    if (pct >= 25) return { label: 'Moderate Risk', cls: 'risk-badge risk-med' };
    return { label: 'Low Risk', cls: 'risk-badge risk-low' };
  };

  return (
    <div>
      <div className="page-header">
        <h1> Employee Risk Profile &amp; Explainability</h1>
        <p>Holistic employee overview with calibrated attrition factors, SHAP attributions, and Grok AI retention support.</p>
      </div>

      {/* Top Search & Dropdown Bar */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ width: '160px' }}>
              <label htmlFor="emp-search">Enter ID</label>
              <input
                id="emp-search"
                type="number"
                placeholder="e.g. 167"
                value={currentId}
                onChange={(e) => setCurrentId(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Load Profile
            </button>
          </form>

          {employeeList.length > 0 && (
            <div style={{ flex: 1, minWidth: '240px' }}>
              <label htmlFor="emp-select">Quick Select from Workforce</label>
              <select
                id="emp-select"
                value={currentId}
                onChange={handleSelectChange}
              >
                <option value="">-- Choose Employee --</option>
                {employeeList.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    EMP-{emp.employee_id} — {emp.job_role} ({emp.risk_pct}% Risk)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      ) : error ? (
        <div className="error-box">
          <p><strong>Notice:</strong> {error}</p>
          <div style={{ marginTop: '12px' }}>
            <button className="btn btn-primary btn-sm" onClick={() => fetchEmployeeData('167')}>
              Load Sample Employee (EMP-167)
            </button>
          </div>
        </div>
      ) : employee ? (
        <div className="employee-layout">
          {/* 
              HR ATTRITION OVERVIEW SIDEBAR
               */}
          <aside className="emp-sidebar">
            <div className="emp-sidebar-header">
              <div className="emp-avatar">
                {employee.features?.Gender === 'Female' ? '' : ''}
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>EMP-{employee.employee_id}</h2>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {employee.features?.JobRole}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {employee.features?.Department}
              </div>

              {/* Risk Badge */}
              <div style={{ marginTop: '12px' }}>
                <span className={getRiskBadge(employee.risk_pct).cls}>
                  {employee.risk_pct}% · {getRiskBadge(employee.risk_pct).label}
                </span>
              </div>
            </div>

            {/* Attrition Overview Stats */}
            <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              HR Attrition Signals
            </h4>

            <div className="emp-sidebar-stat">
              <span>OverTime Status</span>
              <span style={{ color: employee.features?.OverTime === 'Yes' ? '#dc2626' : '#059669', fontWeight: 700 }}>
                {employee.features?.OverTime === 'Yes' ? ' Yes (Mandatory)' : ' Standard'}
              </span>
            </div>

            <div className="emp-sidebar-stat">
              <span>Monthly Salary</span>
              <span>${Number(employee.features?.MonthlyIncome || 0).toLocaleString()}</span>
            </div>

            <div className="emp-sidebar-stat">
              <span>Job Level</span>
              <span>Level {employee.features?.JobLevel}</span>
            </div>

            <div className="emp-sidebar-stat">
              <span>Company Tenure</span>
              <span>{employee.features?.YearsAtCompany} Years</span>
            </div>

            <div className="emp-sidebar-stat">
              <span>Years w/ Manager</span>
              <span>{employee.features?.YearsWithCurrManager || employee.summary?.years_with_manager || 0} Years</span>
            </div>

            <div className="emp-sidebar-stat">
              <span>Job Satisfaction</span>
              <span>{employee.features?.JobSatisfaction} / 4</span>
            </div>

            <div className="emp-sidebar-stat">
              <span>Work-Life Balance</span>
              <span>{employee.features?.WorkLifeBalance} / 4</span>
            </div>

            <div className="emp-sidebar-stat" style={{ borderBottom: 'none' }}>
              <span>Commute Distance</span>
              <span>{employee.features?.DistanceFromHome} Miles</span>
            </div>

            {/* Action Buttons in Sidebar */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%', fontSize: '0.85rem' }}
                onClick={() => navigate(`/whatif?id=${employee.employee_id}`)}
              >
                 Simulate Interventions
              </button>

              <button
                className="btn btn-ghost"
                style={{ width: '100%', fontSize: '0.85rem', borderColor: '#bfdbfe', color: 'var(--accent)' }}
                disabled={grokLoading}
                onClick={handleGenerateGrok}
              >
                {grokLoading ? 'Consulting Grok AI...' : ' Generate Grok AI Plan'}
              </button>
            </div>
          </aside>

          {/* 
              MAIN DETAIL COLUMN
               */}
          <main>
            {/* Grok AI Retention Plan Output */}
            {grokError && (
              <div className="error-box" style={{ marginBottom: '20px' }}>
                {grokError}
              </div>
            )}

            {grokPlan && (
              <div className="card" style={{ marginBottom: '24px', border: '1px solid #93c5fd', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.4rem' }}></span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent)' }}>
                      Grok AI Retention Strategy
                    </h3>
                    <span className="status-badge status-approved" style={{ fontSize: '0.7rem' }}>
                      {grokPlan.engine === 'grok-ai' ? 'xAI Grok-2' : 'Guardrail Engine'}
                    </span>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setGrokPlan(null)}>
                    Dismiss
                  </button>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                  <strong>Executive Summary:</strong> {grokPlan.analysis_summary}
                </p>

                <div className="grid-2" style={{ marginBottom: '16px' }}>
                  <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Recommended HR Actions
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                      {(grokPlan.recommended_actions || []).map((act, i) => (
                        <li key={i}> {act}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      1-on-1 Discovery Guide
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                      {(grokPlan.conversation_guide || []).map((q, i) => (
                        <li key={i}> <em>"{q}"</em></li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                  <span>Investment: <strong>{grokPlan.estimated_investment}</strong> · Window: <strong>{grokPlan.recommended_timeline}</strong></span>
                  <span> {grokPlan.guardrail_compliance_note}</span>
                </div>
              </div>
            )}

            {/* Model Signals (SHAP Factor Attribution) */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                   Attribution Signals (Why the Model Flagged This Employee)
                </h3>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Local SHAP contributions indicating features driving this individual's prediction away from or towards attrition.
              </p>

              {(!employee.explanations || employee.explanations.length === 0) ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  No feature attribution available for this profile.
                </div>
              ) : (
                <div>
                  {employee.explanations.map((exp, idx) => {
                    const isIncreases = exp.direction === 'increases_risk' || (exp.magnitude && exp.direction !== 'decreases_risk');
                    return (
                      <div key={idx} className="explanation-item">
                        <div style={{ flex: 1 }}>
                          <div className="feat-name">{exp.feature}</div>
                          <div className="feat-val">Observed Value: <strong>{String(exp.observed_value ?? 'N/A')}</strong></div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className={isIncreases ? 'direction-up' : 'direction-down'} style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                            {isIncreases ? ' Elevates Risk' : ' Lowers Risk'}
                          </span>
                          <div
                            className="mag-bar"
                            style={{
                              marginTop: '4px',
                              background: isIncreases ? 'var(--red)' : 'var(--green)',
                              width: `${Math.min(110, Math.max(25, (exp.magnitude || 0.1) * 220))}px`,
                              marginLeft: 'auto'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ marginTop: '16px', background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                ℹ <em>{employee.caveat || 'Attribution contributions are statistical signals, not root-cause diagnoses.'}</em>
              </div>
            </div>

            {/* Employment Attributes Profile */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
                 Comprehensive Employment Profile
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {employee.features &&
                  Object.entries(employee.features).map(([key, val]) => (
                    <div
                      key={key}
                      style={{
                        background: '#f8fafc',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        {key}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                        {typeof val === 'number' && key.toLowerCase().includes('income')
                          ? `$${val.toLocaleString()}`
                          : String(val)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </main>
        </div>
      ) : null}
    </div>
  );
}
