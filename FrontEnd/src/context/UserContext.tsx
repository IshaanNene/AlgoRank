import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

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
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  updatePreferences: () => {},
  saveSolution: () => {},
  addActivity: () => {},
  logout: async () => {},
  isLoading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Add useEffect to check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${yourAuthToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError("Received non-JSON response");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        setUser, 
        updatePreferences, 
        saveSolution, 
        addActivity,
        logout,
        isLoading
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); 