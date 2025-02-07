import React, { createContext, useContext, useState } from 'react';

interface User {
  email: string;
  name: string;
  username: string;
  location: string;
  github: string;
  twitter: string;
  bio: string;
  profileCompletion: number;
  stats: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    submissions: number;
    acceptanceRate: string;
  };
}

const UserContext = createContext<{ user: User | null; setUser: (user: User) => void } | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 