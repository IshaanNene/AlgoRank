import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface UserStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  submissions: number;
  acceptanceRate: string;
  streak: number;
  ranking: number;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: number;
  tabSize: number;
  language: string;
  autoSave: boolean;
}

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  location: string;
  github: string;
  twitter: string;
  bio: string;
  profileCompletion: number;
  stats: UserStats;
  preferences: UserPreferences;
  savedSolutions: Record<string, string>;
  recentActivity: Array<{
    id: string;
    type: 'solved' | 'attempted' | 'commented';
    problemId: string;
    timestamp: Date;
  }>;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  saveSolution: (problemId: string, code: string) => void;
  addActivity: (activity: User['recentActivity'][0]) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    setUser(prev => prev ? {
      ...prev,
      preferences: { ...prev.preferences, ...preferences }
    } : null);
  };

  const saveSolution = (problemId: string, code: string) => {
    setUser(prev => prev ? {
      ...prev,
      savedSolutions: { ...prev.savedSolutions, [problemId]: code }
    } : null);
  };

  const addActivity = (activity: User['recentActivity'][0]) => {
    setUser(prev => prev ? {
      ...prev,
      recentActivity: [activity, ...prev.recentActivity].slice(0, 10)
    } : null);
  };

  const login = async (username: string, password: string) => {
    try {
      const data = await authAPI.login(username, password);
      setUser(data.user);
      localStorage.setItem('authToken', data.token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await authAPI.checkAuth();
      setUser(data.user);
    } catch (err: any) {
      console.error('Auth check failed:', err);
      setUser(null);
      setError(err.message || 'Failed to check authentication');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth().catch(console.error);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      updatePreferences,
      saveSolution,
      addActivity,
      login,
      logout,
      isLoading,
      error,
      checkAuth
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 