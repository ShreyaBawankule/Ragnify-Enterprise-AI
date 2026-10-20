import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../data/mockAuth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ragnify_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password, roleHint) => {
    setLoading(true);
    try {
      // Find matching user from mock dataset or default by role
      let matchedUser = DEMO_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!matchedUser && roleHint) {
        matchedUser = DEMO_USERS.find(
          u => u.role.toLowerCase() === roleHint.toLowerCase()
        );
      }

      if (!matchedUser) {
        // Fallback default user with email and specified/derived role
        const derivedRole = roleHint || 'Employee';
        matchedUser = {
          email,
          name: email.split('@')[0],
          role: derivedRole,
          department: 'General',
          designation: `${derivedRole} Member`,
          token: `mock-token-${Date.now()}`
        };
      }

      setUser(matchedUser);
      localStorage.setItem('ragnify_user', JSON.stringify(matchedUser));
      localStorage.setItem('token', matchedUser.token);
      return matchedUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ragnify_user');
    localStorage.removeItem('token');
  };

  const getDashboardPath = (role) => {
    switch (role?.toUpperCase()) {
      case 'HR':
        return '/hr/dashboard';
      case 'MANAGER':
        return '/manager/dashboard';
      case 'EMPLOYEE':
        return '/employee/dashboard';
      case 'INTERN':
        return '/intern/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, getDashboardPath, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
