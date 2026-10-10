"""Write premium light theme CSS for TalentGuard AI frontend"""
import pathlib

CSS = r"""/* ==============================================================================
   TalentGuard AI – Premium Light Design System
   Unique, industry-grade HR analytics platform styling
   ============================================================================== */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  /* Surfaces */
  --bg-base:        #f4f6f9;
  --bg-surface:     #ffffff;
  --bg-elevated:    #f8fafc;
  --bg-hover:       #f1f5f9;
  --bg-input:       #ffffff;

  /* Borders */
  --border:         #e2e8f0;
  --border-subtle:  #f1f5f9;
  --border-strong:  #cbd5e1;

  /* Accent system */
  --accent:         #2563eb;
  --accent-hover:   #1d4ed8;
  --accent-light:   #eff6ff;
  --accent-border:  #bfdbfe;
  --accent-text:    #1e40af;

  /* Semantic colors */
  --green:          #16a34a;
  --green-light:    #f0fdf4;
  --green-border:   #bbf7d0;
  --red:            #dc2626;
  --red-light:      #fef2f2;
  --red-border:     #fecaca;
  --amber:          #d97706;
  --amber-light:    #fffbeb;
  --amber-border:   #fde68a;
  --violet:         #7c3aed;
  --violet-light:   #f5f3ff;
  --violet-border:  #ddd6fe;
  --cyan:           #0891b2;
  --cyan-light:     #ecfeff;

  /* Text */
  --text-primary:   #0f172a;
  --text-secondary: #475569;
  --text-muted:     #94a3b8;
  --text-accent:    var(--accent);

  /* Typography */
  --font:       'Inter', system-ui, -apple-system, sans-serif;
  --font-mono:  'JetBrains Mono', 'Fira Code', monospace;

  /* Elevation */
  --shadow-xs:  0 1px 2px rgba(15,23,42,0.04);
  --shadow-sm:  0 2px 4px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04);
  --shadow-md:  0 4px 12px rgba(15,23,42,0.08), 0 2px 4px rgba(15,23,42,0.05);
  --shadow-lg:  0 12px 24px rgba(15,23,42,0.10), 0 4px 8px rgba(15,23,42,0.06);

  /* Transitions */
  --t-fast: 0.12s ease;
  --t-med:  0.20s ease;

  /* Radius */
  --r-sm: 6px;
  --r-md: 10px;
  --r-lg: 14px;
}

/* ============================================================ Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font);
  background: var(--bg-base);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 14px;
  line-height: 1.6;
}
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg-base); }
::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

/* ============================================================ Layout */
.app-shell { display: flex; min-height: 100vh; }

/* ============================================================ Sidebar */
.sidebar {
  width: 248px;
  min-height: 100vh;
  background: var(--bg-surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed; left: 0; top: 0; bottom: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.sidebar-logo {
  padding: 20px 18px 18px;
  border-bottom: 1px solid var(--border);
}

.sidebar-logo h1 {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-mark {
  width: 28px; height: 28px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--violet) 100%);
  border-radius: 7px;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 6px rgba(37,99,235,0.30);
}

.logo-mark::after {
  content: '';
  width: 10px; height: 10px;
  border: 2px solid rgba(255,255,255,0.9);
  border-radius: 2px;
  transform: rotate(45deg);
}

.sidebar-logo > span {
  display: block;
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 500;
  margin-top: 4px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding-left: 38px;
}

.sidebar-nav {
  flex: 1;
  padding: 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.nav-section-label {
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 14px 10px 5px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 12px;
  border-radius: var(--r-sm);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.825rem;
  font-weight: 500;
  transition: all var(--t-fast);
  text-decoration: none;
  border: 1px solid transparent;
  position: relative;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0; top: 25%; bottom: 25%;
  width: 3px;
  background: var(--accent);
  border-radius: 0 3px 3px 0;
  opacity: 0;
  transition: opacity var(--t-fast);
}

.nav-item:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border-color: var(--border);
}

.nav-item.active {
  background: var(--accent-light);
  color: var(--accent);
  border-color: var(--accent-border);
  font-weight: 600;
}

.nav-item.active::before { opacity: 1; }

.nav-icon {
  width: 15px; height: 15px;
  flex-shrink: 0;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sidebar-footer {
  padding: 14px 18px;
  border-top: 1px solid var(--border);
  font-size: 0.68rem;
  color: var(--text-muted);
  line-height: 1.6;
  background: var(--bg-elevated);
}

.sidebar-footer strong { color: var(--amber); font-weight: 600; }

/* ============================================================ Main content */
.main-content {
  margin-left: 248px;
  flex: 1;
  padding: 28px 36px;
  min-height: 100vh;
  background: var(--bg-base);
}

.rai-banner {
  background: var(--amber-light);
  border: 1px solid var(--amber-border);
  border-left: 4px solid var(--amber);
  border-radius: var(--r-sm);
  padding: 11px 16px;
  font-size: 0.78rem;
  color: #92400e;
  margin-bottom: 24px;
  line-height: 1.5;
}
.rai-banner strong { color: #78350f; font-weight: 700; }

/* ============================================================ Page header */
.page-header {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
  position: relative;
}

.page-header::after {
  content: '';
  position: absolute;
  bottom: -1px; left: 0;
  width: 52px; height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--violet));
  border-radius: 1px;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.page-header p {
  color: var(--text-secondary);
  margin-top: 5px;
  font-size: 0.875rem;
}

/* ============================================================ Cards */
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 20px 24px;
  box-shadow: var(--shadow-xs);
  transition: border-color var(--t-med), box-shadow var(--t-med), transform var(--t-fast);
}

.card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-sm);
}

.card-accent  { border-left: 4px solid var(--accent); }
.card-danger  { border-left: 4px solid var(--red); }
.card-success { border-left: 4px solid var(--green); }
.card-warning { border-left: 4px solid var(--amber); }
.card-violet  { border-left: 4px solid var(--violet); }

/* ============================================================ Metrics grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(172px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}

.metric-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: transform var(--t-fast), box-shadow var(--t-fast), border-color var(--t-fast);
  cursor: default;
}

/* Gradient accent stripe on hover */
.metric-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), var(--violet));
  opacity: 0;
  transition: opacity var(--t-med);
}

.metric-card::after {
  content: '';
  position: absolute;
  bottom: 0; right: 0;
  width: 60px; height: 60px;
  background: linear-gradient(135deg, transparent 60%, rgba(37,99,235,0.04));
  border-radius: 50% 0 var(--r-md) 0;
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-strong);
}

.metric-card:hover::before { opacity: 1; }

.metric-card .label {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.metric-card .value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-top: 6px;
  letter-spacing: -0.03em;
  line-height: 1;
}

.metric-card .sub {
  font-size: 0.72rem;
  color: var(--text-secondary);
  margin-top: 5px;
}

/* ============================================================ Table */
.table-wrap {
  overflow-x: auto;
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  background: var(--bg-surface);
  box-shadow: var(--shadow-xs);
}

table { width: 100%; border-collapse: collapse; text-align: left; }

thead tr {
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border);
}

th {
  padding: 11px 16px;
  font-size: 0.66rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.09em;
  white-space: nowrap;
}

td {
  padding: 13px 16px;
  font-size: 0.825rem;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: middle;
}

tr:last-child td { border-bottom: none; }

tbody tr { transition: background var(--t-fast); }
tbody tr:hover td { background: var(--bg-elevated); color: var(--text-primary); }

/* ============================================================ Badges */
.risk-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  font-family: var(--font-mono);
}

.risk-high { background: var(--red-light); color: var(--red); border: 1px solid var(--red-border); }
.risk-med  { background: var(--amber-light); color: var(--amber); border: 1px solid var(--amber-border); }
.risk-low  { background: var(--green-light); color: var(--green); border: 1px solid var(--green-border); }

.status-badge {
  padding: 3px 9px;
  border-radius: 4px;
  font-size: 0.66rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.status-badge::before {
  content: '';
  width: 5px; height: 5px;
  border-radius: 50%;
  display: inline-block;
}

.status-pending { background: var(--amber-light); color: #92400e; border: 1px solid var(--amber-border); }
.status-pending::before { background: var(--amber); }
.status-pending_approval { background: var(--amber-light); color: #92400e; border: 1px solid var(--amber-border); }
.status-pending_approval::before { background: var(--amber); }
.status-approved { background: var(--green-light); color: #14532d; border: 1px solid var(--green-border); }
.status-approved::before { background: var(--green); }
.status-rejected { background: var(--red-light); color: #7f1d1d; border: 1px solid var(--red-border); }
.status-rejected::before { background: var(--red); }

/* ============================================================ Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--r-sm);
  border: 1px solid transparent;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--t-fast);
  font-family: var(--font);
  text-decoration: none;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

.btn-primary {
  background: var(--accent);
  color: #ffffff;
  border-color: var(--accent);
  box-shadow: 0 1px 3px rgba(37,99,235,0.25);
}
.btn-primary:hover:not(:disabled) {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(37,99,235,0.30);
}

.btn-success { background: #f0fdf4; color: #166534; border-color: #bbf7d0; }
.btn-success:hover:not(:disabled) { background: #dcfce7; border-color: #86efac; }

.btn-danger { background: #fef2f2; color: #991b1b; border-color: #fecaca; }
.btn-danger:hover:not(:disabled) { background: #fee2e2; border-color: #fca5a5; }

.btn-ghost { background: var(--bg-surface); color: var(--text-secondary); border-color: var(--border); }
.btn-ghost:hover:not(:disabled) { background: var(--bg-elevated); color: var(--text-primary); border-color: var(--border-strong); }

.btn-sm { padding: 5px 12px; font-size: 0.75rem; }

.btn-violet { background: var(--violet-light); color: var(--violet); border-color: var(--violet-border); }
.btn-violet:hover:not(:disabled) { background: #ede9fe; }

/* ============================================================ Forms */
input, select, textarea {
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  color: var(--text-primary);
  padding: 9px 13px;
  font-size: 0.835rem;
  font-family: var(--font);
  width: 100%;
  transition: border-color var(--t-fast), box-shadow var(--t-fast);
  outline: none;
}
input:focus, select:focus, textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
}
input::placeholder, textarea::placeholder { color: var(--text-muted); }
label {
  display: block;
  font-size: 0.68rem;
  color: var(--text-secondary);
  font-weight: 700;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.form-group { margin-bottom: 14px; }

/* ============================================================ Tabs */
.tabs {
  display: flex;
  gap: 3px;
  margin-bottom: 22px;
  background: var(--bg-elevated);
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--border);
  width: fit-content;
}

.tab-btn {
  padding: 7px 18px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--t-fast);
  font-family: var(--font);
}

.tab-btn.active {
  background: var(--bg-surface);
  color: var(--accent);
  border-color: var(--border);
  box-shadow: var(--shadow-xs);
}

.tab-btn:hover:not(.active) { color: var(--text-primary); background: rgba(15,23,42,0.04); }

/* ============================================================ Explanations */
.explanation-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 16px;
  background: var(--bg-elevated);
  border-radius: 8px;
  border: 1px solid var(--border);
  margin-bottom: 10px;
  transition: border-color var(--t-fast), box-shadow var(--t-fast);
}

.explanation-item:hover { border-color: var(--border-strong); box-shadow: var(--shadow-xs); }
.explanation-item .feat-name { font-weight: 700; color: var(--text-primary); font-size: 0.875rem; }
.explanation-item .feat-val { color: var(--text-secondary); font-size: 0.78rem; margin-top: 2px; font-family: var(--font-mono); }
.direction-up   { color: var(--red); font-weight: 700; font-size: 0.78rem; }
.direction-down { color: var(--green); font-weight: 700; font-size: 0.78rem; }
.mag-bar { height: 5px; border-radius: 3px; min-width: 20px; max-width: 110px; margin-top: 4px; margin-left: auto; }

/* ============================================================ Draft cards (Retention Planner) */
.draft-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  margin-bottom: 14px;
  overflow: hidden;
  box-shadow: var(--shadow-xs);
  transition: box-shadow var(--t-fast), border-color var(--t-fast);
}
.draft-card:hover { border-color: var(--border-strong); box-shadow: var(--shadow-sm); }
.draft-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
}
.draft-card-body { padding: 16px 20px; }
.draft-section h4 {
  font-size: 0.66rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.09em;
  font-weight: 700;
  margin-bottom: 9px;
}
.draft-section ul { list-style: none; }
.draft-section ul li {
  padding: 8px 0;
  color: var(--text-secondary);
  font-size: 0.835rem;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.draft-section ul li:last-child { border-bottom: none; }
.draft-section ul li::before {
  content: '\2192';
  color: var(--accent);
  font-size: 0.85rem;
  flex-shrink: 0;
  margin-top: 1px;
}
.draft-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  align-items: flex-end;
  padding-top: 14px;
  border-top: 1px solid var(--border-subtle);
  flex-wrap: wrap;
}

/* ============================================================ Loader & error */
.loading-spinner { display: flex; align-items: center; justify-content: center; height: 220px; }
.spinner {
  width: 38px; height: 38px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error-box {
  background: var(--red-light);
  border: 1px solid var(--red-border);
  border-left: 4px solid var(--red);
  border-radius: var(--r-sm);
  padding: 14px 16px;
  color: #7f1d1d;
  font-size: 0.835rem;
}

.empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
.empty-state .icon { font-size: 2.5rem; margin-bottom: 12px; display: block; opacity: 0.4; }
.empty-state p { font-size: 0.875rem; color: var(--text-secondary); }

/* ============================================================ Grids */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

/* ============================================================ Range slider */
input[type='range'] { -webkit-appearance: none; width: 100%; height: 5px; border-radius: 3px; background: var(--border); border: none; padding: 0; }
input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--accent); cursor: pointer; box-shadow: 0 0 0 2px rgba(37,99,235,0.2), var(--shadow-xs); transition: box-shadow var(--t-fast); }
input[type='range']::-webkit-slider-thumb:hover { box-shadow: 0 0 0 4px rgba(37,99,235,0.18), var(--shadow-sm); }

/* ============================================================ What-If result */
.scenario-result { background: var(--green-light); border: 1px solid var(--green-border); border-left: 4px solid var(--green); border-radius: var(--r-md); padding: 18px 22px; margin-top: 20px; }
.scenario-result.danger { background: var(--red-light); border: 1px solid var(--red-border); border-left: 4px solid var(--red); }
.delta-positive { color: var(--red); font-weight: 800; font-size: 1.6rem; font-family: var(--font-mono); }
.delta-negative { color: var(--green); font-weight: 800; font-size: 1.6rem; font-family: var(--font-mono); }

/* ============================================================ Employee detail layout */
.employee-layout { display: grid; grid-template-columns: 295px 1fr; gap: 20px; }
.emp-sidebar {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
  height: fit-content;
  position: sticky;
  top: 24px;
  box-shadow: var(--shadow-xs);
}
.emp-sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid var(--border-subtle);
  background: linear-gradient(135deg, var(--accent-light) 0%, var(--violet-light) 100%);
  position: relative;
}
.emp-sidebar-header::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), var(--violet));
}
.emp-avatar {
  width: 58px; height: 58px;
  border-radius: 12px;
  background: var(--bg-surface);
  border: 2px solid var(--accent-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 12px;
  box-shadow: var(--shadow-sm);
}
.emp-sidebar-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 16px;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 0.8rem;
}
.emp-sidebar-stat:last-child { border-bottom: none; }
.emp-sidebar-stat span:first-child { color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.07em; font-weight: 700; }
.emp-sidebar-stat span:last-child { font-weight: 700; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.8rem; }
.emp-sidebar-actions { padding: 12px 14px; border-top: 1px solid var(--border-subtle); background: var(--bg-elevated); display: flex; flex-direction: column; gap: 7px; }

/* ============================================================ Feature grid */
.feature-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
.feature-cell { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 8px; padding: 11px 14px; transition: border-color var(--t-fast), box-shadow var(--t-fast); }
.feature-cell:hover { border-color: var(--border-strong); box-shadow: var(--shadow-xs); }
.feature-cell .fc-key { font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
.feature-cell .fc-val { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin-top: 3px; font-family: var(--font-mono); }

/* ============================================================ Info/Grok/Code */
.info-box { background: var(--accent-light); border: 1px solid var(--accent-border); border-left: 4px solid var(--accent); border-radius: var(--r-sm); padding: 12px 16px; font-size: 0.8rem; color: var(--accent-text); line-height: 1.55; }

code { font-family: var(--font-mono); font-size: 0.78rem; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 4px; padding: 1px 5px; color: var(--accent); }
pre { font-family: var(--font-mono); font-size: 0.78rem; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 16px; color: var(--text-secondary); line-height: 1.7; overflow-x: auto; }

.grok-plan-card { background: linear-gradient(135deg, var(--bg-surface) 0%, var(--violet-light) 100%); border: 1px solid var(--violet-border); border-radius: var(--r-md); overflow: hidden; margin-bottom: 20px; box-shadow: var(--shadow-xs); }
.grok-plan-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: rgba(124,58,237,0.06); border-bottom: 1px solid var(--violet-border); }
.grok-plan-body { padding: 18px 20px; }

.chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 600; border: 1px solid var(--border); background: var(--bg-elevated); color: var(--text-secondary); }
.chip-blue { background: var(--accent-light); border-color: var(--accent-border); color: var(--accent-text); }

/* ============================================================ Responsive */
@media (max-width: 1100px) {
  .employee-layout { grid-template-columns: 1fr; }
  .emp-sidebar { position: static; }
  .grid-2 { grid-template-columns: 1fr; }
  .grid-3 { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 900px) {
  .sidebar { width: 62px; }
  .sidebar-logo > span, .sidebar-footer, .nav-section-label { display: none; }
  .nav-item span:not(.nav-icon) { display: none; }
  .nav-item { justify-content: center; padding: 11px; }
  .main-content { margin-left: 62px; padding: 18px 20px; }
  .grid-3 { grid-template-columns: 1fr; }
  .metrics-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
}
"""

pathlib.Path("frontend/src/index.css").write_text(CSS, encoding="utf-8")
print(f"Written {len(CSS)} bytes, {CSS.count(chr(10))} lines")
