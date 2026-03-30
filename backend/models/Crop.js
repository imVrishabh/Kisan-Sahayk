/**
 * models/Crop.js — Crop listing schema
 */
const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
    {
        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Farmer ID is required'],
        },
        farmerName: {
            type: String,
            required: [true, 'Farmer name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        phoneNumber: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
            match: [/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'],
        },
        cropType: {
            type: String,
            required: [true, 'Crop type is required'],
            enum: {
                values: ['Rice', 'Paddy', 'Wheat', 'Daal'],
                message: '{VALUE} is not a supported crop type',
            },
        },
        variety: {
            type: String,
            trim: true,
        },
        quantity: {
            type: String,
            required: [true, 'Quantity is required (e.g., "50 Quintal")'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price per quintal is required'],
            min: [1, 'Price must be at least ₹1'],
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        district: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        photoUrl: {
            type: String, // base64 data URI or cloud URL
            default: null,
        },
        status: {
            type: String,
            enum: ['available', 'sold', 'discontinued'],
            default: 'available',
        },
        quality: {
            type: String,
            enum: ['standard', 'premium', 'organic'],
            default: 'standard',
        },
        harvestDate: {
            type: Date,
        },
        storageLocation: {
            type: String,
            trim: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Indexes
cropSchema.index({ farmerId: 1 });
cropSchema.index({ cropType: 1 });
cropSchema.index({ location: 1 });
cropSchema.index({ status: 1 });
cropSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Crop', cropSchema);
