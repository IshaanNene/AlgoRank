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
      localStorage.setItem('authToken', data.token);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: {
    email: string;
    password: string;
    username: string;
    name: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authAPI.signup(userData);
      setUser(data.user);
      localStorage.setItem('authToken', data.token);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Signup failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authAPI.logout();
      setUser(null);
      localStorage.removeItem('authToken');
      navigate('/login');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Logout failed';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    signup,
    logout,
    isLoading,
    error,
  };
}; 