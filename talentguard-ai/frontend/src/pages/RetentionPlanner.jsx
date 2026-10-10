import React, { useState, useEffect } from 'react';
import { getDrafts, approveDraft, rejectDraft, exportDrafts } from '../api';

function RiskBar({ score }) {
  const pct = Math.round((score || 0) * 100);
  const color = pct >= 70 ? '#dc2626' : pct >= 40 ? '#d97706' : '#16a34a';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem', color }}>{pct}%</span>
    </div>
  );
}

function EvidenceTag({ feature, observed_value, direction, magnitude }) {
  const isRisk = direction === 'increases_risk';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 12px', background: isRisk ? '#fef2f2' : '#f0fdf4',
      border: `1px solid ${isRisk ? '#fecaca' : '#bbf7d0'}`,
      borderRadius: 6, marginBottom: 6
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>{feature}</div>
        <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
          value: {String(observed_value ?? 'N/A')}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{
          fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: 3,
          background: isRisk ? '#fee2e2' : '#dcfce7',
          color: isRisk ? '#991b1b' : '#166534',
          border: `1px solid ${isRisk ? '#fca5a5' : '#86efac'}`
        }}>
          {isRisk ? 'Increases Risk' : 'Reduces Risk'}
        </span>
        {magnitude != null && (
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
            weight: {magnitude.toFixed(3)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RetentionPlanner() {
  const [drafts, setDrafts]   = useState([]);
  const [filter, setFilter]   = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const [reviewerInputs, setReviewerInputs] = useState({});
  const [actionLoading, setActionLoading]   = useState({});
  const [expanded, setExpanded]             = useState({});

  const loadDrafts = (statusFilter) => {
    setLoading(true);
    getDrafts(statusFilter)
      .then((res) => {
        setDrafts(res.data.drafts || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch retention drafts. Make sure the backend is running.');
        setLoading(false);
      });
  };

  useEffect(() => { loadDrafts(filter); }, [filter]);

  const handleInputChange = (empId, field, val) => {
    setReviewerInputs((prev) => ({ ...prev, [empId]: { ...prev[empId], [field]: val } }));
  };

  const toggleExpand = (empId) => {
    setExpanded((prev) => ({ ...prev, [empId]: !prev[empId] }));
  };

  const handleApprove = (empId) => {
    const inputs = reviewerInputs[empId] || {};
    const reviewerId = inputs.reviewerId?.trim() || 'HR_MANAGER_1';
    const note = inputs.note?.trim() || '';
    setActionLoading((prev) => ({ ...prev, [empId]: true }));
    approveDraft(empId, reviewerId, note)
      .then(() => { loadDrafts(filter); setActionLoading((prev) => ({ ...prev, [empId]: false })); })
      .catch((err) => { alert(err.response?.data?.detail || 'Approval failed'); setActionLoading((prev) => ({ ...prev, [empId]: false })); });
  };

  const handleReject = (empId) => {
    const inputs = reviewerInputs[empId] || {};
    const reviewerId = inputs.reviewerId?.trim() || 'HR_MANAGER_1';
    const note = inputs.note?.trim() || '';
    setActionLoading((prev) => ({ ...prev, [empId]: true }));
    rejectDraft(empId, reviewerId, note)
      .then(() => { loadDrafts(filter); setActionLoading((prev) => ({ ...prev, [empId]: false })); })
      .catch((err) => { alert(err.response?.data?.detail || 'Rejection failed'); setActionLoading((prev) => ({ ...prev, [empId]: false })); });
  };

  // Counts
  const counts = drafts.reduce((acc, d) => {
    const s = (d.status || '').toUpperCase();
    if (s === 'PENDING_APPROVAL') acc.pending++;
    else if (s === 'APPROVED') acc.approved++;
    else if (s === 'REJECTED') acc.rejected++;
    return acc;
  }, { pending: 0, approved: 0, rejected: 0 });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1>Retention Action Planner</h1>
          <p>Human-in-the-Loop governance for proactive retention interventions. All plans require reviewer approval.</p>
        </div>
        <a
          href={exportDrafts()}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost btn-sm"
        >
          Export CSV
        </a>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Pending Review', count: counts.pending, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
          { label: 'Approved',       count: counts.approved, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
          { label: 'Rejected',       count: counts.rejected, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
        ].map((s) => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: '10px 18px', flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{s.count}</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { key: 'all',      label: 'All Plans' },
          { key: 'pending',  label: 'Pending Review' },
          { key: 'approved', label: 'Approved' },
          { key: 'rejected', label: 'Rejected' },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`tab-btn ${filter === key ? 'active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : error ? (
        <div className="error-box">{error}</div>
      ) : drafts.length === 0 ? (
        <div className="empty-state">
          <span className="icon">—</span>
          <p>No retention drafts found in this category.</p>
        </div>
      ) : (
        <div>
          {drafts.map((d) => {
            const empId    = d.employee_id;
            const status   = (d.status || '').toUpperCase();
            const isPending = status === 'PENDING_APPROVAL' || status === 'PENDING';
            const isExpanded = expanded[empId];
            const inputs   = reviewerInputs[empId] || { reviewerId: '', note: '' };
            const isBusy   = actionLoading[empId];
            const statusClass = status === 'PENDING_APPROVAL' ? 'status-pending_approval'
                              : status === 'APPROVED'          ? 'status-approved'
                              : status === 'REJECTED'          ? 'status-rejected'
                              : 'status-pending';
            const riskPct = Math.round((d.risk_score || 0) * 100);
            const riskClass = riskPct >= 70 ? 'risk-high' : riskPct >= 40 ? 'risk-med' : 'risk-low';

            return (
              <div key={empId} className="draft-card">
                {/* Card header */}
                <div className="draft-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 8,
                      background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)',
                      border: '1px solid #bfdbfe',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.85rem', color: '#1e40af'
                    }}>
                      {String(empId).slice(-3)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>EMP-{empId}</span>
                        <span className={`status-badge ${statusClass}`}>
                          {status === 'PENDING_APPROVAL' ? 'Pending Review' : status}
                        </span>
                        <span className={`risk-badge ${riskClass}`}>{riskPct}% Risk</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>
                        Created: {d.created_at ? new Date(d.created_at).toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Right side: risk bar + expand */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 160 }}>
                      <RiskBar score={d.risk_score} />
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => toggleExpand(empId)}
                    >
                      {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                  </div>
                </div>

                {/* Card body */}
                <div className="draft-card-body">
                  <div className="grid-2" style={{ gap: 16 }}>
                    {/* Recommended actions */}
                    <div className="draft-section">
                      <h4>Recommended Actions</h4>
                      <ul>
                        {(d.recommended_actions || ['Schedule a supportive one-to-one conversation.']).map((action, i) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Conversation guide */}
                    <div className="draft-section">
                      <h4>Conversation Guide</h4>
                      <ul>
                        {(d.conversation_guide || []).map((q, i) => (
                          <li key={i} style={{ color: '#475569', fontStyle: 'italic' }}>"{q}"</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Expanded evidence section */}
                  {isExpanded && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 700, marginBottom: 10 }}>
                        Evidence Signals (SHAP)
                      </div>
                      {(d.evidence || []).map((ev, i) => (
                        <EvidenceTag key={i} {...ev} />
                      ))}

                      {d.risk_reasons && d.risk_reasons.length > 0 && (
                        <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef9c3', border: '1px solid #fde047', borderRadius: 6, fontSize: '0.78rem', color: '#713f12' }}>
                          <strong style={{ display: 'block', marginBottom: 4 }}>Risk Summary Factors:</strong>
                          {d.risk_reasons.join(' | ')}
                        </div>
                      )}

                      {d.limitations && (
                        <div className="info-box" style={{ marginTop: 12 }}>
                          <strong>Methodology Caveat:</strong> {d.limitations}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Audit trail for reviewed drafts */}
                  {!isPending && (
                    <div style={{ marginTop: 14, padding: '12px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.8rem', color: '#475569' }}>
                      <strong style={{ color: '#0f172a' }}>Audit Trail:</strong>{' '}
                      Reviewed by{' '}
                      <code style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', borderRadius: 3, padding: '1px 5px' }}>
                        {d.reviewed_by || '—'}
                      </code>{' '}
                      at {d.reviewed_at ? new Date(d.reviewed_at).toLocaleString() : '—'}
                      {d.review_note && (
                        <div style={{ marginTop: 5, color: '#64748b', fontStyle: 'italic' }}>
                          Note: "{d.review_note}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pending action controls */}
                  {isPending && (
                    <div className="draft-actions">
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <label htmlFor={`reviewer-${empId}`}>Reviewer ID</label>
                        <input
                          id={`reviewer-${empId}`}
                          type="text"
                          placeholder="e.g. HR_JONES"
                          value={inputs.reviewerId}
                          onChange={(e) => handleInputChange(empId, 'reviewerId', e.target.value)}
                        />
                      </div>
                      <div style={{ flex: 2, minWidth: 200 }}>
                        <label htmlFor={`notes-${empId}`}>Audit Justification Notes</label>
                        <input
                          id={`notes-${empId}`}
                          type="text"
                          placeholder="Explain decision rationale or modification..."
                          value={inputs.note}
                          onChange={(e) => handleInputChange(empId, 'note', e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-end' }}>
                        <button
                          className="btn btn-success"
                          disabled={isBusy}
                          onClick={() => handleApprove(empId)}
                        >
                          {isBusy ? 'Processing...' : 'Approve Plan'}
                        </button>
                        <button
                          className="btn btn-danger"
                          disabled={isBusy}
                          onClick={() => handleReject(empId)}
                        >
                          {isBusy ? 'Processing...' : 'Reject Plan'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
