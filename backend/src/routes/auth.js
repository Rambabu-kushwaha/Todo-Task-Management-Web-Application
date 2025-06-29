const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const router = express.Router();

// Simple in-memory storage for testing when MongoDB is not available
const inMemoryUsers = new Map();
let userIdCounter = 1;

// Check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }),
  async (req, res) => {
    try {
      const token = generateToken(req.user._id);
      
      // Update last login
      await req.user.updateLastLogin();
      
      // Redirect to frontend with token - use port 3000 since that's where frontend is running
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/error`);
    }
  }
);

// Register new user
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('username').optional().isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input',
        details: errors.array()
      });
    }

    const { name, email, password, username } = req.body;

    // Use in-memory storage if MongoDB is not connected
    if (!isMongoConnected()) {
      // Check if user already exists in memory
      const existingUser = Array.from(inMemoryUsers.values()).find(
        user => user.email === email || user.username === username
      );

      if (existingUser) {
        return res.status(400).json({
          error: 'User already exists',
          message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user in memory
      const newUser = {
        _id: userIdCounter++,
        name,
        email,
        password: hashedPassword,
        username: username || null,
        isEmailVerified: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
        profile: {
          _id: userIdCounter - 1,
          name,
          email,
          username: username || null,
          isEmailVerified: false,
          createdAt: new Date()
        }
      };

      inMemoryUsers.set(newUser._id, newUser);

      // Generate token
      const token = generateToken(newUser._id);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: newUser.profile
      });
      return;
    }

    // Original MongoDB logic
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      username: username || null,
      isEmailVerified: false
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.profile
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration'
    });
  }
});

// Login user
router.post('/login', [
  body('identifier').notEmpty().withMessage('Email or username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input',
        details: errors.array()
      });
    }

    const { identifier, password } = req.body;

    // Use in-memory storage if MongoDB is not connected
    if (!isMongoConnected()) {
      // Find user by email or username in memory
      const user = Array.from(inMemoryUsers.values()).find(
        user => user.email === identifier || user.username === identifier
      );

      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email/username or password is incorrect'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          error: 'Account deactivated',
          message: 'Your account has been deactivated'
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email/username or password is incorrect'
        });
      }

      // Update last login
      user.lastLoginAt = new Date();
      user.updatedAt = new Date();

      // Generate token
      const token = generateToken(user._id);

      res.json({
        message: 'Login successful',
        token,
        user: user.profile
      });
      return;
    }

    // Original MongoDB logic
    const user = await User.findByEmailOrUsername(identifier);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email/username or password is incorrect'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account deactivated',
        message: 'Your account has been deactivated'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email/username or password is incorrect'
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: user.profile
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login'
    });
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Authentication token is required'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Use in-memory storage if MongoDB is not connected
    if (!isMongoConnected()) {
      const user = inMemoryUsers.get(decoded.userId);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid token',
          message: 'User not found'
        });
      }

      res.json({
        user: user.profile
      });
      return;
    }

    // Original MongoDB logic
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'User not found'
      });
    }

    res.json({
      user: user.profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid or expired token'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({
    message: 'Logout successful'
  });
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Authentication token is required'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'User not found'
      });
    }

    // Generate new token
    const newToken = generateToken(user._id);

    res.json({
      message: 'Token refreshed successfully',
      token: newToken,
      user: user.profile
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      error: 'Token refresh failed',
      message: 'Invalid or expired token'
    });
  }
});

// Forgot password (placeholder for email functionality)
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please provide a valid email address'
      });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // TODO: Implement email sending functionality
    // For now, just return success message
    res.json({
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Password reset failed',
      message: 'An error occurred while processing your request'
    });
  }
});

module.exports = router; 