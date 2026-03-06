import type { House, MarketplaceItem, User } from '@/types';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80';
const PLACEHOLDER2 = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80';
const PLACEHOLDER3 = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80';
const ITEM_IMG1 = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80';
const ITEM_IMG2 = 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80';
const ITEM_IMG3 = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80';

export const mockHouses: House[] = [
  {
    id: 'h1', title: 'Spacious Bedsitter near Campus Gate', houseType: 'bedsitter',
    location: 'Kangaru Road', price: 5000, deposit: 5000,
    description: 'A clean and spacious bedsitter just 5 minutes walk from UoEM main gate. Has running water and electricity included.',
    amenities: ['Water', 'Electricity', 'Security', 'Parking'],
    images: [PLACEHOLDER, PLACEHOLDER2], landlordName: 'John Mwangi', phone: '+254712345678',
    whatsapp: '+254712345678', verified: true, status: 'available', distance: 0.3, views: 245, createdAt: '2026-03-01',
  },
  {
    id: 'h2', title: 'Modern 1BR Apartment', houseType: '1br',
    location: 'Embu Town Center', price: 12000, deposit: 12000,
    description: 'Fully furnished 1 bedroom apartment with modern finishes. Close to shopping centers and public transport.',
    amenities: ['Water', 'Electricity', 'WiFi', 'Furnished', 'Security'],
    images: [PLACEHOLDER2, PLACEHOLDER3], landlordName: 'Mary Wanjiru', phone: '+254723456789',
    whatsapp: '+254723456789', verified: true, status: 'available', distance: 1.2, views: 189, createdAt: '2026-02-28',
  },
  {
    id: 'h3', title: 'Affordable Single Room', houseType: 'single',
    location: 'Behind UoEM', price: 3500, deposit: 3500,
    description: 'Budget-friendly single room ideal for students. Shared bathroom and kitchen facilities.',
    amenities: ['Water', 'Electricity', 'Security'],
    images: [PLACEHOLDER3, PLACEHOLDER], landlordName: 'Peter Njeru', phone: '+254734567890',
    whatsapp: '+254734567890', verified: false, status: 'available', distance: 0.5, views: 312, createdAt: '2026-03-03',
  },
  {
    id: 'h4', title: 'Executive 2BR Apartment', houseType: '2br',
    location: 'Majimbo Estate', price: 18000, deposit: 18000,
    description: 'Luxurious 2 bedroom apartment with master ensuite. Spacious living area and modern kitchen.',
    amenities: ['Water', 'Electricity', 'WiFi', 'Parking', 'Security', 'Furnished', 'Hot Water'],
    images: [PLACEHOLDER, PLACEHOLDER2, PLACEHOLDER3], landlordName: 'Grace Muthoni', phone: '+254745678901',
    whatsapp: '+254745678901', verified: true, status: 'available', distance: 2.0, views: 156, createdAt: '2026-02-25',
  },
  {
    id: 'h5', title: 'Cozy Bedsitter with Balcony', houseType: 'bedsitter',
    location: 'Dallas Estate', price: 6500, deposit: 6500,
    description: 'Neat bedsitter with a private balcony. Well-ventilated with plenty of natural light.',
    amenities: ['Water', 'Electricity', 'Balcony', 'Security'],
    images: [PLACEHOLDER2, PLACEHOLDER], landlordName: 'James Kariuki', phone: '+254756789012',
    whatsapp: '+254756789012', verified: false, status: 'available', distance: 1.5, views: 98, createdAt: '2026-03-05',
  },
  {
    id: 'h6', title: 'Studio Apartment near Market', houseType: '1br',
    location: 'Embu Market Area', price: 8500, deposit: 8500,
    description: 'Modern studio apartment close to the main market. Perfect for students who love convenience.',
    amenities: ['Water', 'Electricity', 'WiFi', 'CCTV'],
    images: [PLACEHOLDER3, PLACEHOLDER2], landlordName: 'Sarah Njoki', phone: '+254767890123',
    whatsapp: '+254767890123', verified: true, status: 'available', distance: 1.8, views: 134, createdAt: '2026-03-02',
  },
];

export const mockItems: MarketplaceItem[] = [
  {
    id: 'i1', title: 'Study Desk - Solid Wood', category: 'furniture', price: 3500,
    condition: 'used', description: 'Sturdy wooden study desk in great condition. Minor scratches on surface.',
    images: [ITEM_IMG1], sellerName: 'Alice Kamau', phone: '+254711111111',
    whatsapp: '+254711111111', status: 'active', views: 45, createdAt: '2026-03-04',
  },
  {
    id: 'i2', title: 'HP Laptop 15" - Core i5', category: 'electronics', price: 35000,
    condition: 'like-new', description: '8GB RAM, 256GB SSD. Used for one semester only. Comes with charger and laptop bag.',
    images: [ITEM_IMG2], sellerName: 'Brian Omondi', phone: '+254722222222',
    whatsapp: '+254722222222', status: 'active', views: 89, createdAt: '2026-03-03',
  },
  {
    id: 'i3', title: 'Calculus Textbook - Stewart', category: 'books', price: 800,
    condition: 'used', description: 'Calculus: Early Transcendentals 8th Edition. Some highlighting but all pages intact.',
    images: [ITEM_IMG3], sellerName: 'Catherine Wambui', phone: '+254733333333',
    whatsapp: '+254733333333', status: 'active', views: 23, createdAt: '2026-03-05',
  },
  {
    id: 'i4', title: 'Electric Kettle 1.5L', category: 'appliances', price: 1200,
    condition: 'new', description: 'Brand new electric kettle. Stainless steel. Auto shut-off feature.',
    images: [ITEM_IMG1], sellerName: 'Daniel Mutua', phone: '+254744444444',
    whatsapp: '+254744444444', status: 'active', views: 67, createdAt: '2026-03-01',
  },
  {
    id: 'i5', title: 'Curtains - Floral Pattern', category: 'other', price: 1500,
    condition: 'like-new', description: 'Beautiful floral curtains. Used for only 2 months. Fits standard windows.',
    images: [ITEM_IMG2], sellerName: 'Eva Njeri', phone: '+254755555555',
    whatsapp: '+254755555555', status: 'active', views: 34, createdAt: '2026-02-28',
  },
  {
    id: 'i6', title: 'Bluetooth Speaker - JBL Flip', category: 'electronics', price: 4500,
    condition: 'used', description: 'JBL Flip 5 Bluetooth speaker. Works perfectly. Battery lasts 10+ hours.',
    images: [ITEM_IMG1], sellerName: 'Frank Gitonga', phone: '+254766666666',
    whatsapp: '+254766666666', status: 'active', views: 112, createdAt: '2026-03-02',
  },
];

export const mockUsers: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@skitech.co.ke', role: 'admin', createdAt: '2026-01-01' },
  { id: 'u2', name: 'John Mwangi', email: 'john@example.com', role: 'landlord', phone: '+254712345678', createdAt: '2026-01-15' },
  { id: 'u3', name: 'Alice Kamau', email: 'alice@example.com', role: 'user', phone: '+254711111111', createdAt: '2026-02-01' },
];

// Simulated API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getHouses: async (filters?: { type?: string; minPrice?: number; maxPrice?: number; search?: string }) => {
    await delay(300);
    let results = [...mockHouses];
    if (filters?.type && filters.type !== 'all') results = results.filter(h => h.houseType === filters.type);
    if (filters?.minPrice) results = results.filter(h => h.price >= filters.minPrice!);
    if (filters?.maxPrice) results = results.filter(h => h.price <= filters.maxPrice!);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(h => h.title.toLowerCase().includes(q) || h.location.toLowerCase().includes(q));
    }
    return results;
  },

  getHouseById: async (id: string) => {
    await delay(200);
    return mockHouses.find(h => h.id === id) || null;
  },

  getItems: async (filters?: { category?: string; minPrice?: number; maxPrice?: number; condition?: string; search?: string }) => {
    await delay(300);
    let results = [...mockItems];
    if (filters?.category && filters.category !== 'all') results = results.filter(i => i.category === filters.category);
    if (filters?.condition && filters.condition !== 'all') results = results.filter(i => i.condition === filters.condition);
    if (filters?.minPrice) results = results.filter(i => i.price >= filters.minPrice!);
    if (filters?.maxPrice) results = results.filter(i => i.price <= filters.maxPrice!);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(i => i.title.toLowerCase().includes(q));
    }
    return results;
  },

  getItemById: async (id: string) => {
    await delay(200);
    return mockItems.find(i => i.id === id) || null;
  },

  getAnalyticsStats: async () => {
    await delay(200);
    return {
      totalHouses: mockHouses.length,
      totalItems: mockItems.length,
      totalUsers: mockUsers.length,
      pendingApprovals: 3,
      viewsThisWeek: 1247,
      newListingsThisWeek: 8,
    };
  },
};
