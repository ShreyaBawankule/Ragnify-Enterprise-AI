import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '../../components/common/BrandLogo';
import { FaUserGraduate, FaUserTie, FaArrowLeft } from 'react-icons/fa';
import '../../styles/auth.css';

export function NewUserChoice() {
  const navigate = useNavigate();

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="auth-header-block">
          <div className="auth-brand-badge">
            <BrandLogo to="/" />
          </div>
          <h1 className="auth-title">Join RAGNIFY</h1>
          <p className="auth-subtitle">
            How would you like to join your organization?
          </p>
        </div>

        <div className="auth-choice-grid">
          <div
            className="auth-choice-card"
            onClick={() => navigate('/apply/intern')}
            tabIndex={0}
            role="button"
          >
            <div className="choice-icon-circle">
              <FaUserGraduate />
            </div>
            <div>
              <div className="choice-title">Apply as Intern</div>
              <div className="choice-desc">Submit your internship application and documents for HR review</div>
            </div>
          </div>

          <div
            className="auth-choice-card"
            onClick={() => navigate('/register/employee')}
            tabIndex={0}
            role="button"
          >
            <div className="choice-icon-circle">
              <FaUserTie />
            </div>
            <div>
              <div className="choice-title">Register as Employee</div>
              <div className="choice-desc">Submit new employee onboarding credentials and history</div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
            style={{ width: '100%' }}
          >
            <FaArrowLeft size={12} /> Back to Welcome
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewUserChoice;
