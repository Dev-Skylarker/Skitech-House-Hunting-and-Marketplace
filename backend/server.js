const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Skitech Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/marketplace', require('./routes/marketplace'));
app.use('/api/upload', require('./routes/upload'));

// API documentation route
app.get('/api', (req, res) => {
  res.json({
    message: 'Skitech House Hunting API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/logout': 'Logout user',
        'GET /api/auth/me': 'Get current user',
        'POST /api/auth/forgot-password': 'Request password reset',
        'POST /api/auth/reset-password': 'Reset password'
      },
      users: {
        'GET /api/users': 'Get all users (admin)',
        'GET /api/users/:id': 'Get user by ID',
        'PUT /api/users/:id': 'Update user profile',
        'DELETE /api/users/:id': 'Delete user (admin)',
        'GET /api/users/:id/listings': "Get user's listings",
        'GET /api/users/:id/wishlist': "Get user's wishlist"
      },
      listings: {
        'GET /api/listings': 'Get all listings with filters',
        'GET /api/listings/:id': 'Get listing by ID',
        'POST /api/listings': 'Create new listing',
        'PUT /api/listings/:id': 'Update listing',
        'DELETE /api/listings/:id': 'Delete listing',
        'GET /api/listings/types': 'Get available house types'
      },
      marketplace: {
        'GET /api/marketplace': 'Get all marketplace items with filters',
        'GET /api/marketplace/:id': 'Get item by ID',
        'POST /api/marketplace': 'Create new marketplace item',
        'PUT /api/marketplace/:id': 'Update marketplace item',
        'DELETE /api/marketplace/:id': 'Delete marketplace item',
        'GET /api/marketplace/categories': 'Get available categories',
        'GET /api/marketplace/conditions': 'Get available conditions'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Skitech Backend running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
});
