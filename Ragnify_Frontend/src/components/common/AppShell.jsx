import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import '../../styles/layout.css';
import '../../styles/sidebar.css';
import '../../styles/topbar.css';

export function AppShell({ title, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setMobileOpen(prev => !prev);
    } else {
      setCollapsed(prev => !prev);
    }
  };

  return (
    <div className="app-shell">
      {/* Mobile Drawer Backdrop */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? 'active' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Viewport */}
      <div className={`main-viewport ${collapsed ? 'collapsed' : ''}`}>
        <Topbar onToggleSidebar={handleToggleSidebar} title={title} />
        <main className="page-content-area">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
