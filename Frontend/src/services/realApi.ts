const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = localStorage.getItem('skitech_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
}

// Authentication API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success) {
      localStorage.setItem('skitech_token', response.token);
      localStorage.setItem('skitech_user', JSON.stringify(response.user));
    }
    
    return response;
  },

  register: async (name: string, email: string, password: string, userType: string) => {
    const response = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, userType }),
    });
    
    if (response.success) {
      localStorage.setItem('skitech_token', response.token);
      localStorage.setItem('skitech_user', JSON.stringify(response.user));
    }
    
    return response;
  },

  logout: async () => {
    try {
      await apiCall('/api/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('skitech_token');
      localStorage.removeItem('skitech_user');
    }
  },

  getCurrentUser: async () => {
    return await apiCall('/api/auth/me');
  },

  forgotPassword: async (email: string) => {
    return await apiCall('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, newPassword: string) => {
    return await apiCall('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};

// Users API
export const usersApi = {
  getProfile: async (userId: string) => {
    return await apiCall(`/api/users/${userId}`);
  },

  updateProfile: async (userId: string, updates: any) => {
    return await apiCall(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  getUserListings: async (userId: string) => {
    return await apiCall(`/api/users/${userId}/listings`);
  },

  getUserWishlist: async (userId: string) => {
    return await apiCall(`/api/users/${userId}/wishlist`);
  },
};

// Listings API
export const listingsApi = {
  getListings: async (filters: any = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });

    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiCall(`/api/listings${query}`);
  },

  getListing: async (id: string) => {
    return await apiCall(`/api/listings/${id}`);
  },

  createListing: async (listingData: any) => {
    return await apiCall('/api/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  },

  updateListing: async (id: string, updates: any) => {
    return await apiCall(`/api/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteListing: async (id: string) => {
    return await apiCall(`/api/listings/${id}`, {
      method: 'DELETE',
    });
  },

  getHouseTypes: async () => {
    return await apiCall('/api/listings/types');
  },
};

// Marketplace API
export const marketplaceApi = {
  getItems: async (filters: any = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });

    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiCall(`/api/marketplace${query}`);
  },

  getItem: async (id: string) => {
    return await apiCall(`/api/marketplace/${id}`);
  },

  createItem: async (itemData: any) => {
    return await apiCall('/api/marketplace', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  updateItem: async (id: string, updates: any) => {
    return await apiCall(`/api/marketplace/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteItem: async (id: string) => {
    return await apiCall(`/api/marketplace/${id}`, {
      method: 'DELETE',
    });
  },

  getCategories: async () => {
    return await apiCall('/api/marketplace/categories');
  },

  getConditions: async () => {
    return await apiCall('/api/marketplace/conditions');
  },
};

// Wishlist API
export const wishlistApi = {
  addToWishlist: async (userId: string, itemId: string, itemType: 'listing' | 'marketplace_item') => {
    return await apiCall('/api/wishlist', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, item_id: itemId, item_type: itemType }),
    });
  },

  removeFromWishlist: async (userId: string, itemId: string) => {
    return await apiCall(`/api/wishlist/${userId}/${itemId}`, {
      method: 'DELETE',
    });
  },

  getWishlist: async (userId: string) => {
    return await apiCall(`/api/wishlist/${userId}`);
  },
};

// Health check
export const healthCheck = async () => {
  return await apiCall('/api/health');
};

// Combined API object
export const api = {
  auth: authApi,
  users: usersApi,
  listings: listingsApi,
  marketplace: marketplaceApi,
  wishlist: wishlistApi,
  health: healthCheck,
};

export default api;
