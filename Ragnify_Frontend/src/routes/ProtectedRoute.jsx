import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role?.toUpperCase();
    const hasRole = allowedRoles.some(r => r.toUpperCase() === userRole);

    if (!hasRole) {
      // Redirect to the user's authorized role dashboard
      switch (userRole) {
        case 'HR':
          return <Navigate to="/hr/dashboard" replace />;
        case 'MANAGER':
          return <Navigate to="/manager/dashboard" replace />;
        case 'EMPLOYEE':
          return <Navigate to="/employee/dashboard" replace />;
        case 'INTERN':
          return <Navigate to="/intern/dashboard" replace />;
        case 'ADMIN':
          return <Navigate to="/admin/dashboard" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    }
  }

  return children;
}

export default ProtectedRoute;
