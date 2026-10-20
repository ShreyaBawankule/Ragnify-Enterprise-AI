import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BrandLogo } from '../../components/common/BrandLogo';
import {
  DEMO_USERS,
  COUNTRY_CODES,
  getRoleRegisteredPhone,
  getRolePhoneDetails,
  updateRoleRegisteredPhone,
  ROLE_PHONE_DIRECTORY
} from '../../data/mockAuth';
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaArrowLeft,
  FaCheckCircle,
  FaShieldAlt,
  FaMobileAlt,
  FaRedo,
  FaCog,
  FaTimes,
  FaCheck,
  FaExclamationTriangle
} from 'react-icons/fa';
import '../../styles/auth.css';

export function Login() {
  // Authentication Step: 'CREDENTIALS' | '2FA_OTP'
  const [authStep, setAuthStep] = useState('CREDENTIALS');

  // Step 1: Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRoleHint, setSelectedRoleHint] = useState('HR');

  // Helper to normalize phone number string into clean 10 digits
  const normalizeDigits = (val) => {
    const digits = (val || '').replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length === 12) {
      return digits.slice(2);
    }
    return digits;
  };

  // Step 2: 2FA Mobile Number & OTP Verification - automatically pre-filled with registered phone
  const [selectedCountry, setSelectedCountry] = useState('+91');
  const [enteredMobile, setEnteredMobile] = useState(() => {
    return normalizeDigits(getRoleRegisteredPhone('HR'));
  });
  const [otpDispatched, setOtpDispatched] = useState(false);
  const [smsStatus, setSmsStatus] = useState(null); // 'LIVE_DISPATCHED' | 'KEY_REQUIRED' | 'BACKEND_OFFLINE'
  const [sessionOtp, setSessionOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Modal to customize/configure real registered phone numbers for roles
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configRolePhones, setConfigRolePhones] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ragnify_registered_phones') || '{}');
      return {
        HR: saved.HR || ROLE_PHONE_DIRECTORY.HR,
        MANAGER: saved.MANAGER || ROLE_PHONE_DIRECTORY.MANAGER,
        EMPLOYEE: saved.EMPLOYEE || ROLE_PHONE_DIRECTORY.EMPLOYEE,
        INTERN: saved.INTERN || ROLE_PHONE_DIRECTORY.INTERN,
        ADMIN: saved.ADMIN || ROLE_PHONE_DIRECTORY.ADMIN
      };
    } catch (e) {
      return { ...ROLE_PHONE_DIRECTORY };
    }
  });

  const { login, getDashboardPath, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Keep registered mobile number automatically populated for the active role / email
  useEffect(() => {
    let detected = selectedRoleHint || 'HR';
    const emailLower = (email || '').toLowerCase();
    if (emailLower.includes('hr')) detected = 'HR';
    else if (emailLower.includes('manager')) detected = 'Manager';
    else if (emailLower.includes('employee')) detected = 'Employee';
    else if (emailLower.includes('intern')) detected = 'Intern';
    else if (emailLower.includes('admin')) detected = 'Admin';

    const regPhone = normalizeDigits(getRoleRegisteredPhone(detected));
    setEnteredMobile(regPhone);

    const phoneDetails = getRolePhoneDetails(detected);
    if (phoneDetails?.country) {
      setSelectedCountry(phoneDetails.country);
    }
  }, [selectedRoleHint, email, authStep]);

  // 30-Second Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (authStep === '2FA_OTP' && otpDispatched && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [authStep, otpDispatched, countdown]);

  // Save customized role mobile numbers from config modal
  const handleSaveRolePhones = (e) => {
    e.preventDefault();
    Object.keys(configRolePhones).forEach((roleKey) => {
      updateRoleRegisteredPhone(roleKey, configRolePhones[roleKey], '+91');
    });
    const updatedPhone = normalizeDigits(getRoleRegisteredPhone(selectedRoleHint));
    setEnteredMobile(updatedPhone);
    showToast('Role registered mobile numbers saved successfully!', 'success');
    setShowConfigModal(false);
  };

  // Step 1: Validate Email & Password, advance to 2FA Mobile Verification
  const handleCredentialSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter your work email and password.', 'error');
      return;
    }

    // Determine target role from hint or email
    const emailLower = email.toLowerCase();
    let detectedRole = selectedRoleHint || 'HR';
    if (emailLower.includes('hr')) detectedRole = 'HR';
    else if (emailLower.includes('manager')) detectedRole = 'Manager';
    else if (emailLower.includes('employee')) detectedRole = 'Employee';
    else if (emailLower.includes('intern')) detectedRole = 'Intern';
    else if (emailLower.includes('admin')) detectedRole = 'Admin';

    setSelectedRoleHint(detectedRole);
    const phoneDetails = getRolePhoneDetails(detectedRole);
    setSelectedCountry(phoneDetails.country || '+91');

    // Auto-populate the registered mobile number
    const regPhone = normalizeDigits(getRoleRegisteredPhone(detectedRole));
    setEnteredMobile(regPhone);
    setOtpDispatched(false);
    setEnteredOtp('');
    setSessionOtp('');
    setAuthStep('2FA_OTP');
  };

  // Step 2 (Part A): User clicks "Send OTP" -> Auto-populates/verifies registered mobile -> Dispatches OTP & displays on-screen
  const handleSendMobileOtp = async () => {
    let cleanEntered = normalizeDigits(enteredMobile);
    if (!cleanEntered) {
      cleanEntered = normalizeDigits(getRoleRegisteredPhone(selectedRoleHint));
      setEnteredMobile(cleanEntered);
    }

    if (!cleanEntered || cleanEntered.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }

    // Check against the registered mobile number for this role
    const registeredNumber = normalizeDigits(getRoleRegisteredPhone(selectedRoleHint));

    if (cleanEntered !== registeredNumber) {
      showToast(
        `Access Denied: Mobile number does not match the registered phone for ${selectedRoleHint}. Please enter ${selectedRoleHint}'s registered mobile.`,
        'error'
      );
      return;
    }

    setIsSendingOtp(true);
    try {
      let codeToUse = Math.floor(100000 + Math.random() * 900000).toString();

      // Attempt to dispatch via backend Fast2SMS / WhatsApp endpoint if backend is active
      try {
        const resp = await fetch('http://localhost:8000/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            phone: cleanEntered,
            role_hint: selectedRoleHint
          })
        });
        const data = await resp.json();
        if (resp.ok && data.otp) {
          codeToUse = data.otp;
        }
      } catch (backendErr) {
        console.warn('Backend send-otp fallback:', backendErr);
      }

      setSessionOtp(codeToUse);
      setOtpDispatched(true);
      setCountdown(30);
      setEnteredOtp('');
      showToast(
        `OTP Code: ${codeToUse} generated! Enter this code below to log in.`,
        'success'
      );
    } catch (err) {
      showToast('Failed to dispatch OTP. Please check your mobile number and retry.', 'error');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 2 (Part B): User enters the OTP received on their phone -> Validate & Login
  const handleVerifyOtpAndLogin = async (e) => {
    e.preventDefault();

    if (!enteredOtp || enteredOtp.trim().length !== 6) {
      showToast('Please enter the 6-digit OTP received on your mobile.', 'error');
      return;
    }

    if (enteredOtp.trim() !== sessionOtp.trim()) {
      showToast('Invalid OTP. Please check the SMS on your mobile phone and try again.', 'error');
      return;
    }

    setIsVerifying(true);
    try {
      const authUser = await login(email, password, selectedRoleHint);
      showToast(`Mobile Verified! Welcome to RAGNIFY, ${authUser.name}!`, 'success');
      const targetPath = getDashboardPath(authUser.role);
      navigate(targetPath);
    } catch (err) {
      showToast('Authentication failed. Please verify credentials.', 'error');
      setAuthStep('CREDENTIALS');
    } finally {
      setIsVerifying(false);
    }
  };

  // Instant Fill for Demo Accounts
  const handleDemoFill = (role, demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setSelectedRoleHint(role);
    const regPhone = normalizeDigits(getRoleRegisteredPhone(role));
    setEnteredMobile(regPhone);
    const phoneDetails = getRolePhoneDetails(role);
    if (phoneDetails?.country) setSelectedCountry(phoneDetails.country);
    showToast(`Loaded ${role} credentials (${role} Mobile: ${regPhone})`, 'info');
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-header-block">
          <div className="auth-brand-badge">
            <BrandLogo to="/" />
          </div>
          <h1 className="auth-title">
            {authStep === 'CREDENTIALS' ? 'Sign In' : 'Mobile OTP Verification'}
          </h1>
          <p className="auth-subtitle">
            {authStep === 'CREDENTIALS'
              ? 'Enter your credentials to access the RAGNIFY workspace'
              : `Step 2: Enter registered mobile number for ${selectedRoleHint} to receive your OTP`}
          </p>
        </div>

        {/* STEP 1: CREDENTIALS (EMAIL + PASSWORD) */}
        {authStep === 'CREDENTIALS' && (
          <>
            <form onSubmit={handleCredentialSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Work Email <span className="required">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">
                    Password <span className="required">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('Password reset link sent to registered email.', 'info')}
                    style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: '600' }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: '40px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: 'var(--brand-primary)' }}
                  />
                  Remember me
                </label>
                <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                  <FaShieldAlt size={11} /> Mobile OTP Required
                </span>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', height: '42px', fontSize: '0.9rem' }}
              >
                Verify with Mobile OTP →
              </button>
            </form>

            {/* Demo Roles for Test-Drive */}
            <div className="demo-role-section">
              <div className="demo-role-title">Demo Role Accounts (Instant Fill)</div>
              <div className="demo-role-pills">
                <button
                  type="button"
                  className="demo-role-btn"
                  onClick={() => handleDemoFill('HR', 'hr@ragnify.com')}
                >
                  HR
                </button>
                <button
                  type="button"
                  className="demo-role-btn"
                  onClick={() => handleDemoFill('Manager', 'manager@ragnify.com')}
                >
                  Manager
                </button>
                <button
                  type="button"
                  className="demo-role-btn"
                  onClick={() => handleDemoFill('Employee', 'employee@ragnify.com')}
                >
                  Employee
                </button>
                <button
                  type="button"
                  className="demo-role-btn"
                  onClick={() => handleDemoFill('Intern', 'intern@ragnify.com')}
                >
                  Intern
                </button>
                <button
                  type="button"
                  className="demo-role-btn"
                  onClick={() => handleDemoFill('Admin', 'admin@ragnify.com')}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Link to Configure Role Mobile Numbers */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <FaCog size={11} /> Configure Role Registered Mobile Numbers
              </button>
            </div>
          </>
        )}

        {/* STEP 2: 2FA MOBILE NUMBER & OTP VERIFICATION */}
        {authStep === '2FA_OTP' && (
          <div className="fade-in">
            {/* Identity Banner */}
            <div style={{
              backgroundColor: 'var(--bg-surface-subtle)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {email}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  Mobile Number Verification
                </div>
              </div>
              <span style={{
                fontSize: '0.6875rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--brand-primary)',
                textTransform: 'uppercase'
              }}>
                {selectedRoleHint}
              </span>
            </div>

            {/* Input 1: Enter Mobile Number with Country Code Selector */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Registered Mobile of {selectedRoleHint} <span className="required">*</span></span>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FaCheckCircle size={10} /> Auto-Filled
                </span>
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {/* Country Code Selector */}
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={otpDispatched}
                  className="form-input"
                  style={{
                    width: '120px',
                    padding: '8px',
                    fontSize: '0.8125rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>

                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={enteredMobile}
                    onChange={(e) => setEnteredMobile(e.target.value.replace(/\D/g, ''))}
                    disabled={otpDispatched}
                    style={{ fontWeight: '700', letterSpacing: '1px' }}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleSendMobileOtp}
                  disabled={isSendingOtp || enteredMobile.length !== 10 || (otpDispatched && countdown > 0)}
                  style={{
                    padding: '0 18px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    height: '42px',
                    cursor: (isSendingOtp || enteredMobile.length !== 10 || (otpDispatched && countdown > 0)) ? 'not-allowed' : 'pointer'
                  }}
                >
                  <FaMobileAlt size={13} />
                  {isSendingOtp ? 'Sending...' : otpDispatched ? (countdown > 0 ? `Resend (${countdown}s)` : 'Resend OTP') : 'Send OTP'}
                </button>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                ✓ Registered mobile is auto-filled. Simply click <strong>"Send OTP"</strong> to generate your verification code.
              </div>
            </div>

            {/* LIVE OTP CODE APPEARANCE CARD - ALWAYS CLEARLY DISPLAYED UPON SEND OTP */}
            {otpDispatched && sessionOtp && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
                border: '1.5px solid var(--brand-primary)',
                borderRadius: '8px',
                padding: '14px 16px',
                marginBottom: '18px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-primary)', fontWeight: '800', fontSize: '0.85rem' }}>
                    <FaShieldAlt size={14} />
                    <span>Your Verification OTP:</span>
                  </div>
                  <span style={{ fontSize: '0.6875rem', padding: '2px 8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: '4px', fontWeight: '700' }}>
                    ✓ Ready to Enter
                  </span>
                </div>

                <div style={{
                  padding: '12px 14px',
                  background: 'var(--bg-surface)',
                  border: '1px dashed var(--brand-primary)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      Mobile: {selectedCountry} {enteredMobile} ({selectedRoleHint})
                    </div>
                    <div style={{
                      fontSize: '1.75rem',
                      fontWeight: '900',
                      letterSpacing: '6px',
                      color: 'var(--brand-primary)',
                      fontFamily: 'monospace',
                      marginTop: '2px'
                    }}>
                      {sessionOtp}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEnteredOtp(sessionOtp);
                      showToast('OTP auto-filled! Click "Verify OTP & Log In"', 'success');
                    }}
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      backgroundColor: 'var(--brand-primary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    title="1-Click Auto-Fill this OTP into the input below"
                  >
                    <FaCheck size={11} /> 1-Click Auto-Fill
                  </button>
                </div>

                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaCheckCircle color="#10b981" size={12} />
                  <span>Enter the 6-digit OTP above into the box below and click <strong>Verify OTP & Log In</strong>.</span>
                </div>
              </div>
            )}

            {/* Input 2: Enter 6-Digit OTP */}
            {otpDispatched && (
              <form onSubmit={handleVerifyOtpAndLogin}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Enter 6-Digit OTP From Above <span className="required">*</span></span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>6 digits</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    maxLength={6}
                    placeholder="••••••"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    style={{
                      textAlign: 'center',
                      fontSize: '1.45rem',
                      letterSpacing: '8px',
                      fontWeight: '800',
                      padding: '10px'
                    }}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isVerifying || enteredOtp.length !== 6}
                  style={{ width: '100%', height: '44px', fontSize: '0.9rem', marginBottom: '10px' }}
                >
                  {isVerifying ? 'Verifying...' : 'Verify OTP & Log In →'}
                </button>
              </form>
            )}

            {/* Back to Credentials */}
            <button
              type="button"
              onClick={() => {
                setAuthStep('CREDENTIALS');
                setOtpDispatched(false);
                setEnteredOtp('');
              }}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                marginTop: '6px'
              }}
            >
              <FaArrowLeft size={10} /> Back to Email & Password
            </button>
          </div>
        )}

        {/* Footer Navigation */}
        <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.8125rem' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <FaArrowLeft size={10} /> Back to Welcome
          </Link>
          <span style={{ color: 'var(--border-default)' }}>|</span>
          <Link to="/new-user" style={{ color: 'var(--brand-primary)', fontWeight: '600' }}>
            New User? Apply here
          </Link>
        </div>
      </div>

      {/* MODAL: Configure Role Registered Mobile Numbers */}
      {showConfigModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: '480px', padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                  Set Registered Role Mobile Numbers
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  Configure your actual phone numbers so OTP is delivered to your real device
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <FaTimes size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveRolePhones}>
              {['HR', 'MANAGER', 'EMPLOYEE', 'INTERN', 'ADMIN'].map((r) => (
                <div key={r} className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: '700' }}>
                    {r} Registered Mobile Number
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 10px',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-default)',
                      fontSize: '0.8125rem',
                      fontWeight: '700',
                      color: 'var(--text-secondary)'
                    }}>
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder={`10-digit mobile number for ${r}`}
                      maxLength={10}
                      value={configRolePhones[r] || ''}
                      onChange={(e) =>
                        setConfigRolePhones((prev) => ({
                          ...prev,
                          [r]: e.target.value.replace(/\D/g, '')
                        }))
                      }
                      required
                    />
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowConfigModal(false)}
                  style={{ flex: 1, padding: '9px 0', fontSize: '0.8125rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '9px 0', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <FaCheck size={12} /> Save Mobile Numbers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
