import React from 'react';
import { Link } from 'react-router-dom';

export function BrandLogo({ collapsed = false, to = '/' }) {
  return (
    <Link to={to} className="brand-link">
      <div className="brand-logo-icon">
        <span>R</span>
      </div>
      {!collapsed && (
        <div className="brand-text-block">
          <span className="brand-title">RAGNIFY</span>
          <span className="brand-subtitle">Enterprise AI</span>
        </div>
      )}
    </Link>
  );
}

export function PageHeader({ title, subtitle, actions, children }) {
  return (
    <div className="page-header-row fade-in">
      <div>
        <h1 className="page-main-heading">{title}</h1>
        {subtitle && <p className="page-subheading">{subtitle}</p>}
      </div>
      {(actions || children) && (
        <div className="page-header-actions">
          {actions}
          {children}
        </div>
      )}
    </div>
  );
}
