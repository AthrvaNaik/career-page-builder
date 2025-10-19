const jwt = require('jsonwebtoken');
const User = require('../models/User');


const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      
      token = req.headers.authorization.split(' ')[1];

      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      req.user = await User.findById(decoded.id).select('-password');

      // console.log(token);

      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({ 
          success: false, 
          message: 'User account is deactivated' 
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token' 
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Token expired' 
        });
      }
      
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token failed' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token provided' 
    });
  }
};


const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin only.' 
    });
  }
};


const checkCompanyOwnership = (req, res, next) => {
  const companySlug = req.params.slug || req.params.companySlug;
  
  if (req.user.companySlug !== companySlug) {
    return res.status(403).json({ 
      success: false, 
      message: 'Not authorized to access this company' 
    });
  }
  
  next();
};

module.exports = { protect, adminOnly, checkCompanyOwnership };