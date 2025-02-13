import React, { createContext, useContext, useState, useCallback } from 'react';
import { auth } from '../App';

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
  username: string;
  name: string;
  email: string;
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
  logout: () => Promise<void>;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
    setUser(prev => prev ? {
      ...prev,
      preferences: { ...prev.preferences, ...preferences }
    } : null);
  }, []);

  const saveSolution = useCallback((problemId: string, code: string) => {
    setUser(prev => prev ? {
      ...prev,
      savedSolutions: { ...prev.savedSolutions, [problemId]: code }
    } : null);
  }, []);

  const addActivity = useCallback((activity: User['recentActivity'][0]) => {
    setUser(prev => prev ? {
      ...prev,
      recentActivity: [activity, ...prev.recentActivity].slice(0, 10)
    } : null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await auth.logout();
      localStorage.removeItem('authToken');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = await auth.checkAuth();
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      updatePreferences,
      saveSolution,
      addActivity,
      logout,
      isLoading,
      checkAuth
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); 