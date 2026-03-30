/**
 * models/User.js — User schema for farmers and admins
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't include password by default
        },
        phoneNumber: {
            type: String,
            trim: true,
            match: [/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'],
        },
        role: {
            type: String,
            enum: ['farmer', 'admin', 'buyer'],
            default: 'farmer',
        },
        location: {
            type: String,
            trim: true,
        },
        profilePicture: {
            type: String, // URL or base64
            default: null,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });

module.exports = mongoose.model('User', userSchema);
