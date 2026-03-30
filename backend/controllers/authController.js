/**
 * controllers/authController.js — Authentication logic
 */
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

// Register User
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phoneNumber, role = 'farmer', location } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        // Create user
        user = await User.create({
            name,
            email,
            password,
            phoneNumber,
            role,
            location,
        });

        const token = generateToken(user._id, user.role);

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: userResponse,
        });
    } catch (error) {
        next(error);
    }
};

// Login User
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: 'Email and password are required' });
        }

        // Get user with password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id, user.role);

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: userResponse,
        });
    } catch (error) {
        next(error);
    }
};

// Get Current User
exports.getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Update User Profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, phoneNumber, location, profilePicture } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, phoneNumber, location, profilePicture },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// Change Password
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id).select('+password');

        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ success: false, message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
};
