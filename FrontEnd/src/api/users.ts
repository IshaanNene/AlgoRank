import api from './api';

interface LeaderboardParams {
  page?: number;
  limit?: number;
  timeRange?: 'week' | 'month' | 'all';
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  stats?: {
    solved: number;
    attempted: number;
    rank: number;
    streak: number;
  };
}

const usersAPI = {
  getLeaderboard: async (params: LeaderboardParams = {}) => {
    const response = await api.get('/leaderboard', { params });
    return response.data;
  },

  getProfile: async (userId: string) => {
    const response = await api.get<UserProfile>(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (userId: string, data: Partial<UserProfile>) => {
    const response = await api.put<UserProfile>(`/users/${userId}`, data);
    return response.data;
  },

  getStats: async (userId: string) => {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data;
  },

  getActivity: async (userId: string, params: { page?: number; limit?: number } = {}) => {
    const response = await api.get(`/users/${userId}/activity`, { params });
    return response.data;
  },

  searchUsers: async (query: string) => {
    const response = await api.get('/users/search', { params: { q: query } });
    return response.data;
  },

  followUser: async (userId: string) => {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },

  unfollowUser: async (userId: string) => {
    const response = await api.delete(`/users/${userId}/follow`);
    return response.data;
  },

  getFollowers: async (userId: string) => {
    const response = await api.get(`/users/${userId}/followers`);
    return response.data;
  },

  getFollowing: async (userId: string) => {
    const response = await api.get(`/users/${userId}/following`);
    return response.data;
  }
};

export default usersAPI; 