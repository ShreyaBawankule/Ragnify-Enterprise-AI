import React, { useState } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import {
  FaUser,
  FaPalette,
  FaBell,
  FaShieldAlt,
  FaSave,
  FaMobileAlt,
  FaCheckCircle,
  FaLock
} from 'react-icons/fa';
import {
  COUNTRY_CODES,
  getRolePhoneDetails,
  updateRoleRegisteredPhone
} from '../../data/mockAuth';

export function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  const userRole = user?.role || 'Employee';
  const initialPhoneDetails = getRolePhoneDetails(userRole);

  const [currentPhone, setCurrentPhone] = useState(initialPhoneDetails.phone);
  const [currentCountry, setCurrentCountry] = useState(initialPhoneDetails.country);

  const [newPhone, setNewPhone] = useState(initialPhoneDetails.phone);
  const [newCountry, setNewCountry] = useState(initialPhoneDetails.country);
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    designation: user?.designation || '',
    emailNotifications: true,
    taskAlerts: true
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Profile preferences updated successfully.', 'success');
  };

  const handleUpdateMobile = (e) => {
    e.preventDefault();
    const cleanDigits = (newPhone || '').replace(/\D/g, '');
    if (!cleanDigits || cleanDigits.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }

    setIsUpdatingPhone(true);
    try {
      updateRoleRegisteredPhone(userRole, cleanDigits, newCountry);
      setCurrentPhone(cleanDigits);
      setCurrentCountry(newCountry);
      showToast(
        `Mobile number for ${userRole} updated to ${newCountry} ${cleanDigits}! All future 2FA OTP codes will be sent here.`,
        'success'
      );
    } catch (err) {
      showToast('Failed to update mobile number.', 'error');
    } finally {
      setIsUpdatingPhone(false);
    }
  };

  return (
    <MainLayout title="Settings">
      <div className="fade-in">
        <PageHeader
          title="Account Settings"
          subtitle="Manage your personal profile, notification preferences, and workspace security"
        />

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px' }}>
          {/* Settings Nav Tabs */}
          <div className="card" style={{ padding: '12px', height: 'fit-content' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                className={`btn-action ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
                style={{
                  justifyContent: 'flex-start',
                  backgroundColor: activeTab === 'profile' ? 'var(--bg-surface-active)' : 'transparent',
                  color: activeTab === 'profile' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  borderColor: activeTab === 'profile' ? 'var(--brand-primary-border)' : 'transparent'
                }}
              >
                <FaUser size={13} /> Profile Info
              </button>

              <button
                className={`btn-action ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
                style={{
                  justifyContent: 'flex-start',
                  backgroundColor: activeTab === 'security' ? 'var(--bg-surface-active)' : 'transparent',
                  color: activeTab === 'security' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  borderColor: activeTab === 'security' ? 'var(--brand-primary-border)' : 'transparent'
                }}
              >
                <FaShieldAlt size={13} /> Security & Mobile OTP
              </button>

              <button
                className={`btn-action ${activeTab === 'appearance' ? 'active' : ''}`}
                onClick={() => setActiveTab('appearance')}
                style={{
                  justifyContent: 'flex-start',
                  backgroundColor: activeTab === 'appearance' ? 'var(--bg-surface-active)' : 'transparent',
                  color: activeTab === 'appearance' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  borderColor: activeTab === 'appearance' ? 'var(--brand-primary-border)' : 'transparent'
                }}
              >
                <FaPalette size={13} /> Appearance
              </button>

              <button
                className={`btn-action ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
                style={{
                  justifyContent: 'flex-start',
                  backgroundColor: activeTab === 'notifications' ? 'var(--bg-surface-active)' : 'transparent',
                  color: activeTab === 'notifications' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  borderColor: activeTab === 'notifications' ? 'var(--brand-primary-border)' : 'transparent'
                }}
              >
                <FaBell size={13} /> Notifications
              </button>
            </div>
          </div>

          {/* Tab Content Panel */}
          <div className="card">
            {/* TAB 1: PROFILE INFO */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="fade-in">
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>Profile Information</h3>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      disabled
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role / Designation</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ maxWidth: '400px' }}>
                  <label className="form-label">2FA Registered Mobile Number</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={`${currentCountry} ${currentPhone}`}
                      disabled
                      style={{ backgroundColor: 'var(--bg-surface-subtle)', fontWeight: '600' }}
                    />
                    <button
                      type="button"
                      onClick={() => setActiveTab('security')}
                      className="btn-secondary"
                      style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                    >
                      Change in Security
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '12px' }}>
                  <FaSave size={13} /> Save Profile Changes
                </button>
              </form>
            )}

            {/* TAB 2: SECURITY & 2FA MOBILE UPDATE */}
            {activeTab === 'security' && (
              <div className="fade-in">
                {/* 2FA Mobile Number Management Card */}
                <div style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  marginBottom: '28px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--brand-primary)'
                      }}>
                        <FaMobileAlt size={18} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                          Registered Mobile Number (for Login OTP)
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          This mobile number receives the 6-digit SMS verification code during login
                        </span>
                      </div>
                    </div>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '0.6875rem',
                      fontWeight: '700',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      color: '#10b981'
                    }}>
                      <FaCheckCircle size={10} /> 2FA Active
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-default)',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>
                        Active Registered Phone for {userRole}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px', letterSpacing: '0.5px' }}>
                        {currentCountry} {currentPhone}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Role: <strong>{userRole}</strong>
                    </span>
                  </div>

                  {/* Form to Change Mobile Number */}
                  <form onSubmit={handleUpdateMobile}>
                    <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8125rem' }}>
                      Change Registered Mobile Number
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {/* Country Code Dropdown */}
                      <select
                        value={newCountry}
                        onChange={(e) => setNewCountry(e.target.value)}
                        className="form-input"
                        style={{
                          width: '180px',
                          padding: '9px 12px',
                          fontSize: '0.8125rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.country} ({c.code})
                          </option>
                        ))}
                      </select>

                      {/* 10-Digit Mobile Input */}
                      <div style={{ flex: 1, minWidth: '180px' }}>
                        <input
                          type="tel"
                          className="form-input"
                          maxLength={10}
                          placeholder="Enter 10-digit mobile number"
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={isUpdatingPhone || newPhone.length !== 10}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '9px 18px',
                          fontSize: '0.8125rem',
                          fontWeight: '700',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <FaSave size={12} /> {isUpdatingPhone ? 'Saving...' : 'Update Mobile Number'}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '8px', marginBottom: 0 }}>
                      Once saved, your mobile number is updated across the platform. Next time you log in as {userRole}, the 2FA SMS code will be delivered to this exact number.
                    </p>
                  </form>
                </div>

                {/* Password Credentials */}
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>Password & Credentials</h3>
                <div className="form-group" style={{ maxWidth: '400px' }}>
                  <label className="form-label">Current Password</label>
                  <input type="password" placeholder="••••••••" className="form-input" />
                </div>
                <div className="form-group" style={{ maxWidth: '400px' }}>
                  <label className="form-label">New Password</label>
                  <input type="password" placeholder="••••••••" className="form-input" />
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Password updated successfully.', 'success')}
                  className="btn-primary"
                  style={{ marginTop: '10px' }}
                >
                  Update Password
                </button>
              </div>
            )}

            {/* TAB 3: APPEARANCE */}
            {activeTab === 'appearance' && (
              <div className="fade-in">
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '8px' }}>Interface Theme</h3>
                <p className="text-sm" style={{ marginBottom: '20px' }}>Select your preferred interface display mode.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '400px' }}>
                  <div
                    onClick={() => theme !== 'light' && toggleTheme()}
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      border: `2px solid ${theme === 'light' ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: '700', color: '#0F172A', marginBottom: '4px' }}>Light SaaS</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Clean high-contrast</div>
                  </div>

                  <div
                    onClick={() => theme !== 'dark' && toggleTheme()}
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      border: `2px solid ${theme === 'dark' ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                      backgroundColor: '#0F172A',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: '700', color: '#F8FAFC', marginBottom: '4px' }}>Slate Dark</div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Low-light friendly</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="fade-in">
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>Notification Alerts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.emailNotifications}
                      onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                      style={{ accentColor: 'var(--brand-primary)' }}
                    />
                    <span>Email alerts for task assignments & review requests</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.taskAlerts}
                      onChange={(e) => setFormData({ ...formData, taskAlerts: e.target.checked })}
                      style={{ accentColor: 'var(--brand-primary)' }}
                    />
                    <span>Browser desktop notifications for deadline reminders</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default SettingsPage;
