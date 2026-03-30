/**
 * models/MarketPrice.js — Market rates schema
 */
const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema(
    {
        crop: {
            type: String,
            required: true,
            enum: ['Rice', 'Paddy', 'Wheat', 'Daal'],
        },
        variety: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        district: {
            type: String,
            trim: true,
        },
        mandi: {
            type: String,
            trim: true,
        },
        min: {
            type: Number,
            required: true,
            min: 0,
        },
        max: {
            type: Number,
            required: true,
            min: 0,
        },
        avg: {
            type: Number,
            required: true,
            min: 0,
        },
        // Positive = price went up, negative = went down
        change: {
            type: Number,
            default: 0,
        },
        changePercent: {
            type: Number,
            default: 0,
        },
        emoji: {
            type: String,
            default: '🌾',
        },
        currency: {
            type: String,
            default: 'INR',
        },
        unit: {
            type: String,
            default: 'Quintal',
        },
    },
    { timestamps: true }
);

// Indexes
marketPriceSchema.index({ crop: 1 });
marketPriceSchema.index({ state: 1 });
marketPriceSchema.index({ crop: 1, state: 1 });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
