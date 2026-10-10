import React, { useState, useEffect } from 'react';
import { getDrafts, approveDraft, rejectDraft, exportDrafts } from '../api';

export default function RetentionPlanner() {
  const [drafts, setDrafts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Per-draft reviewer state
  const [reviewerInputs, setReviewerInputs] = useState({});
  const [actionLoading, setActionLoading] = useState({});

  const loadDrafts = (statusFilter = filter) => {
    setLoading(true);
    getDrafts(statusFilter)
      .then((res) => {
        setDrafts(res.data.drafts || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch retention drafts.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDrafts(filter);
  }, [filter]);

  const handleInputChange = (empId, field, val) => {
    setReviewerInputs((prev) => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        [field]: val,
      },
    }));
  };

  const handleApprove = (empId) => {
    const inputs = reviewerInputs[empId] || {};
    const reviewerId = inputs.reviewerId || 'HR_MANAGER_1';
    const note = inputs.note || '';

    setActionLoading((prev) => ({ ...prev, [empId]: true }));
    approveDraft(empId, reviewerId, note)
      .then(() => {
        loadDrafts(filter);
        setActionLoading((prev) => ({ ...prev, [empId]: false }));
      })
      .catch((err) => {
        alert(err.response?.data?.detail || 'Approval failed');
        setActionLoading((prev) => ({ ...prev, [empId]: false }));
      });
  };

  const handleReject = (empId) => {
    const inputs = reviewerInputs[empId] || {};
    const reviewerId = inputs.reviewerId || 'HR_MANAGER_1';
    const note = inputs.note || '';

    setActionLoading((prev) => ({ ...prev, [empId]: true }));
    rejectDraft(empId, reviewerId, note)
      .then(() => {
        loadDrafts(filter);
        setActionLoading((prev) => ({ ...prev, [empId]: false }));
      })
      .catch((err) => {
        alert(err.response?.data?.detail || 'Rejection failed');
        setActionLoading((prev) => ({ ...prev, [empId]: false }));
      });
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1> Retention Action Planner</h1>
          <p>Human-in-the-Loop decision governance for proactive retention interventions.</p>
        </div>
        <a
          href={exportDrafts()}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary btn-sm"
          style={{ textDecoration: 'none' }}
        >
           Export Drafts CSV
        </a>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Plans
        </button>
        <button
          className={`tab-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          ⏳ Pending Review
        </button>
        <button
          className={`tab-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
           Approved
        </button>
        <button
          className={`tab-btn ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
           Rejected
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      ) : error ? (
        <div className="error-box">{error}</div>
      ) : drafts.length === 0 ? (
        <div className="empty-state">
          <div className="icon"></div>
          <p>No retention drafts found in this category.</p>
        </div>
      ) : (
        <div>
          {drafts.map((d) => {
            const empId = d.employee_id;
            const isPending = d.status === 'PENDING_APPROVAL' || d.status === 'pending';
            const inputs = reviewerInputs[empId] || { reviewerId: 'HR_MANAGER_1', note: '' };
            const isBusy = actionLoading[empId];

            return (
              <div key={empId} className="draft-card">
                <div className="draft-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                        EMP-{empId}
                      </h3>
                      <span className={`status-badge status-${(d.status || '').toLowerCase().replace(/_/g, '_')}`}>
                        {d.status?.toUpperCase()}
                      </span>
                      {d.risk_score != null && (
                        <span className="risk-badge risk-high">
                          {(d.risk_score * 100).toFixed(1)}% Risk
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Generated: {d.created_at ? new Date(d.created_at).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="draft-section">
                    <h4>Recommended Retention Actions</h4>
                    <ul>
                      {(d.recommended_actions || []).map((action, i) => (
                        <li key={i}> {action}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="draft-section">
                    <h4>Evidence Signals</h4>
                    <ul>
                      {(d.evidence || []).map((ev, i) => (
                        <li key={i}>
                           <strong>{ev.feature || 'Factor'}</strong>: {String(ev.value ?? '')}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Investment</span>
                    <div style={{ fontWeight: 600, color: '#6ee7b7' }}>{d.estimated_cost || '$1,500 - $3,000'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Intervention Window</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.timeline || 'Within 14 Days'}</div>
                  </div>
                </div>

                {/* Audit details if approved or rejected */}
                {!isPending && (
                  <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <strong>Audit Log:</strong> Reviewed by <code style={{ color: '#a5b4fc' }}>{d.reviewer_id}</code> at {d.reviewed_at ? new Date(d.reviewed_at).toLocaleString() : '—'}
                    </div>
                    {d.notes && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Notes: "{d.notes}"
                      </div>
                    )}
                  </div>
                )}

                {/* Pending action controls */}
                {isPending && (
                  <div className="draft-actions">
                    <div style={{ flex: 1 }}>
                      <label htmlFor={`reviewer-${empId}`}>Reviewer Badge / ID</label>
                      <input
                        id={`reviewer-${empId}`}
                        type="text"
                        placeholder="HR Reviewer ID"
                        value={inputs.reviewerId}
                        onChange={(e) => handleInputChange(empId, 'reviewerId', e.target.value)}
                      />
                    </div>
                    <div style={{ flex: 2 }}>
                      <label htmlFor={`notes-${empId}`}>Audit Justification Notes</label>
                      <input
                        id={`notes-${empId}`}
                        type="text"
                        placeholder="Explain approval reason or intervention modifications..."
                        value={inputs.note}
                        onChange={(e) => handleInputChange(empId, 'note', e.target.value)}
                      />
                    </div>
                    <button
                      className="btn btn-success"
                      disabled={isBusy}
                      onClick={() => handleApprove(empId)}
                    >
                      {isBusy ? 'Processing...' : ' Approve'}
                    </button>
                    <button
                      className="btn btn-danger"
                      disabled={isBusy}
                      onClick={() => handleReject(empId)}
                    >
                      {isBusy ? 'Processing...' : ' Reject'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
