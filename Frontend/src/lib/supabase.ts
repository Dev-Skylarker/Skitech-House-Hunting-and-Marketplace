// =====================================================================
// MOCK MODE: All Supabase functionality is stubbed out.
// No real network calls are made. Switch to realApi when ready.
// =====================================================================

export const supabase = null as any; // Not used in mock mode

// Mock auth helpers — all return success shapes that AuthContext expects

export const signUp = async (_email: string, _password: string, _name: string) => {
  return { data: { user: null, session: null }, error: null };
};

export const signIn = async (_email: string, _password: string) => {
  return { data: { user: null, session: null }, error: null };
};

export const signInWithGoogle = async () => {
  return { data: {}, error: { message: 'Google sign-in not available in mock mode.' } };
};

export const signOut = async () => {
  return { error: null };
};

export const resetPassword = async (_email: string) => {
  return { data: {}, error: null };
};

export const updatePassword = async (_newPassword: string) => {
  return { data: {}, error: null };
};

export const getCurrentUser = async () => {
  return { user: null, error: null };
};

export const onAuthStateChange = (_callback: (event: string, session: any) => void) => {
  // Return a subscription object that does nothing
  return { data: { subscription: { unsubscribe: () => {} } } };
};

export default supabase;
