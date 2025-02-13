import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useUser } from '../context/UserContext';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const login = useCallback(
    async (username: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const userData = await authAPI.login({ username, password });
        setUser(userData.user);
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Login failed');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, navigate]
  );

  const signup = useCallback(
    async (data: {
      email: string;
      password: string;
      username: string;
      name: string;
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const userData = await authAPI.signup(data);
        setUser(userData.user);
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Signup failed');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, navigate]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authAPI.logout();
      setUser(null);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  }, [setUser, navigate]);

  return {
    login,
    signup,
    logout,
    isLoading,
    error,
  };
};