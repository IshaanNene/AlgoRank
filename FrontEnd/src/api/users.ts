import api from './api';

const usersAPI = {
  getLeaderboard: async (params?: { 
    timeRange?: string; 
    page?: number; 
    limit?: number;
  }) => {
    try {
      const response = await api.get('/leaderboard', { params });
      return response.data;
    } catch (error) {
      console.error('[Users API] Error fetching leaderboard:', error);
      throw error;
    }
  },
};

export default usersAPI; 