import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserType } from '@/types';
import { api } from '@/services/realApi';
import { toast } from '@/hooks/use-toast';
import { supabase, signUp, signIn, signInWithGoogle, signOut, resetPassword, updatePassword, getCurrentUser, onAuthStateChange } from '@/lib/supabase';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Supabase Auth State Management
  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { user: supabaseUser } = await getCurrentUser();
        
        if (supabaseUser) {
          // Convert Supabase user to our User type
          const user: User = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
            email: supabaseUser.email || '',
            role: supabaseUser.user_metadata?.role || 'tenant',
            isVerified: supabaseUser.email_confirmed_at != null,
            createdAt: supabaseUser.created_at,
            updatedAt: supabaseUser.updated_at,
            phone: supabaseUser.phone,
            avatar: supabaseUser.user_metadata?.avatar,
          };
          
          setUser(user);
          setToken(supabaseUser.session?.access_token || null);
          
          // Store in localStorage for persistence
          localStorage.setItem('skitech_user', JSON.stringify(user));
          localStorage.setItem('skitech_token', supabaseUser.session?.access_token || '');
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // For Google sign-up, check if user already exists in our system
        let userRole = session.user.user_metadata?.role || 'tenant';
        
        // If it's a new Google user without a role, check localStorage for selected role
        if (!userRole && session.user.app_metadata?.provider === 'google') {
          userRole = localStorage.getItem('google_signup_role') || 'tenant';
          localStorage.removeItem('google_signup_role');
        }
        
        const user: User = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: userRole,
          isVerified: session.user.email_confirmed_at != null,
          createdAt: session.user.created_at,
          updatedAt: session.user.updated_at,
          phone: session.user.phone,
          avatar: session.user.user_metadata?.avatar,
        };
        
        setUser(user);
        setToken(session.access_token || null);
        
        // Store in localStorage
        localStorage.setItem('skitech_user', JSON.stringify(user));
        localStorage.setItem('skitech_token', session.access_token || '');
        
        // Create user profile in backend if it's a new user
        if (session.user.created_at === session.user.updated_at) {
          try {
            await api.users.createProfile({
              id: user.id,
              name: user.name,
              email: user.email,
              role: userRole,
              avatar: user.avatar,
            });
          } catch (error) {
            console.error('Failed to create user profile:', error);
          }
        }
        
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setToken(null);
        localStorage.removeItem('skitech_user');
        localStorage.removeItem('skitech_token');
      }
      
      setIsChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.error('Supabase login error:', error);
        toast({
          title: "Login Failed",
          description: error.message || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }
      
      if (data.user && data.session) {
        // User state is handled by the auth state change listener
        toast({
          title: "Login Successful",
          description: `Welcome back!`,
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, userType: UserType) => {
    try {
      const { data, error } = await signUp(email, password, name);
      
      if (error) {
        console.error('Supabase registration error:', error);
        toast({
          title: "Registration Failed",
          description: error.message || "Registration failed",
          variant: "destructive",
        });
        return false;
      }
      
      if (data.user && data.session) {
        // User state is handled by the auth state change listener
        toast({
          title: "Registration Successful",
          description: `Welcome to Skitech! Please check your email to verify your account.`,
        });
        return true;
      } else if (data.user) {
        // Email confirmation required
        toast({
          title: "Registration Successful",
          description: `Welcome to Skitech! Please check your email to verify your account.`,
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        console.error('Google sign-in error:', error);
        toast({
          title: "Google Sign-In Failed",
          description: error.message || "Unable to sign in with Google",
          variant: "destructive",
        });
        return false;
      }
      
      // User state is handled by the auth state change listener
      return true;
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Google Sign-In Failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { error } = await signOut();
      
      if (error) {
        console.error('Supabase logout error:', error);
      }
      
      // User state is handled by the auth state change listener
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "Failed to logout properly.",
        variant: "destructive",
      });
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { data, error } = await resetPassword(email);
      
      if (error) {
        console.error('Password reset error:', error);
        toast({
          title: "Password Reset Failed",
          description: error.message || "Unable to send reset email",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for password reset instructions.",
      });
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Password Reset Failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { data, error } = await updatePassword(newPassword);
      
      if (error) {
        console.error('Password update error:', error);
        toast({
          title: "Password Update Failed",
          description: error.message || "Unable to update password",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      return true;
    } catch (error) {
      console.error('Password update error:', error);
      toast({
        title: "Password Update Failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      loginWithGoogle,
      logout, 
      resetPassword,
      updatePassword,
      isAuthenticated: !!user, 
      isChecking 
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
