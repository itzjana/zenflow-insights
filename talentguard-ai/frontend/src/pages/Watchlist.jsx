import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWatchlist, exportWatchlist } from '../api';

export default function Watchlist() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [overtimeFilter, setOvertimeFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    getWatchlist(50)
      .then((res) => {
        setData(res.data.watchlist || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load watchlist from API.');
        setLoading(false);
      });
  }, []);

  const departments = ['All', ...new Set(data.map((d) => d.department).filter(Boolean))];

  const filtered = data.filter((item) => {
    const matchesSearch =
      String(item.employee_id).includes(search) ||
      item.job_role?.toLowerCase().includes(search.toLowerCase()) ||
      item.department?.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'All' || item.department === deptFilter;
    const matchesOT = overtimeFilter === 'All' || item.overtime === overtimeFilter;
    return matchesSearch && matchesDept && matchesOT;
  });

  const getRiskClass = (pct) => {
    if (pct >= 50) return 'risk-badge risk-high';
    if (pct >= 25) return 'risk-badge risk-med';
    return 'risk-badge risk-low';
  };

  const otCount = filtered.filter((d) => d.overtime === 'Yes').length;
  const avgRisk = filtered.length > 0
    ? (filtered.reduce((sum, d) => sum + (d.risk_pct || 0), 0) / filtered.length).toFixed(1)
    : 0;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1> High-Priority Watchlist (Top 50)</h1>
          <p>Employees ranked by calibrated attrition probability for proactive retention triage.</p>
        </div>
        <a
          href={exportWatchlist()}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary btn-sm"
          style={{ textDecoration: 'none' }}
        >
           Export CSV
        </a>
      </div>

      {/* Summary KPI row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="label">Cohort Size</div>
          <div className="value">{filtered.length}</div>
          <div className="sub">Flagged employees</div>
        </div>
        <div className="metric-card">
          <div className="label">Average Risk</div>
          <div className="value" style={{ color: '#dc2626' }}>{avgRisk}%</div>
          <div className="sub">Probability in cohort</div>
        </div>
        <div className="metric-card">
          <div className="label">Working OverTime</div>
          <div className="value" style={{ color: '#d97706' }}>{otCount}</div>
          <div className="sub">{filtered.length > 0 ? `${((otCount / filtered.length) * 100).toFixed(0)}% of cohort` : '0%'}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label htmlFor="search-input">Search ID / Role</label>
            <input
              id="search-input"
              type="text"
              placeholder="e.g. 167 or Sales..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="dept-select">Department</label>
            <select
              id="dept-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ot-select">OverTime Status</label>
            <select
              id="ot-select"
              value={overtimeFilter}
              onChange={(e) => setOvertimeFilter(e.target.value)}
            >
              <option value="All">All Overtime Statuses</option>
              <option value="Yes">Yes (Overtime)</option>
              <option value="No">No (Standard)</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      ) : error ? (
        <div className="error-box">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon"></div>
          <p>No employees match the current filters.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Rank</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Job Role</th>
                <th>OverTime</th>
                <th>Monthly Salary</th>
                <th>Attrition Risk</th>
                <th>Primary Drivers</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.employee_id}>
                  <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>#{emp.rank}</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent)' }}>
                    EMP-{emp.employee_id}
                  </td>
                  <td>{emp.department}</td>
                  <td style={{ fontWeight: 600 }}>{emp.job_role}</td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: emp.overtime === 'Yes' ? '#fee2e2' : '#f1f5f9',
                        color: emp.overtime === 'Yes' ? '#dc2626' : '#475569',
                      }}
                    >
                      {emp.overtime === 'Yes' ? 'Overtime' : 'Standard'}
                    </span>
                  </td>
                  <td>
                    {emp.monthly_income ? `$${emp.monthly_income.toLocaleString()}` : '—'}
                  </td>
                  <td>
                    <span className={getRiskClass(emp.risk_pct)}>
                      {emp.risk_pct}%
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {(emp.top_reasons || []).slice(0, 2).map((r, i) => (
                        <span
                          key={i}
                          style={{
                            background: '#f1f5f9',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => navigate(`/employee/${emp.employee_id}`)}
                      style={{ fontWeight: 600 }}
                    >
                      Inspect Profile &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
