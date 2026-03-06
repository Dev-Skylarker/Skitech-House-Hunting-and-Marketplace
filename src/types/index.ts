export type HouseType = 'bedsitter' | 'single' | '1br' | '2br' | '3br';
export type HouseStatus = 'available' | 'taken' | 'pending';
export type ItemCondition = 'new' | 'like-new' | 'used';
export type ItemCategory = 'furniture' | 'electronics' | 'books' | 'appliances' | 'other';
export type UserRole = 'guest' | 'user' | 'landlord' | 'admin';
export type ListingStatus = 'active' | 'pending' | 'rejected' | 'sold';

export interface House {
  id: string;
  title: string;
  houseType: HouseType;
  location: string;
  price: number;
  deposit: number;
  description: string;
  amenities: string[];
  images: string[];
  landlordName: string;
  phone: string;
  whatsapp: string;
  verified: boolean;
  status: HouseStatus;
  distance: number; // km from campus
  views: number;
  createdAt: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  category: ItemCategory;
  price: number;
  condition: ItemCondition;
  description: string;
  images: string[];
  sellerName: string;
  phone: string;
  whatsapp: string;
  status: ListingStatus;
  views: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  eventType: string;
  userId?: string;
  targetId: string;
  targetType: 'house' | 'item';
  action: string;
  timestamp: string;
}
