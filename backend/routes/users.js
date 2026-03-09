const express = require('express');
const router = express.Router();

// Mock users data
const mockUsers = [
  {
    id: 'u1',
    name: 'John Student',
    email: 'john@embu.edu',
    userType: 'tenant',
    role: 'user',
    verified: true,
    phone: '+254712345678',
    location: 'Embu Town',
    bio: 'Computer Science student looking for affordable accommodation',
    createdAt: '2026-03-01T00:00:00Z'
  },
  {
    id: 'u2',
    name: 'Jane Landlord',
    email: 'jane@properties.com',
    userType: 'landlord',
    role: 'user',
    verified: true,
    phone: '+254723456789',
    location: 'Embu Town',
    bio: 'Property owner with 5+ years of experience',
    createdAt: '2026-02-28T00:00:00Z'
  }
];

// GET /api/users - Get all users (admin only)
router.get('/', (req, res) => {
  res.json({
    success: true,
    users: mockUsers.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    })
  });
});

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const user = mockUsers.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  const { password, ...userWithoutPassword } = user;
  res.json({
    success: true,
    user: userWithoutPassword
  });
});

// PUT /api/users/:id - Update user profile
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  // Update user (mock)
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
  const { password, ...userWithoutPassword } = mockUsers[userIndex];
  
  res.json({
    success: true,
    user: userWithoutPassword,
    message: 'User updated successfully'
  });
});

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const userIndex = mockUsers.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  mockUsers.splice(userIndex, 1);
  
  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// GET /api/users/:id/listings - Get user's listings
router.get('/:id/listings', (req, res) => {
  const { id } = req.params;
  
  // Mock user listings
  const listings = [
    {
      id: 'h1',
      title: 'Spacious Bedsitter near Campus',
      type: 'bedsitter',
      price: 5000,
      landlordId: id,
      status: 'available',
      createdAt: '2026-03-01T00:00:00Z'
    }
  ];
  
  res.json({
    success: true,
    listings
  });
});

// GET /api/users/:id/wishlist - Get user's wishlist
router.get('/:id/wishlist', (req, res) => {
  const { id } = req.params;
  
  // Mock wishlist
  const wishlist = [
    {
      id: 'w1',
      userId: id,
      itemId: 'h1',
      itemType: 'house',
      createdAt: '2026-03-01T00:00:00Z'
    }
  ];
  
  res.json({
    success: true,
    wishlist
  });
});

module.exports = router;
