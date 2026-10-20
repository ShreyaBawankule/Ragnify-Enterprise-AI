import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import {
  FaChartPie,
  FaUsers,
  FaUserTie,
  FaUserGraduate,
  FaTasks,
  FaFileAlt,
  FaFileSignature,
  FaAward,
  FaClock,
  FaRobot,
  FaBookOpen,
  FaMicrophoneAlt,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaCheckCircle,
  FaClipboardList,
  FaBriefcase,
  FaUser,
  FaIdCard
} from 'react-icons/fa';

export function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavSections = () => {
    const role = user?.role?.toUpperCase();

    switch (role) {
      case 'HR':
        return [
          {
            title: 'Overview',
            items: [
              { label: 'Dashboard', path: '/hr/dashboard', icon: <FaChartPie /> }
            ]
          },
          {
            title: 'People',
            items: [
              { label: 'Employees & Interns', path: '/hr/people', icon: <FaUsers /> },
              { label: 'Applications', path: '/hr/applications', icon: <FaClipboardList /> }
            ]
          },
          {
            title: 'Documents',
            items: [
              { label: 'Documents', path: '/hr/documents', icon: <FaFileAlt /> },
              { label: 'Offer Letters', path: '/hr/offer-letters', icon: <FaFileSignature /> },
              { label: 'Certificates', path: '/hr/certificates', icon: <FaAward /> }
            ]
          },
          {
            title: 'Workforce',
            items: [
              { label: 'Tenure Tracking', path: '/hr/tenure', icon: <FaClock /> },
              { label: 'Working Hours', path: '/hr/working-hours', icon: <FaBriefcase /> }
            ]
          },
          {
            title: 'AI & Productivity',
            items: [
              { label: 'RAG Assistant', path: '/hr/rag-assistant', icon: <FaBookOpen /> },
              { label: 'AI Assistant', path: '/hr/ai-assistant', icon: <FaRobot /> },
              { label: 'Meeting Summary', path: '/hr/meeting-summary', icon: <FaMicrophoneAlt /> }
            ]
          },
          {
            title: 'System',
            items: [
              { label: 'Notifications', path: '/hr/notifications', icon: <FaBell /> },
              { label: 'Settings', path: '/hr/settings', icon: <FaCog /> }
            ]
          }
        ];

      case 'MANAGER':
        return [
          {
            title: 'Overview',
            items: [
              { label: 'Dashboard', path: '/manager/dashboard', icon: <FaChartPie /> },
              { label: 'My Team', path: '/manager/team', icon: <FaUsers /> }
            ]
          },
          {
            title: 'Work',
            items: [
              { label: 'Tasks', path: '/manager/tasks', icon: <FaTasks /> },
              { label: 'Reports', path: '/manager/reports', icon: <FaFileAlt /> }
            ]
          },
          {
            title: 'Onboarding',
            items: [
              { label: 'My Employees', path: '/manager/employees', icon: <FaUserTie /> },
              { label: 'My Interns', path: '/manager/interns', icon: <FaUserGraduate /> },
              { label: 'Onboarding Progress', path: '/manager/onboarding-progress', icon: <FaCheckCircle /> },
              { label: 'Pending Reviews', path: '/manager/reviews', icon: <FaClipboardList /> }
            ]
          },
          {
            title: 'AI & Productivity',
            items: [
              { label: 'RAG Assistant', path: '/manager/rag-assistant', icon: <FaBookOpen /> },
              { label: 'AI Assistant', path: '/manager/ai-assistant', icon: <FaRobot /> },
              { label: 'Meeting Summary', path: '/manager/meeting-summary', icon: <FaMicrophoneAlt /> }
            ]
          },
          {
            title: 'System',
            items: [
              { label: 'Notifications', path: '/manager/notifications', icon: <FaBell /> },
              { label: 'Settings', path: '/manager/settings', icon: <FaCog /> }
            ]
          }
        ];

      case 'EMPLOYEE':
        return [
          {
            title: 'Overview',
            items: [
              { label: 'My Dashboard', path: '/employee/dashboard', icon: <FaChartPie /> },
              { label: 'My Tasks', path: '/employee/tasks', icon: <FaTasks /> }
            ]
          },
          {
            title: 'My HR',
            items: [
              { label: 'My Profile', path: '/employee/profile', icon: <FaUser /> },
              { label: 'Employment Details', path: '/employee/employment', icon: <FaIdCard /> },
              { label: 'Working Time', path: '/employee/working-time', icon: <FaClock /> }
            ]
          },
          {
            title: 'AI & Productivity',
            items: [
              { label: 'RAG Assistant', path: '/employee/rag-assistant', icon: <FaBookOpen /> },
              { label: 'AI Assistant', path: '/employee/ai-assistant', icon: <FaRobot /> },
              { label: 'Meeting Summary', path: '/employee/meeting-summary', icon: <FaMicrophoneAlt /> }
            ]
          },
          {
            title: 'System',
            items: [
              { label: 'Notifications', path: '/employee/notifications', icon: <FaBell /> },
              { label: 'Settings', path: '/employee/settings', icon: <FaCog /> }
            ]
          }
        ];

      case 'INTERN':
        return [
          {
            title: 'Overview',
            items: [
              { label: 'Dashboard', path: '/intern/dashboard', icon: <FaChartPie /> }
            ]
          },
          {
            title: 'My Internship',
            items: [
              { label: 'My Internship', path: '/intern/internship', icon: <FaUserGraduate /> },
              { label: 'My Documents', path: '/intern/documents', icon: <FaFileAlt /> },
              { label: 'Working Time', path: '/intern/working-time', icon: <FaClock /> },
              { label: 'My Certificate', path: '/intern/certificate', icon: <FaAward /> },
              { label: 'My Profile', path: '/intern/profile', icon: <FaUser /> }
            ]
          },
          {
            title: 'AI & Productivity',
            items: [
              { label: 'AI Assistant', path: '/intern/ai-assistant', icon: <FaRobot /> }
            ]
          },
          {
            title: 'System',
            items: [
              { label: 'Notifications', path: '/intern/notifications', icon: <FaBell /> },
              { label: 'Settings', path: '/intern/settings', icon: <FaCog /> }
            ]
          }
        ];

      case 'ADMIN':
      default:
        return [
          {
            title: 'Overview',
            items: [
              { label: 'Dashboard', path: '/admin/dashboard', icon: <FaChartPie /> }
            ]
          },
          {
            title: 'Management',
            items: [
              { label: 'Employees', path: '/admin/employees', icon: <FaUsers /> },
              { label: 'Tasks', path: '/admin/tasks', icon: <FaTasks /> },
              { label: 'Reports', path: '/admin/reports', icon: <FaFileAlt /> }
            ]
          },
          {
            title: 'AI & Productivity',
            items: [
              { label: 'RAG Assistant', path: '/admin/rag-assistant', icon: <FaBookOpen /> },
              { label: 'AI Assistant', path: '/admin/ai-assistant', icon: <FaRobot /> },
              { label: 'Meeting Summary', path: '/admin/meeting-summary', icon: <FaMicrophoneAlt /> }
            ]
          },
          {
            title: 'System',
            items: [
              { label: 'Notifications', path: '/admin/notifications', icon: <FaBell /> },
              { label: 'Settings', path: '/admin/settings', icon: <FaCog /> }
            ]
          }
        ];
    }
  };

  const sections = getNavSections();
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'RG';

  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <BrandLogo collapsed={collapsed} to={`/${user?.role?.toLowerCase() || 'employee'}/dashboard`} />
      </div>

      {/* Nav Content */}
      <div className="sidebar-nav-container">
        {sections.map((sec, idx) => (
          <div key={idx} className="nav-section">
            <div className="nav-section-title">{sec.title}</div>
            {sec.items.map((item, i) => (
              <NavLink
                key={i}
                to={item.path}
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                onClick={onCloseMobile}
                title={item.label}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span className="nav-item-text">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Sidebar Footer User Profile */}
      <div className="sidebar-footer">
        <div className="user-profile-chip">
          <div className="user-avatar-circle">{initials}</div>
          {!collapsed && (
            <div className="user-info-text">
              <div className="user-display-name">{user?.name || 'User'}</div>
              <div className="user-role-tag">{user?.role || 'Guest'}</div>
            </div>
          )}
        </div>

        <div className="sidebar-actions-row">
          <NavLink
            to={`/${user?.role?.toLowerCase() || 'employee'}/settings`}
            className="sidebar-action-btn"
            title="Settings"
            onClick={onCloseMobile}
          >
            <FaCog size={13} />
            <span>Settings</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="sidebar-action-btn logout"
            title="Sign Out"
          >
            <FaSignOutAlt size={13} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
