import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from './context/UserContext';
import Navbar from './components/Navbar';
import Main from './pages/Main'; // Import the updated Main component
import Login from './pages/Login';
import Signup from './pages/Signup'; // Import the new Signup component
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Problems from './pages/Problems';
import CodeEditor from './pages/CodeEditor';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute'; // Keep the import for ProtectedRoute
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (username: string, password: string) => {
    const response = await api.post('/api/auth/login', { username, password });
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
  forgotPassword: async (email: string) => {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  },
  checkAuth: async () => {
    const response = await api.get('/api/auth/check');
    return response.data;
  },
};

export const problems = {
  getAll: async () => {
    const response = await api.get('/api/problems');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/problems/${id}`);
    return response.data;
  },
  submit: async (problemId: string, code: string, language: string) => {
    const response = await api.post('/submit', { problemId, code, language });
    return response.data;
  },
  run: async (problemId: string, code: string, language: string) => {
    const response = await api.post('/run', { problemId, code, language });
    return response.data;
  },
};

export const users = {
  getProfile: async (username: string) => {
    const response = await api.get(`/api/users/${username}`);
    return response.data;
  },
  updateProfile: async (userData: any) => {
    const response = await api.put('/api/users/profile', userData);
    return response.data;
  },
  getLeaderboard: async () => {
    const response = await api.get('/api/leaderboard');
    return response.data;
  },
};

export default api;

// Public Route wrapper component (redirects if user is already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {user && <Navbar />}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default function App() {
  const { user, checkAuth } = useUser();

  // Effect to handle authentication state
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/problems" element={
            <ProtectedRoute>
              <Problems />
            </ProtectedRoute>
          } />
          <Route path="/problem/:id" element={
            <ProtectedRoute>
              <CodeEditor />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          } />
        </Routes>
      </AppLayout>
    </Router>
  );
}