import React from 'react';

export function StatCard({ title, value, icon, change, subtitle, trend = 'neutral' }) {
  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '18px 20px',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
          {title}
        </span>
        {icon && (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-surface-subtle)',
            color: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px'
          }}>
            {icon}
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
          {value}
        </div>
        {(change || subtitle) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem' }}>
            {change && (
              <span style={{
                fontWeight: '700',
                color: change.startsWith('↑') || change.startsWith('+') ? 'var(--status-success)' :
                       change.startsWith('↓') || change.startsWith('-') ? 'var(--status-danger)' : 'var(--brand-primary)'
              }}>
                {change}
              </span>
            )}
            {subtitle && (
              <span style={{ color: 'var(--text-muted)' }}>
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  if (!status) return null;
  const normalized = String(status).toLowerCase().replace(/[\s-]/g, '_');

  return (
    <span className={`badge badge-${normalized}`}>
      <span className="badge-dot" />
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function EmptyState({ title = 'No records found', message = 'Items will appear here once added or submitted.', icon, action }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '48px 20px',
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px'
    }}>
      {icon && (
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-surface-subtle)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          {icon}
        </div>
      )}
      <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: 0 }}>{message}</p>
      {action && <div style={{ marginTop: '8px' }}>{action}</div>}
    </div>
  );
}

export function LoadingSkeleton({ rows = 5 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '48px',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: '6px',
            animation: 'pulse 1.5s infinite ease-in-out'
          }}
        />
      ))}
    </div>
  );
}
