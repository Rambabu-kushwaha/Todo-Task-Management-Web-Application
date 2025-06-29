const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        message: 'Please provide a valid authentication token'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and attach to request
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'Account deactivated',
        message: 'Your account has been deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'The provided token is invalid'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Your session has expired. Please login again'
      });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: 'Authentication error',
      message: 'An error occurred during authentication'
    });
  }
};

// Middleware to check if user is the owner of a resource
const requireOwnership = (resourceModel) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user._id;

      const resource = await resourceModel.findById(resourceId);
      if (!resource) {
        return res.status(404).json({ 
          error: 'Resource not found',
          message: 'The requested resource does not exist'
        });
      }

      if (resource.owner.toString() !== userId.toString()) {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'You do not have permission to access this resource'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({ 
        error: 'Authorization error',
        message: 'An error occurred while checking permissions'
      });
    }
  };
};

// Middleware to check if user has permission to access a task
const requireTaskPermission = (permission = 'read') => {
  return async (req, res, next) => {
    try {
      const taskId = req.params.id;
      const userId = req.user._id;

      const Task = require('../models/Task');
      const task = await Task.findById(taskId)
        .populate('owner', 'name email')
        .populate('sharedWith.user', 'name email');

      if (!task) {
        return res.status(404).json({ 
          error: 'Task not found',
          message: 'The requested task does not exist'
        });
      }

      if (!task.hasPermission(userId, permission)) {
        return res.status(403).json({ 
          error: 'Access denied',
          message: `You do not have ${permission} permission for this task`
        });
      }

      req.task = task;
      next();
    } catch (error) {
      console.error('Task permission check error:', error);
      return res.status(500).json({ 
        error: 'Authorization error',
        message: 'An error occurred while checking task permissions'
      });
    }
  };
};

// Middleware to check if user is admin (for admin-only routes)
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        error: 'Admin access required',
        message: 'This action requires administrator privileges'
      });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({ 
      error: 'Authorization error',
      message: 'An error occurred while checking admin status'
    });
  }
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Verify JWT token without middleware
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  authenticateToken,
  requireOwnership,
  requireTaskPermission,
  requireAdmin,
  generateToken,
  verifyToken
}; 