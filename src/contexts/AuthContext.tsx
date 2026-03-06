import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserType } from '@/types';
import { mockUsers } from '@/services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, userType: UserType) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('skitech_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, _password: string) => {
    const found = mockUsers.find(u => u.email === email);
    if (found) {
      setUser(found);
      localStorage.setItem('skitech_user', JSON.stringify(found));
      return true;
    }
    // Mock: accept any email as tenant by default
    const newUser: User = {
      id: `u${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'user',
      userType: 'tenant',
      verified: false,
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('skitech_user', JSON.stringify(newUser));
    return true;
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string, userType: UserType) => {
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      role: 'user',
      userType,
      verified: false,
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('skitech_user', JSON.stringify(newUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('skitech_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
