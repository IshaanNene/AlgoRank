import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useUser } from '../context/UserContext';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authAPI.login({ username, password });
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authAPI.signup(userData);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authAPI.logout();
      setUser(null);
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    signup,
    logout,
    isLoading,
    error
  };
}; 