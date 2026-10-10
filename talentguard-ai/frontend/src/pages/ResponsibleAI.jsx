import React from 'react';

export default function ResponsibleAI() {
  return (
    <div>
      <div className="page-header">
        <h1> Responsible AI, Fairness &amp; Governance</h1>
        <p>Operational safeguards, compliance framework, and algorithmic risk mitigation policies.</p>
      </div>

      <div className="rai-banner" style={{ marginBottom: '24px' }}>
         <strong>Regulatory Notice:</strong> TalentGuard AI conforms with the <strong>EU AI Act (Annex III - High-Risk Employment Systems)</strong> and <strong>EEOC Title VII Uniform Guidelines</strong> by enforcing strict human-oversight barriers, explainable scoring, and prohibited automated action triggers.
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Core Safeguards */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', color: '#a5b4fc' }}>
             Non-Negotiable Operating Principles
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#6ee7b7', marginBottom: '4px' }}>
                1. Decision Support, Never Automated Action
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                The model outputs a risk ranking, not a definitive verdict. Predictions must only be used to initiate supportive career conversations and resource allocation. Automated terminations, negative reviews, or compensation freezes based on risk scores are strictly prohibited.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#6ee7b7', marginBottom: '4px' }}>
                2. Mandatory Human-in-the-Loop (Four-Eyes Principle)
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Retention drafts are automatically tagged with <code style={{ color: '#fcd34d' }}>status: pending</code>. Every intervention proposal requires named human reviewer approval and justification before any operational intervention occurs.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#6ee7b7', marginBottom: '4px' }}>
                3. Local Interpretability &amp; No Black-Box Rationale
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Every flagged individual is accompanied by verifiable SHAP feature attributions so HR business partners understand the underlying signals without guessing.
              </p>
            </div>
          </div>
        </div>

        {/* Fairness Analysis */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', color: '#a5b4fc' }}>
             Demographic Parity &amp; Bias Auditing
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <p>
              To guard against disparate impact across protected groups (EEOC 80% four-fifths rule), TalentGuard actively audits disparate false positive rates:
            </p>

            <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
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

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              <em>Note: Young tenure is correlated with higher baseline market mobility in tech/biotech. Interventions must focus on career mentorship, not adverse screening.</em>
            </p>
          </div>
        </div>
      </div>

      {/* Dataset & Limitations */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '10px' }}>
           Critical Dataset &amp; Methodology Limitations
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>Cross-Sectional vs Temporal:</strong>
            <p style={{ marginTop: '4px', lineHeight: 1.5 }}>
              The standard IBM HR benchmark dataset contains a single historical cross-sectional snapshot without timestamps. Time-to-event survival models and longitudinal early-warning trajectories are simulated demonstrations.
            </p>
          </div>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>Correlation vs Causality:</strong>
            <p style={{ marginTop: '4px', lineHeight: 1.5 }}>
              Statistical associations (e.g. OverTime = Yes) do not prove singular causation. Counterfactual simulator forecasts assume conditional feature independence that must be confirmed by human context.
            </p>
          </div>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>Audit Trail &amp; Logging:</strong>
            <p style={{ marginTop: '4px', lineHeight: 1.5 }}>
              All approval events, reviewer user IDs, timestamps, and justification notes are logged permanently to <code style={{ color: '#a5b4fc' }}>retention_drafts.json</code> for independent HR governance audits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
