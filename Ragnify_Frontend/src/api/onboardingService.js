import api from './axios';
import { MOCK_APPLICATIONS } from '../data/mockApplications';
import { MOCK_DOCUMENTS } from '../data/mockDocuments';
import { MOCK_OFFER_LETTERS, MOCK_CERTIFICATES } from '../data/mockOfferLetters';
import { MOCK_TENURE, MOCK_WORKING_HOURS } from '../data/mockTenure';
import { MOCK_EMPLOYEES } from '../data/mockEmployees';

export const onboardingService = {
  getApplications: async () => {
    try {
      const response = await api.get('/onboarding/applications');
      return response.data;
    } catch (err) {
      return MOCK_APPLICATIONS;
    }
  },

  getApplicationById: async (id) => {
    try {
      const response = await api.get(`/onboarding/applications/${id}`);
      return response.data;
    } catch (err) {
      return MOCK_APPLICATIONS.find(a => a.id === id) || MOCK_APPLICATIONS[0];
    }
  },

  submitApplication: async (data) => {
    try {
      const config = data instanceof FormData 
        ? { headers: { 'Content-Type': 'multipart/form-data' } } 
        : {};
      const response = await api.post('/onboarding/apply', data, config);
      return response.data;
    } catch (err) {
      console.error('Failed to submit application:', err);
      throw err;
    }
  },

  updateApplicationStatus: async (id, status, notes) => {
    try {
      const response = await api.patch(`/onboarding/applications/${id}`, { status, notes });
      return response.data;
    } catch (err) {
      return { id, status, notes };
    }
  },

  deleteApplication: async (id) => {
    try {
      const response = await api.delete(`/onboarding/applications/${id}`);
      return response.data;
    } catch (err) {
      return onboardingService.updateApplicationStatus(id, 'REJECTED');
    }
  }
};

export const documentService = {
  getDocuments: async (params = {}) => {
    try {
      const response = await api.get('/documents', { params });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      // If server returned empty, fall through to role-filtered mock
    } catch (err) {
      console.warn('Backend documents endpoint unavailable, using role-isolated mock repository:', err.message);
    }

    // Role-isolated fallback
    const role = (params.role || '').toUpperCase();
    const userId = params.user_id || params.candidate_id;

    if (role === 'INTERN' || userId === 'INT-201') {
      return MOCK_DOCUMENTS.filter(d => d.type === 'Intern' && (d.candidateId === 'INT-201' || !userId));
    }
    if (role === 'EMPLOYEE' || userId === 'CAND-001') {
      return MOCK_DOCUMENTS.filter(d => d.type === 'Employee' && (d.candidateId === 'CAND-001' || !userId));
    }
    if (userId) {
      return MOCK_DOCUMENTS.filter(d => d.candidateId === userId);
    }
    return MOCK_DOCUMENTS;
  },

  verifyDocument: async (id, status, remarks) => {
    try {
      const response = await api.patch(`/documents/${id}/verify`, { status, remarks });
      return response.data;
    } catch (err) {
      return { id, status, remarks };
    }
  }
};

export const offerLetterService = {
  getOfferLetters: async () => {
    try {
      const response = await api.get('/offer-letters');
      return response.data;
    } catch (err) {
      return MOCK_OFFER_LETTERS;
    }
  },

  generateOfferLetter: async (payload) => {
    try {
      const data = typeof payload === 'string' ? { applicationId: payload } : payload;
      const response = await api.post('/offer-letters/generate', data);
      return response.data;
    } catch (err) {
      return { id: `OFR-${Date.now().toString().slice(-4)}`, status: 'GENERATED' };
    }
  }
};

export const certificateService = {
  getCertificates: async () => {
    try {
      const response = await api.get('/certificates');
      return response.data;
    } catch (err) {
      return MOCK_CERTIFICATES;
    }
  },

  issueCertificate: async (internId) => {
    try {
      const response = await api.post(`/certificates/issue/${internId}`);
      return response.data;
    } catch (err) {
      return { id: `CERT-${Date.now().toString().slice(-4)}`, status: 'AVAILABLE', hrApproved: true, internAccessGranted: true };
    }
  },

  revokeCertificate: async (internId) => {
    try {
      const response = await api.post(`/certificates/revoke/${internId}`);
      return response.data;
    } catch (err) {
      return { id: internId, status: 'LOCKED', hrApproved: false, internAccessGranted: false };
    }
  }
};

export const tenureService = {
  getTenures: async () => {
    try {
      const response = await api.get('/tenure');
      return response.data;
    } catch (err) {
      return MOCK_TENURE;
    }
  }
};

export const workingHoursService = {
  getWorkingHours: async (candidateId = null) => {
    try {
      const response = await api.get('/working-hours', {
        params: candidateId ? { candidate_id: candidateId } : {}
      });
      return response.data;
    } catch (err) {
      return MOCK_WORKING_HOURS;
    }
  },

  startWork: async (payload) => {
    try {
      const data = typeof payload === 'string' ? { candidate_id: payload } : payload;
      const response = await api.post('/working-hours/start', data);
      return response.data;
    } catch (err) {
      return { 
        success: true, 
        message: 'Started session', 
        record: { date: new Date().toISOString().split('T')[0], clockIn: '09:30 AM', clockOut: '--:--', totalHours: 'In Progress', status: 'IN_PROGRESS' } 
      };
    }
  },

  endWork: async (payload) => {
    try {
      const data = typeof payload === 'string' ? { candidate_id: payload } : payload;
      const response = await api.post('/working-hours/end', data);
      return response.data;
    } catch (err) {
      return { 
        success: true, 
        message: 'Ended session', 
        record: { date: new Date().toISOString().split('T')[0], clockIn: '09:30 AM', clockOut: '06:30 PM', totalHours: '8.50 hrs', status: 'COMPLETED' },
        tenure: { daysCompleted: 69, totalDays: 92, progress: 75 }
      };
    }
  },

  clockIn: async (userId) => {
    return workingHoursService.startWork(userId);
  },

  clockOut: async (userId) => {
    return workingHoursService.endWork(userId);
  }
};

export const internService = {
  getInterns: async () => {
    return MOCK_EMPLOYEES.filter(e => e.type === 'Intern');
  },
  getActiveInterns: async () => {
    return MOCK_EMPLOYEES.filter(e => e.type === 'Intern' && e.status === 'ACTIVE');
  }
};
