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

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Is the backend server running?');
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export default api;