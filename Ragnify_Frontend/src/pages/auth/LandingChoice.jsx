import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '../../components/common/BrandLogo';
import { FaSignInAlt, FaUserPlus, FaShieldAlt } from 'react-icons/fa';
import '../../styles/auth.css';

export function LandingChoice() {
  const navigate = useNavigate();

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="auth-header-block">
          <div className="auth-brand-badge">
            <BrandLogo to="/" />
          </div>
          <h1 className="auth-title">Welcome to RAGNIFY</h1>
          <p className="auth-subtitle">
            Enterprise AI Workspace & Workforce Intelligence Platform
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
            Are you already a RAGNIFY user?
          </span>
        </div>

        <div className="auth-choice-grid">
          <div
            className="auth-choice-card"
            onClick={() => navigate('/login')}
            tabIndex={0}
            role="button"
          >
            <div className="choice-icon-circle">
              <FaSignInAlt />
            </div>
            <div>
              <div className="choice-title">Existing User</div>
              <div className="choice-desc">Sign in to your organization workspace</div>
            </div>
          </div>

          <div
            className="auth-choice-card"
            onClick={() => navigate('/new-user')}
            tabIndex={0}
            role="button"
          >
            <div className="choice-icon-circle">
              <FaUserPlus />
            </div>
            <div>
              <div className="choice-title">New User</div>
              <div className="choice-desc">Apply as an intern or register employee record</div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '12px 14px',
          backgroundColor: 'var(--bg-surface-subtle)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)'
        }}>
          <FaShieldAlt style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
          <span>Secured enterprise authentication with role-based access control.</span>
        </div>
      </div>
    </div>
  );
}

export default LandingChoice;
