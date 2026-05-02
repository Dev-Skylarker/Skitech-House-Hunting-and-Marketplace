import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

const notConfiguredError = {
  message: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.',
};

export const signUp = async (email: string, password: string, name: string, userType = 'resident') => {
  if (!supabase) return { data: { user: null, session: null }, error: notConfiguredError };

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        user_type: userType,
      },
    },
  });
};

export const signIn = async (email: string, password: string) => {
  if (!supabase) return { data: { user: null, session: null }, error: notConfiguredError };
  return supabase.auth.signInWithPassword({ email, password });
};

export const signInWithGoogle = async () => {
  if (!supabase) return { data: {}, error: notConfiguredError };

  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/account`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
};

export const signOut = async () => {
  if (!supabase) return { error: null };
  return supabase.auth.signOut();
};

export const resetPassword = async (email: string) => {
  if (!supabase) return { data: {}, error: notConfiguredError };
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/forgot-password`,
  });
};

export const updatePassword = async (newPassword: string) => {
  if (!supabase) return { data: {}, error: notConfiguredError };
  return supabase.auth.updateUser({ password: newPassword });
};

export const getCurrentUser = async () => {
  if (!supabase) return { user: null, error: null };
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange(callback);
};

export default supabase;
