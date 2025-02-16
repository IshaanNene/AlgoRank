import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 5000, // 5 second timeout
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
  signup: async (userData: any) => {
    const response = await api.post('/api/auth/signup', userData);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },
  checkAuth: async () => {
    const response = await api.get('/api/auth/check');
    return response.data;
  },
};

export const problemsAPI = {
  getAll: async () => {
    const response = await api.get('/api/problems');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/problems/${id}`);
    return response.data;
  },
};

export const codeAPI = {
  runCode: async (data: { problemId: string; code: string; language: string; testCases?: any[] }) => {
    const response = await api.post('/api/code/run', data);
    return response.data;
  },
  submitSolution: async (data: { problemId: string; code: string; language: string }) => {
    const response = await api.post('/api/code/submit', data);
    return response.data;
  },
};

export const usersAPI = {
  getProfile: async (username: string) => {
    const response = await api.get(`/api/users/${username}`);
    return response.data;
  },
  updateProfile: async (userData: any) => {
    const response = await api.put('/api/users/profile', userData);
    return response.data;
  },
};

export const leaderboardAPI = {
  getLeaderboard: async (params?: {
    timeRange?: 'weekly' | 'monthly' | 'all';
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.timeRange) queryParams.append('timeRange', params.timeRange);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await api.get(`/api/leaderboard?${queryParams.toString()}`);
    return response.data;
  },
};

export default api;