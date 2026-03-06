export type HouseType = 'bedsitter' | 'single' | '1br' | '2br' | '3br';
export type HouseStatus = 'available' | 'taken' | 'pending';
export type ItemCondition = 'new' | 'like-new' | 'used';
export type ItemCategory = 'furniture' | 'electronics' | 'books' | 'appliances' | 'other';
export type UserRole = 'guest' | 'user' | 'landlord' | 'admin';
export type UserType = 'tenant' | 'landlord';
export type ListingStatus = 'active' | 'pending' | 'rejected' | 'sold';
export type NotificationType = 'favorite_added' | 'house_viewed' | 'new_message' | 'listing_approved' | 'listing_rejected' | 'system';
export type BadgeType = 'superhost' | 'responsive' | 'clean' | 'communicative' | 'trusted' | 'top_rated';

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
  landlordId?: string;
  phone: string;
  whatsapp: string;
  verified: boolean;
  status: HouseStatus;
  distance: number; // km from campus
  views: number;
  rating?: number;
  reviewCount?: number;
  flags?: { count: number; reasons: string[] };
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
  userType?: UserType;
  avatar?: string;
  phone?: string;
  bio?: string;
  verified?: boolean;
  reputationScore?: number;
  totalRatings?: number;
  averageRating?: number;
  badges?: BadgeType[];
  responseTime?: string;
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

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  relatedUserId?: string;
  relatedHouseId?: string;
  read: boolean;
  muted: boolean;
  createdAt: string;
}

export interface HouseRating {
  id: string;
  houseId: string;
  userId: string;
  rating: number;
  landlordRating: number;
  review?: string;
  categories?: {
    cleanliness: number;
    communication: number;
    accuracy: number;
    value: number;
  };
  createdAt: string;
}
