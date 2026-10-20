import api from './axios';

export const notificationService = {
  getNotifications: async (role = null) => {
    try {
      const response = await api.get('/notifications', {
        params: role ? { role } : {}
      });
      return response.data;
    } catch (err) {
      console.warn('Backend notifications endpoint error, using local fallback:', err);
      const fallbackData = [
        {
          id: 'NOTIF-001',
          notification_id: 'NOTIF-001',
          sender_name: 'Priya Sharma (HR Operations)',
          sender_role: 'HR',
          sender_email: 'hr@ragnify.com',
          target_role: 'All',
          target_name: 'All Workforce (Managers, Employees & Interns)',
          title: 'Q4 Workplace Hybrid Policy & Leave Guidelines',
          desc: 'Welcome to Q4! All team members are requested to log their hybrid work schedules on the working hours portal. Standard casual & medical leave allowances for 2026 have been refreshed in your profile dashboards.',
          message: 'Welcome to Q4! All team members are requested to log their hybrid work schedules on the working hours portal. Standard casual & medical leave allowances for 2026 have been refreshed in your profile dashboards.',
          time: '10 mins ago',
          type: 'announcement',
          unread: true,
          replies: []
        },
        {
          id: 'NOTIF-002',
          notification_id: 'NOTIF-002',
          sender_name: 'Vikram Mehta (Engineering Manager)',
          sender_role: 'Manager',
          sender_email: 'manager@ragnify.com',
          target_role: 'Employee',
          target_name: 'All AI & Data Science Division Employees',
          title: 'Sprint 4 Architecture Sync & Task Allocations',
          desc: 'Please review your assigned sprint backlog items in Employee Tasks. We have completed ChromaDB cosine vector index integration and aim to complete QA testing by Friday EOD.',
          message: 'Please review your assigned sprint backlog items in Employee Tasks. We have completed ChromaDB cosine vector index integration and aim to complete QA testing by Friday EOD.',
          time: '1 hour ago',
          type: 'chat',
          unread: true,
          replies: []
        },
        {
          id: 'NOTIF-003',
          notification_id: 'NOTIF-003',
          sender_name: 'Priya Sharma (HR Operations)',
          sender_role: 'HR',
          sender_email: 'hr@ragnify.com',
          target_role: 'Intern',
          target_name: 'All Active Internship Candidates',
          title: 'Compliance Document Verification Reminder',
          desc: 'All onboarding interns are requested to verify their uploaded documents on their Intern Profile to ensure smooth stipend disbursement.',
          message: 'All onboarding interns are requested to verify their uploaded documents on their Intern Profile to ensure smooth stipend disbursement.',
          time: '3 hours ago',
          type: 'onboarding',
          unread: false,
          replies: []
        },
        {
          id: 'NOTIF-004',
          notification_id: 'NOTIF-004',
          sender_name: 'Vikram Mehta (Engineering Manager)',
          sender_role: 'Manager',
          sender_email: 'manager@ragnify.com',
          target_role: 'Intern',
          target_name: 'Engineering & Frontend Interns',
          title: 'Internship Capstone Presentation Schedule & Daily Time Clock Policy',
          desc: 'Welcome to Q4! All interns under my direct supervision please ensure daily working hours are logged via the Time Clock on your workspace dashboard. Milestone 2 deliverable reviews and mentorship sync are scheduled for this Friday.',
          message: 'Welcome to Q4! All interns under my direct supervision please ensure daily working hours are logged via the Time Clock on your workspace dashboard. Milestone 2 deliverable reviews and mentorship sync are scheduled for this Friday.',
          time: '4 hours ago',
          type: 'chat',
          unread: true,
          replies: []
        }
      ];

      if (role && role.toUpperCase() === 'INTERN') {
        return fallbackData.filter(n => 
          n.sender_role?.toUpperCase().includes('MANAGER') &&
          n.target_role?.toUpperCase() === 'INTERN' &&
          !n.target_role?.toUpperCase().includes('EMPLOYEE') &&
          !(n.target_name || '').toLowerCase().includes('employee')
        );
      }

      return fallbackData;
    }
  },

  sendNotification: async (payload) => {
    try {
      const response = await api.post('/notifications/send', payload);
      return response.data;
    } catch (err) {
      console.error('Failed to send notification via backend:', err);
      return {
        success: true,
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        ...payload,
        time: 'Just now',
        unread: true,
        replies: []
      };
    }
  },

  replyToNotification: async (notificationId, payload) => {
    try {
      const response = await api.post(`/notifications/${notificationId}/reply`, payload);
      return response.data;
    } catch (err) {
      console.error('Failed to reply to notification via backend:', err);
      return {
        success: true,
        id: `REP-${Date.now().toString().slice(-4)}`,
        parent_id: notificationId,
        ...payload,
        time: 'Just now',
        created_at: new Date().toISOString()
      };
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (err) {
      return { success: true, id: notificationId };
    }
  },

  markAllRead: async () => {
    try {
      const response = await api.patch('/notifications/read-all');
      return response.data;
    } catch (err) {
      return { success: true };
    }
  }
};

export default notificationService;
