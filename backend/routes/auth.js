const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
        error_code: 'invalid_credentials'
      });
    }
    
    if (data.user && data.session) {
      // Convert Supabase user to our user format
      const user = {
        id: data.user.id,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
        email: data.user.email,
        role: data.user.user_metadata?.role || 'tenant',
        isVerified: data.user.email_confirmed_at != null,
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at,
        phone: data.user.phone,
        avatar: data.user.user_metadata?.avatar,
      };
      
      res.json({
        success: true,
        user,
        token: data.session.access_token
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Login failed',
        error_code: 'login_failed'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      error_code: 'server_error'
    });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, userType = 'tenant' } = req.body;
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: userType,
        },
      },
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
        error_code: 'registration_failed'
      });
    }
    
    if (data.user && data.session) {
      // Email confirmation not required, user is signed in
      const user = {
        id: data.user.id,
        name: data.user.user_metadata?.name || name,
        email: data.user.email,
        role: data.user.user_metadata?.role || userType,
        isVerified: data.user.email_confirmed_at != null,
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at,
        phone: data.user.phone,
        avatar: data.user.user_metadata?.avatar,
      };
      
      res.status(201).json({
        success: true,
        user,
        token: data.session.access_token
      });
    } else if (data.user) {
      // Email confirmation required
      const user = {
        id: data.user.id,
        name: data.user.user_metadata?.name || name,
        email: data.user.email,
        role: data.user.user_metadata?.role || userType,
        isVerified: false,
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at,
        phone: data.user.phone,
        avatar: data.user.user_metadata?.avatar,
      };
      
      res.status(201).json({
        success: true,
        user,
        message: 'Please check your email to verify your account',
        requiresEmailConfirmation: true
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Registration failed',
        error_code: 'registration_failed'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      error_code: 'server_error'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // User is already attached to req.user by authenticateToken middleware
    const user = {
      id: req.user.id,
      name: req.user.user_metadata?.name || req.user.email?.split('@')[0] || 'User',
      email: req.user.email,
      role: req.user.user_metadata?.role || 'tenant',
      isVerified: req.user.email_confirmed_at != null,
      createdAt: req.user.created_at,
      updatedAt: req.user.updated_at,
      phone: req.user.phone,
      avatar: req.user.user_metadata?.avatar,
    };
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      error_code: 'server_error'
    });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password`,
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
        error_code: 'password_reset_failed'
      });
    }
    
    res.json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      error_code: 'server_error'
    });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { newPassword } = req.body;
  
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
        error_code: 'password_update_failed'
      });
    }
    
    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      error_code: 'server_error'
    });
  }
});

module.exports = router;
