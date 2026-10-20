import api from './axios';
import { MOCK_EMPLOYEES } from '../data/mockEmployees';
import { MOCK_TASKS } from '../data/mockTasks';

export const employeeService = {
  getEmployees: async () => {
    try {
      const response = await api.get('/employees');
      return response.data;
    } catch (err) {
      return MOCK_EMPLOYEES;
    }
  },

  createEmployee: async (data) => {
    try {
      const response = await api.post('/employees', data);
      return response.data;
    } catch (err) {
      return { id: `EMP-${Date.now()}`, ...data };
    }
  },

  updateEmployee: async (id, data) => {
    try {
      const response = await api.put(`/employees/${id}`, data);
      return response.data;
    } catch (err) {
      return { id, ...data };
    }
  },

  deleteEmployee: async (id) => {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (err) {
      return { success: true, id };
    }
  }
};

export const taskService = {
  getTasks: async () => {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (err) {
      return MOCK_TASKS;
    }
  },

  createTask: async (data) => {
    try {
      const response = await api.post('/tasks', data);
      return response.data;
    } catch (err) {
      return { id: `TSK-${Date.now()}`, ...data };
    }
  },

  updateTask: async (id, data) => {
    try {
      const response = await api.put(`/tasks/${id}`, data);
      return response.data;
    } catch (err) {
      return { id, ...data };
    }
  },

  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (err) {
      return { success: true, id };
    }
  }
};

export const dashboardService = {
  getStats: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (err) {
      return {
        totalEmployees: 42,
        activeInterns: 14,
        totalTasks: 86,
        inProgressTasks: 28,
        completedTasks: 58,
        completionRate: 67
      };
    }
  }
};
