import React from 'react';

const Principle = ({ number, title, children }) => (
  <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 12 }}>
    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-light)',
        border: '1px solid var(--accent-border)', color: 'var(--accent)', fontFamily: 'var(--font-mono)',
        fontWeight: 800, fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>{number}</span>
      {title}
    </h4>
    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{children}</p>
  </div>
);

export default function ResponsibleAI() {
  return (
    <div>
      <div className="page-header">
        <h1>Responsible AI, Fairness &amp; Governance</h1>
        <p>Operational safeguards, compliance framework, and algorithmic risk mitigation policies.</p>
      </div>

      <div className="rai-banner" style={{ marginBottom: 24 }}>
        <strong>Regulatory Notice:</strong> TalentGuard AI conforms with the <strong>EU AI Act (Annex III — High-Risk Employment Systems)</strong> and <strong>EEOC Title VII Uniform Guidelines</strong> by enforcing strict human-oversight barriers, explainable scoring, and prohibited automated action triggers.
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Core Safeguards */}
        <div className="card card-accent">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
            Non-Negotiable Operating Principles
          </h3>

          <Principle number="1" title="Decision Support — Never Automated Action">
            The model outputs a risk ranking, not a definitive verdict. Predictions must only be used to initiate supportive career conversations. Automated terminations, negative reviews, or compensation freezes based on risk scores are strictly prohibited.
          </Principle>

          <Principle number="2" title="Mandatory Human-in-the-Loop (Four-Eyes Principle)">
            Retention drafts are automatically tagged with <code>status: PENDING_APPROVAL</code>. Every intervention proposal requires named human reviewer approval and justification before any operational action occurs.
          </Principle>

          <Principle number="3" title="Local Interpretability — No Black-Box Rationale">
            Every flagged individual is accompanied by verifiable SHAP feature attributions so HR business partners understand the underlying signals without guessing.
          </Principle>

          <Principle number="4" title="Protected Attribute Exclusion">
            Gender, Age, Race, Religion, and MaritalStatus are excluded from scoring computations. Any What-If simulation that attempts to modify protected attributes is rejected at the API level with a 400 error.
          </Principle>
        </div>

        {/* Fairness Analysis */}
        <div className="card card-success">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
            Demographic Parity &amp; Bias Auditing
          </h3>

          <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.55 }}>
            To guard against disparate impact (EEOC 80% four-fifths rule), TalentGuard actively audits disparate false positive rates:
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Subgroup Cohort</th>
                  <th>Representation</th>
                  <th>Avg Risk Score</th>
                  <th>Parity Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Female Employees</td>
                  <td>40.0%</td>
                  <td>15.8%</td>
                  <td><span className="risk-badge risk-low">In Tolerance</span></td>
                </tr>
                <tr>
                  <td>Male Employees</td>
                  <td>60.0%</td>
                  <td>16.3%</td>
                  <td><span className="risk-badge risk-low">In Tolerance</span></td>
                </tr>
                <tr>
                  <td>Age &lt; 30</td>
                  <td>22.5%</td>
                  <td>24.2%</td>
                  <td><span className="risk-badge risk-med">Monitored</span></td>
                </tr>
                <tr>
                  <td>Age &ge; 40</td>
                  <td>42.8%</td>
                  <td>11.4%</td>
                  <td><span className="risk-badge risk-low">In Tolerance</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 10, fontStyle: 'italic', lineHeight: 1.5 }}>
            Note: Young tenure is correlated with higher baseline market mobility. Interventions must focus on career mentorship, not adverse screening.
          </p>
        </div>
      </div>

      {/* Dataset & Limitations */}
      <div className="card card-warning">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14, color: 'var(--text-primary)' }}>
          Critical Dataset &amp; Methodology Limitations
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
          <div>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Cross-Sectional vs Temporal:</strong>
            <p style={{ lineHeight: 1.6 }}>The standard IBM HR benchmark dataset contains a single historical cross-sectional snapshot without timestamps. Time-to-event survival models and longitudinal early-warning trajectories are simulated demonstrations.</p>
          </div>
          <div>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Correlation vs Causality:</strong>
            <p style={{ lineHeight: 1.6 }}>Statistical associations (e.g. OverTime = Yes) do not prove singular causation. Counterfactual simulator forecasts assume conditional feature independence that must be confirmed by human context.</p>
          </div>
          <div>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Audit Trail &amp; Logging:</strong>
            <p style={{ lineHeight: 1.6 }}>All approval events, reviewer IDs, timestamps, and justification notes are logged permanently to <code>audit_log.json</code> for independent HR governance audits.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
