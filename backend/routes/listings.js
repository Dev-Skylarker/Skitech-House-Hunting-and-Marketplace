const express = require('express');
const router = express.Router();

// Mock listings data
const mockListings = [
  {
    id: 'h1',
    title: 'Spacious Bedsitter near Campus Gate',
    houseType: 'bedsitter',
    location: 'Kangaru Road',
    price: 5000,
    deposit: 5000,
    description: 'A clean and spacious bedsitter just 5 minutes walk from Embu main gate. Has running water and electricity included.',
    amenities: ['Water', 'Electricity', 'Security', 'Parking'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'],
    landlordName: 'John Mwangi',
    landlordId: 'u2',
    phone: '+254712345678',
    whatsapp: '+254712345678',
    verified: true,
    status: 'available',
    distance: 0.3,
    views: 245,
    rating: 4.5,
    reviewCount: 12,
    createdAt: '2026-03-01T00:00:00Z'
  },
  {
    id: 'h2',
    title: 'Modern 1BR Apartment',
    houseType: '1br',
    location: 'Embu Town Center',
    price: 12000,
    deposit: 12000,
    description: 'Fully furnished 1 bedroom apartment with modern finishes. Close to shopping centers and public transport.',
    amenities: ['Water', 'Electricity', 'WiFi', 'Furnished', 'Security'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80'],
    landlordName: 'Mary Wanjiru',
    landlordId: 'u2',
    phone: '+254723456789',
    whatsapp: '+254723456789',
    verified: true,
    status: 'available',
    distance: 1.2,
    views: 189,
    rating: 4.2,
    reviewCount: 8,
    createdAt: '2026-02-28T00:00:00Z'
  },
  {
    id: 'h3',
    title: 'Affordable Single Room',
    houseType: 'single',
    location: 'Behind Embu',
    price: 3500,
    deposit: 3500,
    description: 'Budget-friendly single room ideal for students. Shared bathroom and kitchen facilities.',
    amenities: ['Water', 'Electricity', 'Security'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'],
    landlordName: 'Peter Njeru',
    phone: '+254734567890',
    whatsapp: '+254734567890',
    verified: false,
    status: 'available',
    distance: 0.5,
    views: 312,
    rating: 3.8,
    reviewCount: 5,
    createdAt: '2026-03-03T00:00:00Z'
  }
];

// GET /api/listings - Get all listings
router.get('/', (req, res) => {
  const { type, location, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
  
  let filteredListings = [...mockListings];
  
  // Apply filters
  if (type) {
    filteredListings = filteredListings.filter(listing => listing.houseType === type);
  }
  if (location) {
    filteredListings = filteredListings.filter(listing => 
      listing.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  if (minPrice) {
    filteredListings = filteredListings.filter(listing => listing.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    filteredListings = filteredListings.filter(listing => listing.price <= parseInt(maxPrice));
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedListings = filteredListings.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    listings: paginatedListings,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredListings.length,
      pages: Math.ceil(filteredListings.length / limit)
    }
  });
});

// GET /api/listings/:id - Get listing by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const listing = mockListings.find(l => l.id === id);
  
  if (!listing) {
    return res.status(404).json({
      success: false,
      error: 'Listing not found'
    });
  }
  
  // Increment views (mock)
  listing.views += 1;
  
  res.json({
    success: true,
    listing
  });
});

// POST /api/listings - Create new listing
router.post('/', (req, res) => {
  const newListing = {
    id: `h${mockListings.length + 1}`,
    ...req.body,
    status: 'pending',
    views: 0,
    createdAt: new Date().toISOString()
  };
  
  mockListings.push(newListing);
  
  res.status(201).json({
    success: true,
    listing: newListing,
    message: 'Listing created successfully'
  });
});

// PUT /api/listings/:id - Update listing
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const listingIndex = mockListings.findIndex(l => l.id === id);
  if (listingIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Listing not found'
    });
  }
  
  mockListings[listingIndex] = { ...mockListings[listingIndex], ...updates };
  
  res.json({
    success: true,
    listing: mockListings[listingIndex],
    message: 'Listing updated successfully'
  });
});

// DELETE /api/listings/:id - Delete listing
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const listingIndex = mockListings.findIndex(l => l.id === id);
  
  if (listingIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Listing not found'
    });
  }
  
  mockListings.splice(listingIndex, 1);
  
  res.json({
    success: true,
    message: 'Listing deleted successfully'
  });
});

// GET /api/listings/types - Get available house types
router.get('/types', (req, res) => {
  const types = ['bedsitter', 'single', '1br', '2br', '3br'];
  
  res.json({
    success: true,
    types
  });
});

module.exports = router;
