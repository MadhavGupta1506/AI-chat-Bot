const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Register
router.post('/register', [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required'),
], authController.register);

// Login
router.post('/login', authController.login);

// Get current user
router.get('/me', auth, authController.getCurrentUser);

// Update profile
router.put('/profile', auth, authController.updateProfile);

module.exports = router;
