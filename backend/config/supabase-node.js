const { createClient } = require('@supabase/supabase-js');

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
const supabase = getSupabaseClient();

// User management functions
const getUser = async (userId) => {
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

const createUser = async (userData) => {
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

const updateUser = async (userId, updateData) => {
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
const getListings = async (filters = {}) => {
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
    if (filters.type) {
      query = query.eq('house_type', filters.type);
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    
    // Pagination
    if (filters.page && filters.limit) {
      const from = (filters.page - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
};

const createListing = async (listingData) => {
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
const getMarketplaceItems = async (filters = {}) => {
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
    if (filters.condition) {
      query = query.eq('condition', filters.condition);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    
    // Pagination
    if (filters.page && filters.limit) {
      const from = (filters.page - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    throw error;
  }
};

const createMarketplaceItem = async (itemData) => {
  try {
    const { data, error } = await supabase
      .from('marketplace_items')
      .insert(itemData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating marketplace item:', error);
    throw error;
  }
};

// Wishlist functions
const getWishlist = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        listings(id, title, price, images, location),
        marketplace_items(id, title, price, images, category)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

const addToWishlist = async (userId, itemId, itemType) => {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .insert({
        user_id: userId,
        item_id: itemId,
        item_type: itemType
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

const removeFromWishlist = async (userId, itemId) => {
  try {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('item_id', itemId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

// Test connection
async function testConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count').single();
    if (error && error.code !== 'PGRST116') {
      console.error('Supabase connection error:', error.message);
    } else {
      console.log('✅ Supabase connected successfully');
    }
  } catch (err) {
    console.log('⚠️  Supabase connection test failed - tables may not exist yet');
  }
}

// Initialize connection test
testConnection();

module.exports = {
  supabase,
  getUser,
  createUser,
  updateUser,
  getListings,
  createListing,
  getMarketplaceItems,
  createMarketplaceItem,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getSupabaseClient
};
