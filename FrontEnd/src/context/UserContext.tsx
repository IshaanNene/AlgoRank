import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export interface UserStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  submissions: number;
  acceptanceRate: string;
  streak: number;
  ranking: number;
}

export interface UserPreferences {
  theme?: string;
  language?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  stats?: UserStats;
  preferences?: UserPreferences;
  savedSolutions?: { [key: string]: string };
  recentActivity?: { id: string; type: string; timestamp: Date }[];
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
    setUser(prev => prev ? { ...prev, preferences: { ...prev.preferences, ...preferences } } : null);
  };

  const saveSolution = (problemId: string, code: string) => {
    setUser(prev => prev ? { ...prev, savedSolutions: { ...prev.savedSolutions, [problemId]: code } } : null);
  };

  const addActivity = (activity: User['recentActivity'][0]) => {
    setUser(prev => prev ? { ...prev, recentActivity: [activity, ...(prev.recentActivity || [])] } : null);
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authAPI.login({ username, password });
      setUser(data.user);
      localStorage.setItem("token", data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authAPI.logout();
      setUser(null);
      localStorage.removeItem("token");
    } catch (err: any) {
      setError(err.response?.data?.message || "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const data = await authAPI.checkAuth();
        setUser(data.user);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

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
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
} 