import type { House, MarketplaceItem, User, Notification, HouseRating } from '@/types';
import { api } from './realApi';

// Import mock data as fallback
import { mockHouses, mockItems } from './api';

// Configuration
const USE_REAL_API = true; // Toggle this to switch between real API and mock data

// Houses API
export const housesApi = {
  getHouses: async (filters: any = {}) => {
    if (!USE_REAL_API) {
      // Return mock data
      let filteredHouses = [...mockHouses];
      
      if (filters.type) {
        filteredHouses = filteredHouses.filter(h => h.houseType === filters.type);
      }
      if (filters.location) {
        filteredHouses = filteredHouses.filter(h => 
          h.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      if (filters.minPrice) {
        filteredHouses = filteredHouses.filter(h => h.price >= filters.minPrice);
      }
      if (filters.maxPrice) {
        filteredHouses = filteredHouses.filter(h => h.price <= filters.maxPrice);
      }
      
      return { success: true, listings: filteredHouses };
    }

    try {
      const response = await api.listings.getListings(filters);
      return {
        success: true,
        listings: response.listings || response,
        pagination: response.pagination
      };
    } catch (error) {
      console.error('Failed to fetch houses from API, falling back to mock data:', error);
      // Fallback to mock data
      return { success: true, listings: mockHouses };
    }
  },

  getHouse: async (id: string) => {
    if (!USE_REAL_API) {
      const house = mockHouses.find(h => h.id === id);
      return house ? { success: true, listing: house } : { success: false, error: 'House not found' };
    }

    try {
      const response = await api.listings.getListing(id);
      return { success: true, listing: response.listing || response };
    } catch (error) {
      console.error('Failed to fetch house from API, falling back to mock data:', error);
      // Fallback to mock data
      const house = mockHouses.find(h => h.id === id);
      return house ? { success: true, listing: house } : { success: false, error: 'House not found' };
    }
  },

  createHouse: async (houseData: any) => {
    if (!USE_REAL_API) {
      // Mock creation
      const newHouse = {
        ...houseData,
        id: `h${mockHouses.length + 1}`,
        createdAt: new Date().toISOString(),
        views: 0,
        rating: 0,
        reviewCount: 0
      };
      mockHouses.push(newHouse);
      return { success: true, listing: newHouse };
    }

    try {
      const response = await api.listings.createListing(houseData);
      return { success: true, listing: response.listing || response };
    } catch (error) {
      console.error('Failed to create house:', error);
      return { success: false, error: 'Failed to create house' };
    }
  },

  updateHouse: async (id: string, updates: any) => {
    if (!USE_REAL_API) {
      // Mock update
      const houseIndex = mockHouses.findIndex(h => h.id === id);
      if (houseIndex !== -1) {
        mockHouses[houseIndex] = { ...mockHouses[houseIndex], ...updates };
        return { success: true, listing: mockHouses[houseIndex] };
      }
      return { success: false, error: 'House not found' };
    }

    try {
      const response = await api.listings.updateListing(id, updates);
      return { success: true, listing: response.listing || response };
    } catch (error) {
      console.error('Failed to update house:', error);
      return { success: false, error: 'Failed to update house' };
    }
  },

  deleteHouse: async (id: string) => {
    if (!USE_REAL_API) {
      // Mock deletion
      const houseIndex = mockHouses.findIndex(h => h.id === id);
      if (houseIndex !== -1) {
        mockHouses.splice(houseIndex, 1);
        return { success: true };
      }
      return { success: false, error: 'House not found' };
    }

    try {
      await api.listings.deleteListing(id);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete house:', error);
      return { success: false, error: 'Failed to delete house' };
    }
  },

  getHouseTypes: async () => {
    if (!USE_REAL_API) {
      return { success: true, types: ['bedsitter', 'single', '1br', '2br', '3br'] };
    }

    try {
      const response = await api.listings.getHouseTypes();
      return { success: true, types: response.types || response };
    } catch (error) {
      console.error('Failed to fetch house types:', error);
      return { success: true, types: ['bedsitter', 'single', '1br', '2br', '3br'] };
    }
  }
};

// Marketplace API
export const marketplaceApi = {
  getItems: async (filters: any = {}) => {
    if (!USE_REAL_API) {
      // Return mock data
      let filteredItems = [...mockItems];
      
      if (filters.category) {
        filteredItems = filteredItems.filter(i => i.category === filters.category);
      }
      if (filters.condition) {
        filteredItems = filteredItems.filter(i => i.condition === filters.condition);
      }
      if (filters.minPrice) {
        filteredItems = filteredItems.filter(i => i.price >= filters.minPrice);
      }
      if (filters.maxPrice) {
        filteredItems = filteredItems.filter(i => i.price <= filters.maxPrice);
      }
      
      return { success: true, items: filteredItems };
    }

    try {
      const response = await api.marketplace.getItems(filters);
      return {
        success: true,
        items: response.items || response,
        pagination: response.pagination
      };
    } catch (error) {
      console.error('Failed to fetch marketplace items from API, falling back to mock data:', error);
      // Fallback to mock data
      return { success: true, items: mockItems };
    }
  },

  getItem: async (id: string) => {
    if (!USE_REAL_API) {
      const item = mockItems.find(i => i.id === id);
      return item ? { success: true, item } : { success: false, error: 'Item not found' };
    }

    try {
      const response = await api.marketplace.getItem(id);
      return { success: true, item: response.item || response };
    } catch (error) {
      console.error('Failed to fetch item from API, falling back to mock data:', error);
      // Fallback to mock data
      const item = mockItems.find(i => i.id === id);
      return item ? { success: true, item } : { success: false, error: 'Item not found' };
    }
  },

  createItem: async (itemData: any) => {
    if (!USE_REAL_API) {
      // Mock creation
      const newItem = {
        ...itemData,
        id: `i${mockItems.length + 1}`,
        createdAt: new Date().toISOString(),
        views: 0
      };
      mockItems.push(newItem);
      return { success: true, item: newItem };
    }

    try {
      const response = await api.marketplace.createItem(itemData);
      return { success: true, item: response.item || response };
    } catch (error) {
      console.error('Failed to create item:', error);
      return { success: false, error: 'Failed to create item' };
    }
  },

  updateItem: async (id: string, updates: any) => {
    if (!USE_REAL_API) {
      // Mock update
      const itemIndex = mockItems.findIndex(i => i.id === id);
      if (itemIndex !== -1) {
        mockItems[itemIndex] = { ...mockItems[itemIndex], ...updates };
        return { success: true, item: mockItems[itemIndex] };
      }
      return { success: false, error: 'Item not found' };
    }

    try {
      const response = await api.marketplace.updateItem(id, updates);
      return { success: true, item: response.item || response };
    } catch (error) {
      console.error('Failed to update item:', error);
      return { success: false, error: 'Failed to update item' };
    }
  },

  deleteItem: async (id: string) => {
    if (!USE_REAL_API) {
      // Mock deletion
      const itemIndex = mockItems.findIndex(i => i.id === id);
      if (itemIndex !== -1) {
        mockItems.splice(itemIndex, 1);
        return { success: true };
      }
      return { success: false, error: 'Item not found' };
    }

    try {
      await api.marketplace.deleteItem(id);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete item:', error);
      return { success: false, error: 'Failed to delete item' };
    }
  },

  getCategories: async () => {
    if (!USE_REAL_API) {
      return { 
        success: true, 
        categories: [
          { id: 'electronics', name: 'Electronics', icon: '📱' },
          { id: 'furniture', name: 'Furniture', icon: '🛋️' },
          { id: 'books', name: 'Books', icon: '📚' },
          { id: 'appliances', name: 'Appliances', icon: '🍳' },
          { id: 'clothing', name: 'Clothing', icon: '👕' },
          { id: 'sports', name: 'Sports & Fitness', icon: '⚽' },
          { id: 'other', name: 'Other', icon: '📦' }
        ]
      };
    }

    try {
      const response = await api.marketplace.getCategories();
      return { success: true, categories: response.categories || response };
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return { 
        success: true, 
        categories: [
          { id: 'electronics', name: 'Electronics', icon: '📱' },
          { id: 'furniture', name: 'Furniture', icon: '🛋️' },
          { id: 'books', name: 'Books', icon: '📚' },
          { id: 'appliances', name: 'Appliances', icon: '🍳' },
          { id: 'clothing', name: 'Clothing', icon: '👕' },
          { id: 'sports', name: 'Sports & Fitness', icon: '⚽' },
          { id: 'other', name: 'Other', icon: '📦' }
        ]
      };
    }
  }
};

// Users API
export const usersApi = {
  getProfile: async (userId: string) => {
    try {
      const response = await api.users.getProfile(userId);
      return { success: true, user: response.user || response };
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return { success: false, error: 'Failed to fetch profile' };
    }
  },

  updateProfile: async (userId: string, updates: any) => {
    try {
      const response = await api.users.updateProfile(userId, updates);
      return { success: true, user: response.user || response };
    } catch (error) {
      console.error('Failed to update profile:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  },

  getUserListings: async (userId: string) => {
    try {
      const response = await api.users.getUserListings(userId);
      return { success: true, listings: response.listings || response };
    } catch (error) {
      console.error('Failed to fetch user listings:', error);
      return { success: true, listings: [] };
    }
  },

  getUserWishlist: async (userId: string) => {
    try {
      const response = await api.users.getUserWishlist(userId);
      return { success: true, wishlist: response.wishlist || response };
    } catch (error) {
      console.error('Failed to fetch user wishlist:', error);
      return { success: true, wishlist: [] };
    }
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.health();
    return { success: true, status: response };
  } catch (error) {
    console.error('Health check failed:', error);
    return { success: false, error: 'Backend is not available' };
  }
};

// Combined API service
export const apiService = {
  houses: housesApi,
  marketplace: marketplaceApi,
  users: usersApi,
  health: healthCheck
};

export default apiService;
