const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Verify JWT token from Supabase
const verifySupabaseToken = async (token) => {
  try {
    // For Supabase, we can verify the token using the Supabase client
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required' 
    });
  }

  try {
    // Try to verify as Supabase token first
    const user = await verifySupabaseToken(token);
    
    if (user) {
      req.user = user;
      return next();
    }

    // If Supabase verification fails, try JWT verification
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ 
          success: false, 
          error: 'Invalid or expired token' 
        });
      }
      
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Authentication failed' 
    });
  }
};

// Role-based authorization middleware
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
    }

    const userRole = req.user.user_metadata?.role || req.user.role || 'tenant';
    
    if (roles.length > 0 && !roles.includes(userRole)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Admin-only middleware
const adminOnly = authorize(['admin']);

// Landlord or Admin middleware
const landlordOrAdmin = authorize(['landlord', 'admin']);

// Tenant, Landlord, or Admin middleware (all authenticated users)
const authenticatedOnly = authorize(['tenant', 'landlord', 'admin']);

module.exports = {
  authenticateToken,
  authorize,
  adminOnly,
  landlordOrAdmin,
  authenticatedOnly,
  JWT_SECRET
};
