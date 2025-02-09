import React, { createContext, useContext, useState, useCallback } from 'react';

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
  email: string;
  name: string;
  username: string;
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
  setUser: (user: User) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  saveSolution: (problemId: string, code: string) => void;
  addActivity: (activity: User['recentActivity'][0]) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          ...newPreferences
        }
      };
    });
  }, []);

  const saveSolution = useCallback((problemId: string, code: string) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        savedSolutions: {
          ...prev.savedSolutions,
          [problemId]: code
        }
      };
    });
  }, []);

  const addActivity = useCallback((activity: User['recentActivity'][0]) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        recentActivity: [activity, ...prev.recentActivity].slice(0, 50) // Keep last 50 activities
      };
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // Additional cleanup if needed
  }, []);

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        setUser, 
        updatePreferences, 
        saveSolution, 
        addActivity,
        logout 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 