import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Public & Auth Pages
import LandingChoice from '../pages/auth/LandingChoice';
import Login from '../pages/auth/Login';
import NewUserChoice from '../pages/auth/NewUserChoice';
import InternApplication from '../pages/auth/InternApplication';
import EmployeeRegistration from '../pages/auth/EmployeeRegistration';

// HR Pages
import HRDashboard from '../pages/hr/HRDashboard';
import HREmployeesInterns from '../pages/hr/HREmployeesInterns';
import HRApplications from '../pages/hr/HRApplications';
import HRDocuments from '../pages/hr/HRDocuments';
import HROfferLetters from '../pages/hr/HROfferLetters';
import HRCertificates from '../pages/hr/HRCertificates';
import HRTenureTracking from '../pages/hr/HRTenureTracking';
import HRWorkingHours from '../pages/hr/HRWorkingHours';

// Manager Pages
import ManagerDashboard from '../pages/manager/ManagerDashboard';
import ManagerMyTeam from '../pages/manager/ManagerMyTeam';
import ManagerTasks from '../pages/manager/ManagerTasks';
import ManagerReports from '../pages/manager/ManagerReports';
import ManagerMyEmployees from '../pages/manager/ManagerMyEmployees';
import ManagerMyInterns from '../pages/manager/ManagerMyInterns';
import ManagerOnboardingProgress from '../pages/manager/ManagerOnboardingProgress';
import ManagerPendingReviews from '../pages/manager/ManagerPendingReviews';

// Employee Pages
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import EmployeeMyTasks from '../pages/employee/EmployeeMyTasks';
import EmployeeProfile from '../pages/employee/EmployeeProfile';
import EmployeeEmployment from '../pages/employee/EmployeeEmployment';
import EmployeeOnboarding from '../pages/employee/EmployeeOnboarding';
import EmployeeDocuments from '../pages/employee/EmployeeDocuments';
import EmployeeOfferLetter from '../pages/employee/EmployeeOfferLetter';
import EmployeeTenure from '../pages/employee/EmployeeTenure';
import EmployeeCertificate from '../pages/employee/EmployeeCertificate';
import EmployeeWorkingTime from '../pages/employee/EmployeeWorkingTime';

// Intern Pages
import InternDashboard from '../pages/intern/InternDashboard';
import InternMyInternship from '../pages/intern/InternMyInternship';
import InternDocuments from '../pages/intern/InternDocuments';
import InternWorkingTime from '../pages/intern/InternWorkingTime';
import InternCertificate from '../pages/intern/InternCertificate';
import InternProfile from '../pages/intern/InternProfile';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminEmployees from '../pages/admin/AdminEmployees';
import AdminTasks from '../pages/admin/AdminTasks';
import AdminReports from '../pages/admin/AdminReports';

// AI Pages
import RAGAssistantPage from '../pages/ai/RAGAssistantPage';
import AIAssistantPage from '../pages/ai/AIAssistantPage';
import MeetingSummaryPage from '../pages/ai/MeetingSummaryPage';

// Common Pages
import SettingsPage from '../pages/common/SettingsPage';
import NotificationsPage from '../pages/common/NotificationsPage';
import NotFoundPage from '../pages/common/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingChoice />} />
      <Route path="/login" element={<Login />} />
      <Route path="/existing-user" element={<Navigate to="/login" replace />} />
      <Route path="/new-user" element={<NewUserChoice />} />
      <Route path="/apply/intern" element={<InternApplication />} />
      <Route path="/register/employee" element={<EmployeeRegistration />} />

      {/* HR Routes */}
      <Route path="/hr/dashboard" element={<ProtectedRoute allowedRoles={['HR', 'Admin']}><HRDashboard /></ProtectedRoute>} />
      <Route path="/hr/people" element={<ProtectedRoute allowedRoles={['HR', 'Admin']}><HREmployeesInterns /></ProtectedRoute>} />
      <Route path="/hr/applications" element={<ProtectedRoute allowedRoles={['HR', 'Admin']}><HRApplications /></ProtectedRoute>} />
      <Route path="/hr/documents" element={<ProtectedRoute allowedRoles={['HR', 'Admin']}><HRDocuments /></ProtectedRoute>} />
      <Route path="/hr/offer-letters" element={<ProtectedRoute allowedRoles={['HR', 'Admin']}><HROfferLetters /></ProtectedRoute>} />
      <Route path="/hr/certificates" element={<ProtectedRoute allowedRoles={['HR', 'Admin']}><HRCertificates /></ProtectedRoute>} />
      <Route path="/hr/tenure" element={<ProtectedRoute allowedRoles={['HR', 'Admin']}><HRTenureTracking /></ProtectedRoute>} />
      <Route path="/hr/working-hours" element={<ProtectedRoute allowedRoles={['HR', 'Admin']}><HRWorkingHours /></ProtectedRoute>} />
      <Route path="/hr/rag-assistant" element={<ProtectedRoute allowedRoles={['HR', 'Admin']}><RAGAssistantPage /></ProtectedRoute>} />
      <Route path="/hr/ai-assistant" element={<ProtectedRoute allowedRoles={['HR', 'Admin']}><AIAssistantPage /></ProtectedRoute>} />
      <Route path="/hr/meeting-summary" element={<ProtectedRoute allowedRoles={['HR', 'Admin']}><MeetingSummaryPage /></ProtectedRoute>} />
      <Route path="/hr/settings" element={<ProtectedRoute allowedRoles={['HR', 'Admin']}><SettingsPage /></ProtectedRoute>} />
      <Route path="/hr/notifications" element={<ProtectedRoute allowedRoles={['HR', 'Admin']}><NotificationsPage /></ProtectedRoute>} />

      {/* Manager Routes */}
      <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={['Manager', 'Admin']}><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/manager/team" element={<ProtectedRoute allowedRoles={['Manager', 'Admin']}><ManagerMyTeam /></ProtectedRoute>} />
      <Route path="/manager/tasks" element={<ProtectedRoute allowedRoles={['Manager', 'Admin']}><ManagerTasks /></ProtectedRoute>} />
      <Route path="/manager/reports" element={<ProtectedRoute allowedRoles={['Manager', 'Admin']}><ManagerReports /></ProtectedRoute>} />
      <Route path="/manager/employees" element={<ProtectedRoute allowedRoles={['Manager', 'Admin']}><ManagerMyEmployees /></ProtectedRoute>} />
      <Route path="/manager/interns" element={<ProtectedRoute allowedRoles={['Manager', 'Admin']}><ManagerMyInterns /></ProtectedRoute>} />
      <Route path="/manager/onboarding-progress" element={<ProtectedRoute allowedRoles={['Manager', 'Admin']}><ManagerOnboardingProgress /></ProtectedRoute>} />
      <Route path="/manager/reviews" element={<ProtectedRoute allowedRoles={['Manager', 'Admin']}><ManagerPendingReviews /></ProtectedRoute>} />
      <Route path="/manager/rag-assistant" element={<ProtectedRoute allowedRoles={['Manager', 'Admin']}><RAGAssistantPage /></ProtectedRoute>} />
      <Route path="/manager/ai-assistant" element={<ProtectedRoute allowedRoles={['Manager', 'Admin']}><AIAssistantPage /></ProtectedRoute>} />
      <Route path="/manager/meeting-summary" element={<ProtectedRoute allowedRoles={['Manager', 'Admin']}><MeetingSummaryPage /></ProtectedRoute>} />
      <Route path="/manager/settings" element={<ProtectedRoute allowedRoles={['Manager', 'Admin']}><SettingsPage /></ProtectedRoute>} />
      <Route path="/manager/notifications" element={<ProtectedRoute allowedRoles={['Manager', 'Admin']}><NotificationsPage /></ProtectedRoute>} />

      {/* Employee Routes */}
      <Route path="/employee/dashboard" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="/employee/tasks" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><EmployeeMyTasks /></ProtectedRoute>} />
      <Route path="/employee/profile" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><EmployeeProfile /></ProtectedRoute>} />
      <Route path="/employee/employment" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><EmployeeEmployment /></ProtectedRoute>} />
      <Route path="/employee/onboarding" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><EmployeeOnboarding /></ProtectedRoute>} />
      <Route path="/employee/documents" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><EmployeeDocuments /></ProtectedRoute>} />
      <Route path="/employee/offer-letter" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><EmployeeOfferLetter /></ProtectedRoute>} />
      <Route path="/employee/tenure" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><EmployeeTenure /></ProtectedRoute>} />
      <Route path="/employee/working-time" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><EmployeeWorkingTime /></ProtectedRoute>} />
      <Route path="/employee/certificate" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><EmployeeCertificate /></ProtectedRoute>} />
      <Route path="/employee/rag-assistant" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><RAGAssistantPage /></ProtectedRoute>} />
      <Route path="/employee/ai-assistant" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><AIAssistantPage /></ProtectedRoute>} />
      <Route path="/employee/meeting-summary" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><MeetingSummaryPage /></ProtectedRoute>} />
      <Route path="/employee/settings" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><SettingsPage /></ProtectedRoute>} />
      <Route path="/employee/notifications" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><NotificationsPage /></ProtectedRoute>} />

      {/* Intern Routes */}
      <Route path="/intern/dashboard" element={<ProtectedRoute allowedRoles={['Intern', 'Admin']}><InternDashboard /></ProtectedRoute>} />
      <Route path="/intern/internship" element={<ProtectedRoute allowedRoles={['Intern', 'Admin']}><InternMyInternship /></ProtectedRoute>} />
      <Route path="/intern/documents" element={<ProtectedRoute allowedRoles={['Intern', 'Admin']}><InternDocuments /></ProtectedRoute>} />
      <Route path="/intern/working-time" element={<ProtectedRoute allowedRoles={['Intern', 'Admin']}><InternWorkingTime /></ProtectedRoute>} />
      <Route path="/intern/certificate" element={<ProtectedRoute allowedRoles={['Intern', 'Admin']}><InternCertificate /></ProtectedRoute>} />
      <Route path="/intern/profile" element={<ProtectedRoute allowedRoles={['Intern', 'Admin']}><InternProfile /></ProtectedRoute>} />
      <Route path="/intern/ai-assistant" element={<ProtectedRoute allowedRoles={['Intern', 'Admin']}><AIAssistantPage /></ProtectedRoute>} />
      <Route path="/intern/settings" element={<ProtectedRoute allowedRoles={['Intern', 'Admin']}><SettingsPage /></ProtectedRoute>} />
      <Route path="/intern/notifications" element={<ProtectedRoute allowedRoles={['Intern', 'Admin']}><NotificationsPage /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/employees" element={<ProtectedRoute allowedRoles={['Admin']}><AdminEmployees /></ProtectedRoute>} />
      <Route path="/admin/tasks" element={<ProtectedRoute allowedRoles={['Admin']}><AdminTasks /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['Admin']}><AdminReports /></ProtectedRoute>} />
      <Route path="/admin/rag-assistant" element={<ProtectedRoute allowedRoles={['Admin']}><RAGAssistantPage /></ProtectedRoute>} />
      <Route path="/admin/ai-assistant" element={<ProtectedRoute allowedRoles={['Admin']}><AIAssistantPage /></ProtectedRoute>} />
      <Route path="/admin/meeting-summary" element={<ProtectedRoute allowedRoles={['Admin']}><MeetingSummaryPage /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['Admin']}><SettingsPage /></ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['Admin']}><NotificationsPage /></ProtectedRoute>} />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
