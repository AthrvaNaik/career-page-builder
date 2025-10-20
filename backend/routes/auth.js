const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../utils/validators');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// POST /api/auth/register

router.post('/register', async (req, res) => {
  try {
    const { email, password, companyName } = req.body;

    
    const validationError = validateRegister(req.body);
    if (validationError) {
      console.log(validationError);
      return res.status(400).json({ 
        success: false, 
        message: validationError 
      });
    }

    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    
    const companySlug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    
    const companyExists = await Company.findOne({ companySlug });
    if (companyExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'A company with this name already exists. Please choose a different name.' 
      });
    }

    
    const company = await Company.create({
      companySlug,
      companyName,
      sections: [
        {
          id: `section-${Date.now()}-1`,
          type: 'about',
          title: 'About Us',
          content: `Welcome to ${companyName}! Tell candidates about your company's mission, vision, and what makes you unique.`,
          order: 1,
          isVisible: true
        },
        {
          id: `section-${Date.now()}-2`,
          type: 'life',
          title: `Life at ${companyName}`,
          content: 'Share what it\'s like to work at your company. Talk about your culture, work environment, and team dynamics.',
          order: 2,
          isVisible: true
        },
        {
          id: `section-${Date.now()}-3`,
          type: 'values',
          title: 'Our Values',
          content: 'What principles guide your company? Share your core values and what you stand for.',
          order: 3,
          isVisible: true
        },
        {
          id: `section-${Date.now()}-4`,
          type: 'benefits',
          title: 'Benefits & Perks',
          content: 'Highlight the benefits and perks you offer to employees.',
          order: 4,
          isVisible: true
        }
      ],
      seo: {
        metaTitle: `Careers at ${companyName}`,
        metaDescription: `Join ${companyName} and explore exciting career opportunities. View our open positions and apply today.`,
        keywords: ['careers', 'jobs', companyName.toLowerCase(), 'hiring']
      }
    });

    
    const user = await User.create({
      email,
      password,
      companySlug,
      role: 'admin'
    });

    
    company.createdBy = user._id;
    await company.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: user._id,
        email: user.email,
        companySlug: user.companySlug,
        companyName: company.companyName,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/auth/login

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const validationError = validateLogin(req.body);
    if (validationError) {
      return res.status(400).json({ 
        success: false, 
        message: validationError 
      });
    }

    
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Your account has been deactivated. Please contact support.' 
      });
    }

    
    const isPasswordMatch = await user.matchPassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const company = await Company.findOne({ companySlug: user.companySlug });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        email: user.email,
        companySlug: user.companySlug,
        companyName: company ? company.companyName : '',
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

//  GET /api/auth/me

router.get('/me', protect, async (req, res) => {
  try {
    const company = await Company.findOne({ companySlug: req.user.companySlug });
    
    res.json({
      success: true,
      data: {
        _id: req.user._id,
        email: req.user.email,
        companySlug: req.user.companySlug,
        companyName: company ? company.companyName : '',
        role: req.user.role,
        isActive: req.user.isActive,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/auth/change-password

// router.put('/change-password', protect, async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Please provide current and new password' 
//       });
//     }

//     if (newPassword.length < 6) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'New password must be at least 6 characters' 
//       });
//     }

//     const user = await User.findById(req.user._id).select('+password');

//     const isMatch = await user.matchPassword(currentPassword);
//     if (!isMatch) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Current password is incorrect' 
//       });
//     }

//     user.password = newPassword;
//     await user.save();

//     res.json({
//       success: true,
//       message: 'Password changed successfully'
//     });
//   } catch (error) {
//     console.error('Change password error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

module.exports = router;