import api from './api';

const problemsAPI = {
  getProblems: async (params?: {
    difficulty?: string;
    tag?: string;
    status?: string;
  }) => {
    try {
      const response = await api.get('/problems', { params });
      return response.data;
    } catch (error) {
      console.error('[Problems API] Error fetching problems:', error);
      throw error;
    }
  },

  getProblemById: async (id: string) => {
    try {
      const response = await api.get(`/problems/${id}`);
      return response.data;
    } catch (error) {
      console.error('[Problems API] Error fetching problem:', error);
      throw error;
    }
  }
};

export default problemsAPI; 