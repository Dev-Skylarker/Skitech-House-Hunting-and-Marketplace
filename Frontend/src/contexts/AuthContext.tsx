// =====================================================================
// MOCK AUTH MODE — No Supabase / backend calls. Uses mockUsers only.
// To restore real auth: replace this file with the Supabase version.
// =====================================================================
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserType } from '@/types';
import { mockUsers } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, userType: UserType) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isChecking: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Simulate a short async delay (like a real API would have)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('skitech_user');
    const storedToken = localStorage.getItem('skitech_token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        localStorage.removeItem('skitech_user');
        localStorage.removeItem('skitech_token');
      }
    }
    setIsChecking(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await delay(400);

    // --- MOCK CREDENTIALS ---
    // Any mock user: use their email + password "password" (or "admin" for admin)
    // OR: admin@skitech.co.ke / admin123
    // OR: accept any email matching a mock user with any password for demo convenience
    const found = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (found) {
      const mockToken = `mock-token-${found.id}-${Date.now()}`;
      setUser(found);
      setToken(mockToken);
      localStorage.setItem('skitech_user', JSON.stringify(found));
      localStorage.setItem('skitech_token', mockToken);
      toast({ title: 'Login Successful', description: `Welcome back, ${found.name}!` });
      return true;
    }

    // If email is not in mockUsers but the user tries any credentials, create a guest session
    // Remove below block if you want strict mock-user-only logins
    toast({
      title: 'Login Failed',
      description: 'Email not found. Try a mock user (e.g. admin@skitech.co.ke).',
      variant: 'destructive',
    });
    return false;
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string, userType: UserType) => {
    await delay(400);

    // Check if email already "exists"
    const exists = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      toast({
        title: 'Registration Failed',
        description: 'An account with that email already exists.',
        variant: 'destructive',
      });
      return false;
    }

    // Create a new mock user and add to the in-memory list
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      role: userType === 'landlord' ? 'landlord' : 'user',
      userType,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);

    const mockToken = `mock-token-${newUser.id}`;
    setUser(newUser);
    setToken(mockToken);
    localStorage.setItem('skitech_user', JSON.stringify(newUser));
    localStorage.setItem('skitech_token', mockToken);

    toast({ title: 'Registration Successful', description: `Welcome to Skitech, ${name}!` });
    return true;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    toast({
      title: 'Google Sign-In Unavailable',
      description: 'Running in offline/mock mode. Please use email & password.',
      variant: 'destructive',
    });
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('skitech_user');
    localStorage.removeItem('skitech_token');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  }, []);

  const resetPasswordFn = useCallback(async (email: string) => {
    await delay(300);
    const found = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      toast({
        title: 'Password Reset (Mock)',
        description: `In mock mode, passwords are not changed. Use any password to log back in as ${found.name}.`,
      });
      return true;
    }
    toast({
      title: 'Email Not Found',
      description: 'No mock user with that email address.',
      variant: 'destructive',
    });
    return false;
  }, []);

  const updatePasswordFn = useCallback(async (_newPassword: string) => {
    await delay(300);
    toast({
      title: 'Password Updated (Mock)',
      description: 'In mock mode, password changes are simulated only.',
    });
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      loginWithGoogle,
      logout,
      resetPassword: resetPasswordFn,
      updatePassword: updatePasswordFn,
      isAuthenticated: !!user,
      isChecking,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
