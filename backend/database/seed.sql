-- Seed data for Skitech House Hunting & Marketplace
-- Run this after creating the schema

-- Insert sample users
INSERT INTO users (id, name, email, password_hash, user_type, role, phone, location, bio, verified, email_verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'John Student', 'john@embu.edu', '$2b$10$placeholder_hash_1', 'tenant', 'user', '+254712345678', 'Embu Town', 'Computer Science student looking for affordable accommodation near campus.', true, true),
('550e8400-e29b-41d4-a716-446655440002', 'Jane Landlord', 'jane@properties.com', '$2b$10$placeholder_hash_2', 'landlord', 'user', '+254723456789', 'Embu Town', 'Property owner with 5+ years of experience providing quality housing to students.', true, true),
('550e8400-e29b-41d4-a716-446655440003', 'Admin User', 'admin@skitech.com', '$2b$10$placeholder_hash_3', 'tenant', 'admin', '+254734567890', 'Embu Town', 'System administrator for Skitech platform.', true, true),
('550e8400-e29b-41d4-a716-446655440004', 'Mary Wanjiru', 'mary.wanjiru@email.com', '$2b$10$placeholder_hash_4', 'landlord', 'user', '+254745678901', 'Kangaru Road', 'Experienced landlord with properties near Embu University.', true, true),
('550e8400-e29b-41d4-a716-446655440005', 'Peter Njeru', 'peter.njeru@email.com', '$2b$10$placeholder_hash_5', 'tenant', 'user', '+254756789012', 'Embu Town', 'Business student looking for a quiet place to study.', true, true);

-- Insert sample listings
INSERT INTO listings (id, title, description, house_type, location, price, deposit, landlord_id, landlord_name, phone, whatsapp, amenities, images, verified, status, distance, views, rating, review_count) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Spacious Bedsitter near Campus Gate', 'A clean and spacious bedsitter just 5 minutes walk from Embu main gate. Has running water and electricity included. Perfect for students who want convenience and affordability.', 'bedsitter', 'Kangaru Road', 5000.00, 5000.00, '550e8400-e29b-41d4-a716-446655440002', 'Jane Landlord', '+254723456789', '+254723456789', ARRAY['Water', 'Electricity', 'Security', 'Parking'], ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80'], true, 'available', 0.3, 245, 4.5, 12),
('660e8400-e29b-41d4-a716-446655440002', 'Modern 1BR Apartment', 'Fully furnished 1 bedroom apartment with modern finishes. Close to shopping centers and public transport. Ideal for students who want comfort and convenience.', '1br', 'Embu Town Center', 12000.00, 12000.00, '550e8400-e29b-41d4-a716-446655440004', 'Mary Wanjiru', '+254745678901', '+254745678901', ARRAY['Water', 'Electricity', 'WiFi', 'Furnished', 'Security'], ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'], true, 'available', 1.2, 189, 4.2, 8),
('660e8400-e29b-41d4-a716-446655440003', 'Affordable Single Room', 'Budget-friendly single room ideal for students. Shared bathroom and kitchen facilities. Located in a quiet neighborhood perfect for studying.', 'single', 'Behind Embu', 3500.00, 3500.00, '550e8400-e29b-41d4-a716-446655440002', 'Jane Landlord', '+254723456789', '+254723456789', ARRAY['Water', 'Electricity', 'Security'], ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'], false, 'available', 0.5, 312, 3.8, 5),
('660e8400-e29b-41d4-a716-446655440004', 'Executive 2BR Apartment', 'Luxurious 2 bedroom apartment with master ensuite. Spacious living area and modern kitchen. Perfect for students who want premium living experience.', '2br', 'Majimbo Estate', 18000.00, 18000.00, '550e8400-e29b-41d4-a716-446655440004', 'Mary Wanjiru', '+254745678901', '+254745678901', ARRAY['Water', 'Electricity', 'WiFi', 'Parking', 'Security', 'Furnished', 'Hot Water'], ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'], true, 'available', 2.0, 156, 4.8, 18),
('660e8400-e29b-41d4-a716-446655440005', 'Cozy Bedsitter with Balcony', 'Neat bedsitter with a private balcony. Well-ventilated with plenty of natural light. Great for students who want a personal outdoor space.', 'bedsitter', 'Dallas Estate', 6500.00, 6500.00, '550e8400-e29b-41d4-a716-446655440002', 'Jane Landlord', '+254723456789', '+254723456789', ARRAY['Water', 'Electricity', 'Balcony', 'Security'], ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'], false, 'available', 1.5, 98, 4.0, 6);

-- Insert sample marketplace items
INSERT INTO marketplace_items (id, title, description, category, price, condition, seller_id, seller_name, phone, whatsapp, images, status, views) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'iPhone 12 Pro - Excellent Condition', 'iPhone 12 Pro 128GB, excellent condition, barely used. Comes with original box and charger. No scratches or dents.', 'electronics', 45000.00, 'like-new', '550e8400-e29b-41d4-a716-446655440001', 'John Student', '+254712345678', '+254712345678', ARRAY['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80'], 'active', 156),
('770e8400-e29b-41d4-a716-446655440002', 'Study Desk and Chair', 'Wooden study desk with comfortable chair. Perfect for students. Some minor scratches but fully functional. Height adjustable chair.', 'furniture', 8000.00, 'used', '550e8400-e29b-41d4-a716-446655440004', 'Mary Wanjiru', '+254745678901', '+254745678901', ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80'], 'active', 89),
('770e8400-e29b-41d4-a716-446655440003', 'Introduction to Programming Textbooks', 'Set of 5 programming textbooks including C++, Java, Python. Good condition with some highlighting. Perfect for computer science students.', 'books', 2500.00, 'good', '550e8400-e29b-41d4-a716-446655440005', 'Peter Njeru', '+254756789012', '+254756789012', ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'], 'active', 67),
('770e8400-e29b-41d4-a716-446655440004', 'Electric Kettle', 'Brand new electric kettle, 1.7L capacity. Still in box, never used. Fast boiling and auto shut-off feature.', 'appliances', 1500.00, 'new', '550e8400-e29b-41d4-a716-446655440004', 'Mary Wanjiru', '+254745678901', '+254745678901', ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'], 'active', 45),
('770e8400-e29b-41d4-a716-446655440005', 'Laptop Backpack', 'Water-resistant laptop backpack with multiple compartments. Fits 15.6 inch laptop. Used for one semester.', 'other', 2000.00, 'good', '550e8400-e29b-41d4-a716-446655440001', 'John Student', '+254712345678', '+254712345678', ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'], 'active', 78);

-- Insert sample wishlist items
INSERT INTO wishlist (user_id, item_id, item_type) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'listing'),
('550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'marketplace_item'),
('550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'listing'),
('550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440003', 'marketplace_item');

-- Insert sample reviews
INSERT INTO reviews (listing_id, reviewer_id, rating, comment) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 5, 'Great location and very clean. The landlord is responsive and helpful.'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 4, 'Good value for money. Close to campus and has all basic amenities.'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 4, 'Spacious and well-furnished. A bit expensive but worth it for the comfort.'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 5, 'Excellent apartment! Modern, clean, and in a safe neighborhood. Highly recommended.');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, description, type, related_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Welcome to Skitech!', 'Your account has been created successfully. Start exploring houses and marketplace items.', 'system', NULL),
('550e8400-e29b-41d4-a716-446655440001', 'New message received', 'You have a new message regarding your listing inquiry.', 'new_message', '660e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440005', 'Price drop alert', 'A house in your wishlist has dropped its price!', 'favorite_added', '660e8400-e29b-41d4-a716-446655440003');

-- Insert sample messages
INSERT INTO messages (sender_id, receiver_id, listing_id, message, read) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Hi, I''m interested in your bedsitter near campus. Is it still available?', false),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Hello! Yes, the bedsitter is still available. Would you like to schedule a viewing?', true),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Is the 1BR apartment still available for immediate occupation?', false);

-- Update listing ratings based on reviews
UPDATE listings SET 
    rating = (
        SELECT COALESCE(AVG(rating), 0) 
        FROM reviews 
        WHERE reviews.listing_id = listings.id
    ),
    review_count = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE reviews.listing_id = listings.id
    );

-- Update some listing statuses to show variety
UPDATE listings SET status = 'taken' WHERE id = '660e8400-e29b-41d4-a716-446655440003';
UPDATE listings SET status = 'pending' WHERE id = '660e8400-e29b-41d4-a716-446655440005';

-- Update some marketplace item statuses
UPDATE marketplace_items SET status = 'sold' WHERE id = '770e8400-e29b-41d4-a716-446655440004';

-- Insert sample audit logs
INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values, ip_address, user_agent) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'CREATE', 'users', '550e8400-e29b-41d4-a716-446655440001', '{"name": "John Student", "email": "john@embu.edu"}', '127.0.0.1', 'Mozilla/5.0 (Sample User Agent)'),
('550e8400-e29b-41d4-a716-446655440002', 'CREATE', 'listings', '660e8400-e29b-41d4-a716-446655440001', '{"title": "Spacious Bedsitter near Campus Gate", "price": 5000}', '127.0.0.1', 'Mozilla/5.0 (Sample User Agent)'),
('550e8400-e29b-41d4-a716-446655440003', 'LOGIN', 'users', NULL, '{"success": true}', '127.0.0.1', 'Mozilla/5.0 (Sample User Agent)');

COMMIT;
