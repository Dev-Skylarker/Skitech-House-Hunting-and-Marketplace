import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserType } from '@/types';
import { mockUsers } from '@/services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, userType: UserType) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isChecking: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Persistence Check on Mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('skitech_user');
    const storedToken = localStorage.getItem('skitech_token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        console.log('Session restored from mount.');
      } catch (e) {
        console.error('Failed to parse stored session:', e);
        localStorage.removeItem('skitech_user');
        localStorage.removeItem('skitech_token');
      }
    }
    setIsChecking(false);
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    // Simulated Latency
    await new Promise(r => setTimeout(r, 800));

    const found = mockUsers.find(u => u.email === email);
    const mToken = `mock_jwt_${Math.random().toString(36).substring(7)}`;

    if (found) {
      setUser(found);
      setToken(mToken);
      localStorage.setItem('skitech_user', JSON.stringify(found));
      localStorage.setItem('skitech_token', mToken);
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
    setToken(mToken);
    localStorage.setItem('skitech_user', JSON.stringify(newUser));
    localStorage.setItem('skitech_token', mToken);
    return true;
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string, userType: UserType) => {
    await new Promise(r => setTimeout(r, 800));
    const mToken = `mock_reg_jwt_${Math.random().toString(36).substring(7)}`;

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
    setToken(mToken);
    localStorage.setItem('skitech_user', JSON.stringify(newUser));
    localStorage.setItem('skitech_token', mToken);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('skitech_user');
    localStorage.removeItem('skitech_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!user, isChecking }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
