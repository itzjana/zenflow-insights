import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
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

const NAV_ITEMS = [
  { path: '/',            icon: '', label: 'Overview' },
  { path: '/eda',         icon: '', label: 'EDA' },
  { path: '/watchlist',   icon: '', label: 'Watch List' },
  { path: '/employee',    icon: '', label: 'Employee Detail' },
  { path: '/retention',   icon: '', label: 'Retention Planner' },
  { path: '/whatif',      icon: '', label: 'What-If Simulator' },
  { path: '/evaluation',  icon: '', label: 'Model Evaluation' },
  { path: '/responsible', icon: '', label: 'Responsible AI' },
  { path: '/earlywarning',icon: '', label: 'Early Warning' },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1> TalentGuard AI</h1>
        <span>HR Attrition Risk · Decision Support</span>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
         <strong>Decision support only.</strong> Not a resignation detector.
        Must not drive automated employment decisions.
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
            Scores are probabilistic estimates. All drafts require human review and approval.
          </div>
          <Routes>
            <Route path="/"            element={<Overview />} />
            <Route path="/eda"         element={<EDA />} />
            <Route path="/watchlist"   element={<Watchlist />} />
            <Route path="/employee"    element={<EmployeeDetail />} />
            <Route path="/employee/:id" element={<EmployeeDetail />} />
            <Route path="/retention"   element={<RetentionPlanner />} />
            <Route path="/whatif"      element={<WhatIf />} />
            <Route path="/evaluation"  element={<ModelEvaluation />} />
            <Route path="/responsible" element={<ResponsibleAI />} />
            <Route path="/earlywarning" element={<EarlyWarning />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
