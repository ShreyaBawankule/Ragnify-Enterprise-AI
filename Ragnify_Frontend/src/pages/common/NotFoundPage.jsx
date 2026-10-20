import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--brand-primary)', marginBottom: '8px' }}>404</h1>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Page Not Found</h2>
        <p className="text-sm" style={{ marginBottom: '20px' }}>The requested resource does not exist or has been relocated.</p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex' }}>Return to Workspace</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
