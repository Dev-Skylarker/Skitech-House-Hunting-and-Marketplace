import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables: SUPABASE_URL and SUPABASE_ANON_KEY');
}

// Create singleton Supabase client instance to prevent multiple GoTrueClient instances
let supabaseInstance = null;

const getSupabaseClient = (useServiceRole = false) => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const key = useServiceRole ? supabaseServiceRoleKey : supabaseAnonKey;
  
  if (!key) {
    throw new Error(`Missing ${useServiceRole ? 'SUPABASE_SERVICE_ROLE_KEY' : 'SUPABASE_ANON_KEY'} environment variable`);
  }

  supabaseInstance = createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });

  return supabaseInstance;
};

// Export the singleton client getter
export const supabase = getSupabaseClient();

// User management functions
export const getUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Listings management functions
export const getListings = async (filters = {}) => {
  try {
    let query = supabase
      .from('listings')
      .select('*');
    
    // Apply filters if provided
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }
    if (filters.propertyType) {
      query = query.eq('property_type', filters.propertyType);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
};

export const createListing = async (listingData) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .insert(listingData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

// Marketplace items functions
export const getMarketplaceItems = async (filters = {}) => {
  try {
    let query = supabase
      .from('marketplace_items')
      .select('*');
    
    // Apply filters if provided
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    throw error;
  }
};

// Export the client for direct usage if needed
export default supabase;
