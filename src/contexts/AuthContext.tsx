import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../services/db';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<User>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load current session
    try {
      const currentUser = db.getCurrentUser();
      setUser(currentUser);
    } catch (e) {
      console.error('Failed to load session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const loggedUser = await db.login(email, password);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (fullName: string, email: string, phone: string, password: string) => {
    const newUser = await db.register(fullName, email, phone, password);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    db.logout();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('Anda harus login terlebih dahulu.');
    const updated = await db.updateProfile(user.id, updates);
    setUser(updated);
    return updated;
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!user) throw new Error('Anda harus login terlebih dahulu.');
    return await db.changePassword(user.email, oldPassword, newPassword);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isAdmin,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
