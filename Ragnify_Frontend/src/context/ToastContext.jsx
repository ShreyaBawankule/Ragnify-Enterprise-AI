import React, { createContext, useContext, useState, useCallback } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type} fade-in`}
            style={{
              pointerEvents: 'auto',
              minWidth: '280px',
              maxWidth: '420px',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.875rem'
            }}
          >
            {toast.type === 'success' && <FaCheckCircle style={{ color: 'var(--status-success)', flexShrink: 0 }} />}
            {toast.type === 'error' && <FaExclamationCircle style={{ color: 'var(--status-danger)', flexShrink: 0 }} />}
            {toast.type === 'info' && <FaInfoCircle style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <FaTimes size={12} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
