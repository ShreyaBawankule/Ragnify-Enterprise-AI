import api from './axios';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      return response.data;
    } catch (err) {
      console.warn('Backend login unavailable, falling back to client auth');
      throw err;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (err) {
      return null;
    }
  }
};
