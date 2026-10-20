import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FaBars, FaSearch, FaBell, FaMoon, FaSun, FaTimes, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export function Topbar({ onToggleSidebar, title }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const roleLower = user?.role?.toLowerCase() || 'employee';
  const isIntern = roleLower === 'intern';

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const targetPath = isIntern
      ? `/intern/ai-assistant?q=${encodeURIComponent(searchQuery)}`
      : `/${roleLower}/rag-assistant?q=${encodeURIComponent(searchQuery)}`;
    navigate(targetPath);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="topbar-container">
      <div className="topbar-left">
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation"
        >
          <FaBars size={15} />
        </button>
        {title && <span className="topbar-page-title">{title}</span>}
      </div>

      <div className="topbar-right">
        {/* Quick Search */}
        <button
          className="topbar-search-trigger"
          onClick={() => setSearchOpen(true)}
          title="Global SaaS Search (Ctrl+K)"
        >
          <FaSearch size={12} />
          <span>Search policies, tasks...</span>
          <span className="topbar-kbd">⌘K</span>
        </button>

        {/* Theme Toggle */}
        <button
          className="btn-icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <FaMoon size={14} /> : <FaSun size={14} />}
        </button>

        {/* Notifications */}
        <div className="notification-btn-wrapper">
          <button
            className="btn-icon"
            onClick={() => navigate(`/${roleLower}/notifications`)}
            title="Notifications"
          >
            <FaBell size={14} />
            <span className="notification-badge-dot" />
          </button>
        </div>

        {/* User Identity & Role Clearance Pill */}
        <span
          className="role-badge-pill"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          title={`Logged in as ${user?.name || 'User'} (${user?.role || 'Role'} Clearance • Privacy Isolated)`}
        >
          <FaShieldAlt size={10} />
          {user?.name ? `${user.name.split(' ')[0]} • ` : ''}{user?.role || 'Guest'}
        </span>
      </div>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="modal-overlay" onClick={() => setSearchOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '540px' }} onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-default)', gap: '12px' }}>
                <FaSearch style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search authorized policies, tasks, or ask AI..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.95rem',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)'
                  }}
                />
                <button type="button" onClick={() => setSearchOpen(false)} style={{ color: 'var(--text-muted)' }}>
                  <FaTimes size={14} />
                </button>
              </div>
              <div style={{ padding: '16px 20px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <div style={{ fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', fontSize: '0.6875rem', letterSpacing: '0.05em' }}>Quick SaaS Shortcuts</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {!isIntern && (
                    <button type="button" onClick={() => { navigate(`/${roleLower}/rag-assistant`); setSearchOpen(false); }} className="btn-action" style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
                      📖 Query Company Knowledge Vault (RAG)
                    </button>
                  )}
                  <button type="button" onClick={() => { navigate(`/${roleLower}/ai-assistant`); setSearchOpen(false); }} className="btn-action" style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
                    🤖 Launch Enterprise AI Copilot ({user?.role})
                  </button>
                  {!isIntern && (
                    <button type="button" onClick={() => { navigate(`/${roleLower}/meeting-summary`); setSearchOpen(false); }} className="btn-action" style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
                      🎙️ Summarize Meeting Audio
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

export default Topbar;
