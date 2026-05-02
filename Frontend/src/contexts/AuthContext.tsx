import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User, UserType } from '@/types';
import { mockUsers } from '@/services/api';
import {
  getCurrentUser,
  isSupabaseConfigured,
  onAuthStateChange,
  resetPassword,
  signIn,
  signInWithGoogle,
  signOut,
  signUp,
  supabase,
  updatePassword,
} from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export type ProfileUpdate = {
  name?: string;
  phone?: string;
  bio?: string;
  location?: string;
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>;
  register: (name: string, email: string, password: string, userType: UserType) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  /** Persists to Supabase `profiles` + auth metadata; updates local user state. */
  updateProfile: (patch: ProfileUpdate) => Promise<{ error?: string }>;
  isAuthenticated: boolean;
  isChecking: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mapProfile = (profile: any, fallback?: any): User => ({
  id: profile?.id || fallback?.id,
  name: profile?.full_name || fallback?.user_metadata?.full_name || fallback?.email?.split('@')[0] || 'Skitech User',
  email: profile?.email || fallback?.email || '',
  role: profile?.role === 'user' ? 'resident' : profile?.role || (profile?.user_type === 'landlord' ? 'landlord' : 'resident'),
  userType: profile?.user_type === 'tenant' ? 'resident' : profile?.user_type || fallback?.user_metadata?.user_type || 'resident',
  avatar: profile?.avatar_url || fallback?.user_metadata?.avatar_url,
  phone: profile?.phone || '',
  bio: profile?.bio || '',
  location: profile?.location || fallback?.user_metadata?.location || '',
  verified: Boolean(profile?.is_verified),
  reputationScore: profile?.reputation_score ?? 60,
  totalRatings: profile?.total_ratings ?? 0,
  averageRating: profile?.average_rating ?? 0,
  badges: profile?.badges || [],
  responseTime: profile?.response_time || '',
  createdAt: profile?.created_at || fallback?.created_at || new Date().toISOString(),
});

async function fetchProfile(authUser: any): Promise<User | null> {
  if (!authUser) return null;
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle();

  if (error) {
    console.error('Profile fetch failed:', error);
    return mapProfile(null, authUser);
  }

  return mapProfile(data, authUser);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fallback = setTimeout(() => {
      if (mounted) {
        console.warn('Auth restore timeout - forcing isChecking=false');
        setIsChecking(false);
      }
    }, 5000);

    if (!isSupabaseConfigured) {
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
      clearTimeout(fallback);
      setIsChecking(false);
      return;
    }

    // SUPABASE LISTENER (inherently handles INITIAL_SESSION)
    const { data: authListener } = onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        let profile = await fetchProfile(session?.user);

        // Assign pending role from Google Sign Up
        const pendingRole = localStorage.getItem('google_signup_role');
        if (event === 'SIGNED_IN' && pendingRole && session?.user && supabase) {
          const expectedRole = pendingRole === 'landlord' ? 'landlord' : 'resident';
          localStorage.removeItem('google_signup_role');

          if (profile) {
            const createdAt = new Date(profile.createdAt || session.user.created_at).getTime();
            const now = new Date().getTime();
            const isNewAccount = (now - createdAt) < 60000; // Account created within last 60s

            if (isNewAccount) {
              await supabase.from('profiles').update({
                role: expectedRole,
                user_type: expectedRole
              }).eq('id', session.user.id);
              profile = await fetchProfile(session.user);
              
              const msg = expectedRole === 'landlord'
                ? 'Account created successfully! Please check your email to confirm your account before logging in. Once confirmed, your identity will be verified by our team within 48h.'
                : 'Account created successfully! Please check your email to confirm your account before logging in.';
              toast({ title: 'Confirm Email', description: msg });
            } else {
              // Existing account trying to "Sign up" via Google
              await supabase.auth.signOut();
              if (profile.role !== expectedRole) {
                toast({ title: 'Signup Blocked', description: `This account is already registered on a different role. Please log in.`, variant: 'destructive' });
              } else {
                toast({ title: 'Account Exists', description: `Account already exists. Please log in.`, variant: 'destructive' });
              }
              return; // Halt the login flow
            }
          }
        }

        if (mounted) {
          setUser(profile);
          setToken(session?.access_token || null);
          setIsChecking(false);
          clearTimeout(fallback);
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUser(null);
          setToken(null);
          setIsChecking(false);
          clearTimeout(fallback);
        }
      } else {
        if (mounted) {
          setIsChecking(false);
          clearTimeout(fallback);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(fallback);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      await delay(250);
      const found = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!found) {
        toast({ title: 'Login Failed', description: 'Supabase is not configured and this email is not a mock account.', variant: 'destructive' });
        return { success: false };
      }
      const mockToken = `mock-token-${found.id}-${Date.now()}`;
      setUser(found);
      setToken(mockToken);
      localStorage.setItem('skitech_user', JSON.stringify(found));
      localStorage.setItem('skitech_token', mockToken);
      toast({ title: 'Login Successful', description: `Welcome back, ${found.name}!` });
      return { success: true, user: found };
    }

    const { data, error } = await signIn(email, password);
    if (error) {
      toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
      return { success: false };
    }

    const profile = await fetchProfile(data.user);
    setUser(profile);
    setToken(data.session?.access_token || null);
    toast({ title: 'Login Successful', description: `Welcome back, ${profile?.name || 'there'}!` });
    return { success: true, user: profile || undefined };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, userType: UserType) => {
    if (!isSupabaseConfigured) {
      toast({ title: 'Supabase Required', description: 'Add Supabase env keys to create real accounts.', variant: 'destructive' });
      return false;
    }

    if (supabase) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', email)
        .maybeSingle();

      if (existingProfile) {
        const expectedRole = userType === 'landlord' ? 'landlord' : 'resident';
        if (existingProfile.role !== expectedRole) {
          toast({ title: 'Signup Blocked', description: `This account is already registered on a different role. Please log in.`, variant: 'destructive' });
          return false;
        } else {
          toast({ title: 'Account Exists', description: `Account already exists. Please log in.`, variant: 'destructive' });
          return false;
        }
      }
    }

    const { data, error } = await signUp(email, password, name, userType);
    if (error) {
      toast({ title: 'Registration Failed', description: error.message, variant: 'destructive' });
      return false;
    }

    if (data.user && supabase) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: name,
        email,
        user_type: userType,
        role: userType === 'landlord' ? 'landlord' : 'resident',
        is_verified: false,
      });
    }

    const msg = userType === 'landlord'
      ? 'Account created successfully! Please check your email to confirm your account before logging in. Once confirmed, your identity will be verified by our team within 48h.'
      : 'Account created successfully! Please check your email to confirm your account before logging in.';

    toast({ title: 'Confirm Email', description: msg });
    return true;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({ title: 'Google Sign-In Failed', description: error.message, variant: 'destructive' });
      return false;
    }
    return true;
  }, []);

  const logout = useCallback(() => {
    signOut();
    setUser(null);
    setToken(null);
    localStorage.removeItem('skitech_user');
    localStorage.removeItem('skitech_token');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  }, []);

  const resetPasswordFn = useCallback(async (email: string) => {
    const { error } = await resetPassword(email);
    if (error) {
      toast({ title: 'Password Reset Failed', description: error.message, variant: 'destructive' });
      return false;
    }
    toast({ title: 'Password Reset Sent', description: 'Check your email for reset instructions.' });
    return true;
  }, []);

  const updatePasswordFn = useCallback(async (newPassword: string) => {
    const { error } = await updatePassword(newPassword);
    if (error) {
      toast({ title: 'Password Update Failed', description: error.message, variant: 'destructive' });
      return false;
    }
    toast({ title: 'Password Updated', description: 'Your password has been changed.' });
    return true;
  }, []);

  const updateProfile = useCallback(async (patch: ProfileUpdate) => {
    if (!user) return { error: 'Not signed in' };

    if (!isSupabaseConfigured || !supabase) {
      const next: User = {
        ...user,
        name: patch.name ?? user.name,
        phone: patch.phone !== undefined ? patch.phone : user.phone,
        bio: patch.bio !== undefined ? patch.bio : user.bio,
        location: patch.location !== undefined ? patch.location : user.location,
      };
      setUser(next);
      localStorage.setItem('skitech_user', JSON.stringify(next));
      return {};
    }

    const { user: authUser, error: authErr } = await getCurrentUser();
    if (authErr || !authUser) return { error: authErr?.message || 'Not signed in' };

    const full_name = patch.name ?? user.name;
    const phone = patch.phone !== undefined ? patch.phone : (user.phone || '');
    const bio = patch.bio !== undefined ? patch.bio : (user.bio || '');
    const location = patch.location !== undefined ? patch.location : (user.location || '');

    const dbRole = user.role === 'admin' ? 'admin' : (user.userType === 'landlord' ? 'landlord' : 'resident');
    const dbUserType = user.userType === 'landlord' ? 'landlord' : 'resident';

    const row = {
      id: authUser.id,
      email: authUser.email ?? user.email,
      full_name,
      phone: phone || null,
      bio: bio || null,
      role: dbRole,
      user_type: dbUserType,
      avatar_url: user.avatar ?? null,
      is_verified: user.verified ?? false,
      reputation_score: user.reputationScore ?? 60,
      total_ratings: user.totalRatings ?? 0,
      average_rating: user.averageRating ?? 0,
      badges: user.badges ?? [],
      response_time: user.responseTime || null,
      updated_at: new Date().toISOString(),
    };

    const { error: upErr } = await supabase.from('profiles').upsert(row, { onConflict: 'id' });
    if (upErr) return { error: upErr.message };

    const meta = {
      ...(authUser.user_metadata || {}),
      full_name,
      location,
    };

    const { error: metaErr } = await supabase.auth.updateUser({ data: meta });
    if (metaErr) return { error: metaErr.message };

    const { user: refreshed } = await getCurrentUser();
    const freshProfile = await fetchProfile(refreshed);
    if (freshProfile) setUser(freshProfile);
    return {};
  }, [user]);

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
      updateProfile,
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
