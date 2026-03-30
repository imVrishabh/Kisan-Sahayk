/**
 * routes/authRoutes.js — Authentication routes
 */
const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin, handleValidationErrors } = require('../middleware/validation');

// Public routes
router.post('/register', validateUserRegistration, handleValidationErrors, register);
router.post('/login', validateUserLogin, handleValidationErrors, login);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
