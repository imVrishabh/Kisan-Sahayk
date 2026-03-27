/**
 * models/MarketPrice.js — Mongoose schema for Mandi price rows.
 *
 * One document = one row in the market rates table.
 * Admin can update min/max/avg/change via PUT /api/prices/:id.
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
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true, min: 0 },
    avg: { type: Number, required: true, min: 0 },
    // Positive = price went up, negative = went down, 0 = unchanged
    change: { type: Number, default: 0 },
    emoji: { type: String, default: '🌾' },
  },
  { timestamps: true }
);

marketPriceSchema.index({ crop: 1 });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
