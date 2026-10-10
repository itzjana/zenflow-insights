import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Overview from './pages/Overview';
import EDA from './pages/EDA';
import Watchlist from './pages/Watchlist';
import EmployeeDetail from './pages/EmployeeDetail';
import RetentionPlanner from './pages/RetentionPlanner';
import WhatIf from './pages/WhatIf';
import ModelEvaluation from './pages/ModelEvaluation';
import ResponsibleAI from './pages/ResponsibleAI';
import EarlyWarning from './pages/EarlyWarning';
import './index.css';

/* ── Inline SVG icon components ── */
const Icon = ({ d, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="nav-icon">
    <path d={d} />
  </svg>
);

const ICONS = {
  home:       'M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z M9 21V12h6v9',
  chart:      'M3 3v18h18 M7 16l4-4 4 4 4-4',
  list:       'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  user:       'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
  target:     'M12 22a10 10 0 100-20 10 10 0 000 20z M12 18a6 6 0 100-12 6 6 0 000 12z M12 14a2 2 0 100-4 2 2 0 000 4z',
  flask:      'M9 3h6m-5 0v5l-3.5 7.5A4 4 0 009 21h6a4 4 0 001.5-5.5L13 8V3',
  trend:      'M22 12h-4l-3 9L9 3l-3 9H2',
  shield:     'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  radar:      'M12 2a10 10 0 110 20A10 10 0 0112 2z M12 6v6l4 2',
};

const NAV_ITEMS = [
  { path: '/',             icon: 'home',   label: 'Overview',          section: 'Platform' },
  { path: '/watchlist',    icon: 'list',   label: 'Watch List',        section: null },
  { path: '/employee',     icon: 'user',   label: 'Employee Detail',   section: null },
  { path: '/retention',    icon: 'target', label: 'Retention Planner', section: null },
  { path: '/whatif',       icon: 'flask',  label: 'What-If Simulator', section: 'Analytics' },
  { path: '/eda',          icon: 'chart',  label: 'Data Explorer',     section: null },
  { path: '/evaluation',   icon: 'trend',  label: 'Model Evaluation',  section: null },
  { path: '/earlywarning', icon: 'radar',  label: 'Early Warning',     section: null },
  { path: '/responsible',  icon: 'shield', label: 'Responsible AI',    section: 'Governance' },
];

function Sidebar() {
  let lastSection = null;
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>
          <div className="logo-mark" />
          TalentGuard AI
        </h1>
        <span>HR Decision Intelligence</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ path, icon, label, section }) => {
          const showSection = section && section !== lastSection;
          if (section) lastSection = section;
          return (
            <React.Fragment key={path}>
              {showSection && (
                <div className="nav-section-label">{section}</div>
              )}
              <NavLink
                to={path}
                end={path === '/'}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <Icon d={ICONS[icon]} />
                <span>{label}</span>
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <strong>Decision support only.</strong> Not a resignation detector.
        No automated employment decisions.
      </div>
    </aside>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <main className="main-content">
          <div className="rai-banner">
            <strong>TalentGuard AI is decision support, not a resignation detector.</strong>{' '}
            Scores are probabilistic estimates. All retention drafts require human review and approval before any action.
          </div>
          <Routes>
            <Route path="/"             element={<Overview />} />
            <Route path="/eda"          element={<EDA />} />
            <Route path="/watchlist"    element={<Watchlist />} />
            <Route path="/employee"     element={<EmployeeDetail />} />
            <Route path="/employee/:id" element={<EmployeeDetail />} />
            <Route path="/retention"    element={<RetentionPlanner />} />
            <Route path="/whatif"       element={<WhatIf />} />
            <Route path="/evaluation"   element={<ModelEvaluation />} />
            <Route path="/responsible"  element={<ResponsibleAI />} />
            <Route path="/earlywarning" element={<EarlyWarning />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
