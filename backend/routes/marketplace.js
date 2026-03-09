const express = require('express');
const router = express.Router();

// Mock marketplace items
const mockMarketplaceItems = [
  {
    id: 'i1',
    title: 'iPhone 12 Pro - Excellent Condition',
    category: 'electronics',
    price: 45000,
    condition: 'like-new',
    description: 'iPhone 12 Pro 128GB, excellent condition, barely used. Comes with original box and charger.',
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80'],
    sellerName: 'John Student',
    sellerId: 'u1',
    phone: '+254712345678',
    whatsapp: '+254712345678',
    status: 'active',
    views: 156,
    createdAt: '2026-03-01T00:00:00Z'
  },
  {
    id: 'i2',
    title: 'Study Desk and Chair',
    category: 'furniture',
    price: 8000,
    condition: 'used',
    description: 'Wooden study desk with comfortable chair. Perfect for students. Some minor scratches but fully functional.',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80'],
    sellerName: 'Mary Wanjiru',
    sellerId: 'u2',
    phone: '+254723456789',
    whatsapp: '+254723456789',
    status: 'active',
    views: 89,
    createdAt: '2026-02-28T00:00:00Z'
  },
  {
    id: 'i3',
    title: 'Introduction to Programming Textbooks',
    category: 'books',
    price: 2500,
    condition: 'good',
    description: 'Set of 5 programming textbooks including C++, Java, Python. Good condition with some highlighting.',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'],
    sellerName: 'Peter Njeru',
    phone: '+254734567890',
    whatsapp: '+254734567890',
    status: 'active',
    views: 67,
    createdAt: '2026-03-03T00:00:00Z'
  },
  {
    id: 'i4',
    title: 'Electric Kettle',
    category: 'appliances',
    price: 1500,
    condition: 'new',
    description: 'Brand new electric kettle, 1.7L capacity. Still in box, never used.',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'],
    sellerName: 'Jane Landlord',
    sellerId: 'u2',
    phone: '+254723456789',
    whatsapp: '+254723456789',
    status: 'active',
    views: 45,
    createdAt: '2026-03-05T00:00:00Z'
  }
];

// GET /api/marketplace - Get all marketplace items
router.get('/', (req, res) => {
  const { category, condition, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
  
  let filteredItems = [...mockMarketplaceItems];
  
  // Apply filters
  if (category) {
    filteredItems = filteredItems.filter(item => item.category === category);
  }
  if (condition) {
    filteredItems = filteredItems.filter(item => item.condition === condition);
  }
  if (minPrice) {
    filteredItems = filteredItems.filter(item => item.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    filteredItems = filteredItems.filter(item => item.price <= parseInt(maxPrice));
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedItems = filteredItems.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    items: paginatedItems,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredItems.length,
      pages: Math.ceil(filteredItems.length / limit)
    }
  });
});

// GET /api/marketplace/:id - Get item by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const item = mockMarketplaceItems.find(i => i.id === id);
  
  if (!item) {
    return res.status(404).json({
      success: false,
      error: 'Item not found'
    });
  }
  
  // Increment views (mock)
  item.views += 1;
  
  res.json({
    success: true,
    item
  });
});

// POST /api/marketplace - Create new marketplace item
router.post('/', (req, res) => {
  const newItem = {
    id: `i${mockMarketplaceItems.length + 1}`,
    ...req.body,
    status: 'pending',
    views: 0,
    createdAt: new Date().toISOString()
  };
  
  mockMarketplaceItems.push(newItem);
  
  res.status(201).json({
    success: true,
    item: newItem,
    message: 'Marketplace item created successfully'
  });
});

// PUT /api/marketplace/:id - Update marketplace item
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const itemIndex = mockMarketplaceItems.findIndex(i => i.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Item not found'
    });
  }
  
  mockMarketplaceItems[itemIndex] = { ...mockMarketplaceItems[itemIndex], ...updates };
  
  res.json({
    success: true,
    item: mockMarketplaceItems[itemIndex],
    message: 'Item updated successfully'
  });
});

// DELETE /api/marketplace/:id - Delete marketplace item
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const itemIndex = mockMarketplaceItems.findIndex(i => i.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Item not found'
    });
  }
  
  mockMarketplaceItems.splice(itemIndex, 1);
  
  res.json({
    success: true,
    message: 'Item deleted successfully'
  });
});

// GET /api/marketplace/categories - Get available categories
router.get('/categories', (req, res) => {
  const categories = [
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'furniture', name: 'Furniture', icon: '🛋️' },
    { id: 'books', name: 'Books', icon: '📚' },
    { id: 'appliances', name: 'Appliances', icon: '🍳' },
    { id: 'clothing', name: 'Clothing', icon: '👕' },
    { id: 'sports', name: 'Sports & Fitness', icon: '⚽' },
    { id: 'other', name: 'Other', icon: '📦' }
  ];
  
  res.json({
    success: true,
    categories
  });
});

// GET /api/marketplace/conditions - Get available conditions
router.get('/conditions', (req, res) => {
  const conditions = [
    { id: 'new', name: 'New', description: 'Brand new, never used' },
    { id: 'like-new', name: 'Like New', description: 'Excellent condition, barely used' },
    { id: 'good', name: 'Good', description: 'Used but in good condition' },
    { id: 'fair', name: 'Fair', description: 'Used with visible wear' }
  ];
  
  res.json({
    success: true,
    conditions
  });
});

module.exports = router;
