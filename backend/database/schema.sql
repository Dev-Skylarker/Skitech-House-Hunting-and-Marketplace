-- Skitech House Hunting & Marketplace Database Schema
-- PostgreSQL/Supabase Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('tenant', 'landlord')),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    phone VARCHAR(20),
    location VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    verified BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties/Houses Listings table
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    house_type VARCHAR(20) NOT NULL CHECK (house_type IN ('bedsitter', 'single', '1br', '2br', '3br')),
    location VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    deposit DECIMAL(10,2),
    landlord_id UUID REFERENCES users(id) ON DELETE CASCADE,
    landlord_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20),
    amenities TEXT[], -- Array of amenities
    images TEXT[], -- Array of image URLs
    verified BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'taken', 'pending', 'inactive')),
    distance DECIMAL(5,2), -- Distance from campus in km
    views INTEGER DEFAULT 0,
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    coordinates POINT, -- PostGIS point for location
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace Items table
CREATE TABLE IF NOT EXISTS marketplace_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('electronics', 'furniture', 'books', 'appliances', 'clothing', 'sports', 'other')),
    price DECIMAL(10,2) NOT NULL,
    condition VARCHAR(20) NOT NULL CHECK (condition IN ('new', 'like-new', 'good', 'fair')),
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    seller_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20),
    images TEXT[], -- Array of image URLs
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'pending', 'inactive')),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('listing', 'marketplace_item')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_id, item_type) -- Prevent duplicates
);

-- Reviews table for listings
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(listing_id, reviewer_id) -- One review per user per listing
);

-- Messages table for user communication
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    marketplace_item_id UUID REFERENCES marketplace_items(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('favorite_added', 'house_viewed', 'new_message', 'listing_approved', 'listing_rejected', 'system')),
    related_id UUID, -- Can reference listing, message, etc.
    read BOOLEAN DEFAULT false,
    muted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs for admin tracking
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(house_type);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings USING gin(to_tsvector('english', location));
CREATE INDEX IF NOT EXISTS idx_listings_landlord ON listings(landlord_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_category ON marketplace_items(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_status ON marketplace_items(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_price ON marketplace_items(price);
CREATE INDEX IF NOT EXISTS idx_marketplace_seller ON marketplace_items(seller_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_listing ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketplace_items_updated_at BEFORE UPDATE ON marketplace_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Everyone can view listings, but only landlords can create/update their own
CREATE POLICY "Everyone can view listings" ON listings FOR SELECT USING (true);
CREATE POLICY "Landlords can create listings" ON listings FOR INSERT WITH CHECK (auth.uid() = landlord_id);
CREATE POLICY "Landlords can update own listings" ON listings FOR UPDATE USING (auth.uid() = landlord_id);
CREATE POLICY "Landlords can delete own listings" ON listings FOR DELETE USING (auth.uid() = landlord_id);

-- Everyone can view marketplace items, but only sellers can create/update their own
CREATE POLICY "Everyone can view marketplace items" ON marketplace_items FOR SELECT USING (true);
CREATE POLICY "Sellers can create items" ON marketplace_items FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own items" ON marketplace_items FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete own items" ON marketplace_items FOR DELETE USING (auth.uid() = seller_id);

-- Users can manage their own wishlist
CREATE POLICY "Users can view own wishlist" ON wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Everyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = reviewer_id);

-- Messages policies
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can create messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update read status" ON messages FOR UPDATE USING (auth.uid() = receiver_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (assuming you have a way to identify admins)
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all users" ON users FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
