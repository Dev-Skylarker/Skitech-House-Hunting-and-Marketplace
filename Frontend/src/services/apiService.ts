import type { House, HouseRating, MarketplaceItem, Notification, User } from '@/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

const publicHouseStatuses = ['available'];
const publicItemStatuses = ['active'];

const toHouse = (row: any): House => ({
  id: row.id,
  title: row.title,
  houseType: row.house_type,
  location: row.location,
  price: Number(row.price || 0),
  deposit: Number(row.deposit || 0),
  description: row.description || '',
  amenities: row.amenities || [],
  images: row.images || [],
  landlordName: row.profiles?.full_name || 'Verified Landlord',
  landlordId: row.created_by,
  phone: row.profiles?.phone || '',
  whatsapp: row.profiles?.phone || '',
  verified: Boolean(row.profiles?.is_verified),
  status: row.status === 'active' ? 'available' : row.status === 'archived' ? 'taken' : 'pending',
  isSponsored: Boolean(row.is_sponsored),
  distance: Number(row.distance || 0),
  views: Number(row.views || 0),
  rating: row.rating ? Number(row.rating) : undefined,
  reviewCount: row.review_count || 0,
  bio: row.profiles?.bio,
  reputationScore: row.profiles?.reputation_score,
  badges: row.profiles?.badges,
  responseTime: row.profiles?.response_time,
  createdAt: row.created_at,
});

const toHouseRow = (house: Partial<House>) => ({
  title: house.title,
  house_type: house.houseType,
  location: house.location,
  price: house.price,
  deposit: house.deposit,
  description: house.description,
  amenities: house.amenities || [],
  images: house.images || [],
  status: house.status === 'available' ? 'active' : house.status === 'taken' ? 'archived' : 'pending',
  is_sponsored: house.isSponsored ?? false,
  distance: house.distance ?? 0,
  listing_type: 'house',
});

const toItem = (row: any): MarketplaceItem => ({
  id: row.id,
  title: row.title,
  category: row.category,
  price: Number(row.price || 0),
  condition: row.condition === 'like-new' ? 'like-new' : row.condition === 'new' ? 'new' : 'used',
  description: row.description || '',
  images: row.images || [],
  sellerName: row.profiles?.full_name || 'Verified Seller',
  phone: row.profiles?.phone || '',
  whatsapp: row.profiles?.phone || '',
  status: row.status === 'active' ? 'active' : row.status === 'archived' ? 'sold' : 'pending',
  isSponsored: Boolean(row.is_sponsored),
  views: Number(row.views || 0),
  createdAt: row.created_at,
});

const toItemRow = (item: Partial<MarketplaceItem>) => ({
  title: item.title,
  category: item.category,
  price: item.price,
  condition: item.condition,
  description: item.description,
  images: item.images || [],
  status: item.status === 'active' ? 'active' : item.status === 'sold' ? 'archived' : 'pending',
  is_sponsored: item.isSponsored ?? false,
  listing_type: 'item',
});

const toUser = (row: any): User => ({
  id: row.id,
  name: row.full_name,
  email: row.email,
  role: row.role as any,
  userType: row.user_type as any,
  avatar: row.avatar_url,
  phone: row.phone,
  bio: row.bio,
  verified: row.is_verified,
  reputationScore: row.reputation_score || 60,
  totalRatings: row.total_ratings || 0,
  averageRating: row.average_rating || 0,
  badges: row.badges || [],
  responseTime: row.response_time,
  createdAt: row.created_at,
});

const byCreated = (a: { createdAt: string }, b: { createdAt: string }) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

export const apiService = {
  houses: {
    async getHouses(filters?: { type?: string; location?: string; search?: string; includePending?: boolean; sponsoredOnly?: boolean }) {
      if (!isSupabaseConfigured || !supabase) {
        return { success: false, error: 'Supabase not configured', listings: [] };
      }

      let query = supabase.from('listings').select('*, profiles(*)').eq('listing_type', 'house').order('created_at', { ascending: false });
      if (filters?.sponsoredOnly) query = query.eq('is_sponsored', true);
      if (!filters?.includePending) query = query.eq('status', 'active');
      if (filters?.type) query = query.eq('house_type', filters.type);
      if (filters?.location) query = query.ilike('location', `%${filters.location}%`);
      if (filters?.search) query = query.or(`title.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      const { data, error } = await query;
      console.log('API: getHouses result:', { success: !error, count: data?.length, error });
      return error ? { success: false, error: error.message, listings: [] } : { success: true, listings: (data || []).map(toHouse) };
    },

    async getHouse(id: string) {
      if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase not configured', listing: null };

      // Try to increment views if possible (RPC might not exist yet)
      supabase.rpc('increment_listing_views', { listing_id: id }).then(() => {});

      const { data, error } = await supabase.from('listings').select('*, profiles(*)').eq('id', id).maybeSingle();
      if (error) return { success: false, error: error.message, listing: null };
      if (!data) return { success: false, error: 'Listing not found', listing: null };
      return { success: true, listing: toHouse(data) };
    },

    async createHouse(house: Partial<House>) {
      if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase not configured', listing: null };
      const { data, error } = await supabase.from('listings').insert(toHouseRow(house)).select('*, profiles(*)').single();
      return error ? { success: false, error: error.message, listing: null } : { success: true, listing: toHouse(data) };
    },

    async updateHouse(id: string, patch: Partial<House>) {
      if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase not configured' };
      const { error } = await supabase.from('listings').update(toHouseRow(patch)).eq('id', id);
      return error ? { success: false, error: error.message } : { success: true };
    },

    async deleteHouse(id: string) {
      if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase not configured' };
      const { error } = await supabase.from('listings').delete().eq('id', id);
      return error ? { success: false, error: error.message } : { success: true };
    },

    async getRatings(houseId: string) {
      if (!isSupabaseConfigured || !supabase) return { success: true, ratings: [] };
      const { data, error } = await supabase.from('house_ratings').select('*').eq('house_id', houseId).order('created_at', { ascending: false });
      const ratings = (data || []).map((r: any): HouseRating => ({
        id: r.id,
        houseId: r.house_id,
        userId: r.user_id,
        rating: r.rating,
        landlordRating: r.landlord_rating,
        review: r.review,
        categories: r.categories,
        createdAt: r.created_at,
      }));
      return error ? { success: false, error: error.message, ratings: [] } : { success: true, ratings };
    },
  },

  marketplace: {
    async getItems(filters?: { category?: string; condition?: string; search?: string; includePending?: boolean; sponsoredOnly?: boolean }) {
      if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase not configured', items: [] };

      let query = supabase.from('listings').select('*, profiles(*)').eq('listing_type', 'item').order('created_at', { ascending: false });
      if (filters?.sponsoredOnly) query = query.eq('is_sponsored', true);
      if (!filters?.includePending) query = query.eq('status', 'active');
      if (filters?.category) query = query.eq('category', filters.category);
      if (filters?.condition) query = query.eq('condition', filters.condition);
      if (filters?.search) query = query.ilike('title', `%${filters.search}%`);
      const { data, error } = await query;
      console.log('API: getItems result:', { success: !error, count: data?.length, error });
      return error ? { success: false, error: error.message, items: [] } : { success: true, items: (data || []).map(toItem) };
    },

    async getItem(id: string) {
      if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase not configured', item: null };
      supabase.rpc('increment_listing_views', { listing_id: id }).then(() => {});
      const { data, error } = await supabase.from('listings').select('*, profiles(*)').eq('id', id).maybeSingle();
      return error ? { success: false, error: error.message, item: null } : { success: Boolean(data), item: data ? toItem(data) : null };
    },

    async createItem(item: Partial<MarketplaceItem>) {
      if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase not configured', item: null };
      const { data, error } = await supabase.from('listings').insert(toItemRow(item)).select('*, profiles(*)').single();
      return error ? { success: false, error: error.message, item: null } : { success: true, item: toItem(data) };
    },

    async updateItem(id: string, patch: Partial<MarketplaceItem>) {
      if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase not configured' };
      const { error } = await supabase.from('listings').update(toItemRow(patch)).eq('id', id);
      return error ? { success: false, error: error.message } : { success: true };
    },

    async deleteItem(id: string) {
      if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase not configured' };
      const { error } = await supabase.from('listings').delete().eq('id', id);
      return error ? { success: false, error: error.message } : { success: true };
    },
  },

  requests: {
    async createRequest(payload: any) {
      if (!isSupabaseConfigured || !supabase) return { success: true, request: { id: `req-${Date.now()}`, ...payload } };
      const { data, error } = await supabase.from('user_requests').insert(payload).select('*').single();
      return error ? { success: false, error: error.message } : { success: true, request: data };
    },
  },

  notifications: {
    async getNotifications(userId: string) {
      if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase not configured', notifications: [] };
      const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      const notifications = (data || []).map((n: any): Notification => ({
        id: n.id,
        userId: n.user_id,
        type: n.type,
        title: n.title,
        description: n.description,
        relatedUserId: n.related_user_id,
        relatedHouseId: n.related_house_id,
        read: n.read,
        muted: n.muted,
        createdAt: n.created_at,
      }));
      return error ? { success: false, error: error.message, notifications: [] } : { success: true, notifications };
    },

    async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'muted'>) {
      if (!isSupabaseConfigured || !supabase) return { success: true };
      const { error } = await supabase.from('notifications').insert({
        user_id: notification.userId,
        type: notification.type,
        title: notification.title,
        description: notification.description,
        related_user_id: notification.relatedUserId,
        related_house_id: notification.relatedHouseId,
      });
      return error ? { success: false, error: error.message } : { success: true };
    },
  },

  admin: {
    async getDashboard() {
      if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase not configured', houses: [], items: [], users: [], requests: [], reports: [] };

      const [houses, items, users, requests, reports] = await Promise.all([
        supabase.from('listings').select('*, profiles(*)').eq('listing_type', 'house').order('created_at', { ascending: false }),
        supabase.from('listings').select('*, profiles(*)').eq('listing_type', 'item').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('user_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('reports').select('*').order('created_at', { ascending: false }),
      ]);

      const error = houses.error || items.error || users.error || requests.error || reports.error;
      return error
        ? { success: false, error: error.message, houses: [], items: [], users: [], requests: [], reports: [] }
        : {
            success: true,
            houses: (houses.data || []).map(toHouse),
            items: (items.data || []).map(toItem),
            users: (users.data || []).map(toUser),
            requests: requests.data || [],
            reports: reports.data || [],
          };
    },

    async logAction(action: string, target: string, targetType: string, metadata: Record<string, any> = {}) {
      if (!isSupabaseConfigured || !supabase) return { success: true };
      const { error } = await supabase.from('admin_audit_logs').insert({
        action,
        target_id: target,
        target_type: targetType,
        metadata,
      });
      return error ? { success: false, error: error.message } : { success: true };
    },

    async setSystemSetting(key: string, value: any) {
      if (!isSupabaseConfigured || !supabase) return { success: true };
      const { error } = await supabase.from('system_settings').upsert({ key, value });
      return error ? { success: false, error: error.message } : { success: true };
    },
  },
};

export default apiService;
