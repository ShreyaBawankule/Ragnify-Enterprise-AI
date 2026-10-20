/* ============================================================
   RAGNIFY DEMO & MOCK AUTH DATA
   Explicit synthetic users for local testing
============================================================ */

export const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+1-CA', country: 'Canada', flag: '🇨🇦' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' }
];

export const DEMO_USERS = [
  {
    email: 'hr@ragnify.com',
    password: 'password123',
    name: 'Priya Sharma',
    role: 'HR',
    phone: '8767920649',
    department: 'People Operations',
    designation: 'Head of People Operations',
    token: 'mock-jwt-hr-token-8812'
  },
  {
    email: 'manager@ragnify.com',
    password: 'password123',
    name: 'Vikram Mehta',
    role: 'Manager',
    phone: '9812345678',
    department: 'Engineering',
    designation: 'Engineering Manager',
    token: 'mock-jwt-manager-token-9943'
  },
  {
    email: 'employee@ragnify.com',
    password: 'password123',
    name: 'Rahul Verma',
    role: 'Employee',
    phone: '9765432109',
    department: 'AI & Data Science',
    designation: 'Senior ML Engineer',
    token: 'mock-jwt-employee-token-3312'
  },
  {
    email: 'intern@ragnify.com',
    password: 'password123',
    name: 'Ananya Roy',
    role: 'Intern',
    phone: '9654321098',
    department: 'Frontend Engineering',
    designation: 'Frontend Development Intern',
    manager: 'Vikram Mehta',
    token: 'mock-jwt-intern-token-7721'
  },
  {
    email: 'admin@ragnify.com',
    password: 'password123',
    name: 'System Admin',
    role: 'Admin',
    phone: '9988776655',
    department: 'IT & Infrastructure',
    designation: 'Platform Administrator',
    token: 'mock-jwt-admin-token-1100'
  }
];

export const ROLE_PHONE_DIRECTORY = {
  HR: '8767920649',
  MANAGER: '9812345678',
  EMPLOYEE: '9765432109',
  INTERN: '9654321098',
  ADMIN: '9988776655'
};

export const getRoleRegisteredPhone = (role) => {
  const normalized = (role || 'HR').toUpperCase();
  try {
    const savedOverrides = JSON.parse(localStorage.getItem('ragnify_registered_phones') || '{}');
    if (savedOverrides[normalized]) {
      return savedOverrides[normalized];
    }
  } catch (e) {
    // fallback
  }
  return ROLE_PHONE_DIRECTORY[normalized] || (normalized === 'HR' ? '8767920649' : '9876543210');
};

export const getRolePhoneDetails = (role) => {
  const normalized = (role || 'HR').toUpperCase();
  try {
    const savedOverrides = JSON.parse(localStorage.getItem('ragnify_registered_phones') || '{}');
    const phone = savedOverrides[normalized] || ROLE_PHONE_DIRECTORY[normalized] || (normalized === 'HR' ? '8767920649' : '9876543210');
    const country = savedOverrides[`${normalized}_COUNTRY`] || '+91';
    return { phone, country };
  } catch (e) {
    return { phone: ROLE_PHONE_DIRECTORY[normalized] || '8767920649', country: '+91' };
  }
};

export const updateRoleRegisteredPhone = (role, newPhone, countryCode = '+91') => {
  const normalized = (role || 'HR').toUpperCase();
  const cleanNumber = (newPhone || '').replace(/\D/g, '');
  try {
    const savedOverrides = JSON.parse(localStorage.getItem('ragnify_registered_phones') || '{}');
    savedOverrides[normalized] = cleanNumber;
    savedOverrides[`${normalized}_COUNTRY`] = countryCode;
    localStorage.setItem('ragnify_registered_phones', JSON.stringify(savedOverrides));

    // Also update active session user if currently logged in as this role
    const sessionUserStr = localStorage.getItem('ragnify_user');
    if (sessionUserStr) {
      const sessionUser = JSON.parse(sessionUserStr);
      if (sessionUser.role?.toUpperCase() === normalized) {
        sessionUser.phone = cleanNumber;
        sessionUser.countryCode = countryCode;
        localStorage.setItem('ragnify_user', JSON.stringify(sessionUser));
      }
    }
  } catch (e) {
    console.error('Error saving role phone:', e);
  }
};
