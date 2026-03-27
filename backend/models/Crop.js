/**
 * models/Crop.js — Mongoose schema for crop listings.
 *
 * Schema fields:
 *   farmerName  – seller's full name
 *   phoneNumber – 10-digit Indian mobile number
 *   cropType    – one of four supported crops
 *   quantity    – free text e.g. "50 Quintal"
 *   price       – price per quintal in INR
 *   location    – village / district
 *   photoUrl    – base64 data URI or cloud URL (optional)
 *   date        – listing creation time
 */
const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
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
    quantity: {
      type: String,
      required: [true, 'Quantity is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be at least ₹1'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    // Stored as a data: URI (base64) or a CDN URL — optional
    photoUrl: {
      type: String,
      default: '',
    },
  },
  {
    // Automatically adds createdAt & updatedAt
    timestamps: true,
  }
);

// Index frequently queried fields for faster lookups
cropSchema.index({ cropType: 1 });
cropSchema.index({ location: 1 });
cropSchema.index({ createdAt: -1 }); // newest first

module.exports = mongoose.model('Crop', cropSchema);
