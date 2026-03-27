/**
 * routes/cropRoutes.js — Full CRUD for crop listings.
 *
 * GET    /api/crops          — all crops (filterable by ?type= and ?q=)
 * GET    /api/crops/:id      — single crop
 * POST   /api/crops          — create new listing
 * PUT    /api/crops/:id      — update listing (admin)
 * DELETE /api/crops/:id      — delete listing (admin)
 */
const express = require('express');
const mongoose = require('mongoose');
const Crop = require('../models/Crop');

const router = express.Router();

/* ── Helper: validate Mongo ObjectId ──────────────────────── */
function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/* ─────────────────────────────────────────────────────────────
   GET /api/crops
   Query params:
     type  – filter by cropType (Rice | Paddy | Wheat | Daal)
     q     – search farmerName, location or cropType
     sort  – 'newest' (default) | 'price_asc' | 'price_desc'
   ───────────────────────────────────────────────────────────── */
router.get('/', async (req, res, next) => {
  try {
    const { type, q, sort = 'newest' } = req.query;

    // Build filter object
    const filter = {};
    if (type && ['Rice', 'Paddy', 'Wheat', 'Daal'].includes(type)) {
      filter.cropType = type;
    }
    if (q && q.trim()) {
      const rx = new RegExp(q.trim(), 'i');
      filter.$or = [{ farmerName: rx }, { location: rx }, { cropType: rx }];
    }

    // Sort options
    const sortMap = {
      newest:     { createdAt: -1 },
      price_asc:  { price: 1 },
      price_desc: { price: -1 },
    };
    const sortOption = sortMap[sort] || sortMap.newest;

    const crops = await Crop.find(filter).sort(sortOption).lean();
    res.json({ success: true, count: crops.length, data: crops });
  } catch (err) {
    next(err);
  }
});

/* ─────────────────────────────────────────────────────────────
   GET /api/crops/:id — single listing
   ───────────────────────────────────────────────────────────── */
router.get('/:id', async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid crop ID' });
    }
    const crop = await Crop.findById(req.params.id).lean();
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }
    res.json({ success: true, data: crop });
  } catch (err) {
    next(err);
  }
});

/* ─────────────────────────────────────────────────────────────
   POST /api/crops — create a new crop listing
   Body: { farmerName, phoneNumber, cropType, quantity, price, location, photoUrl? }
   ───────────────────────────────────────────────────────────── */
router.post('/', async (req, res, next) => {
  try {
    const { farmerName, phoneNumber, cropType, quantity, price, location, photoUrl } = req.body;

    const crop = await Crop.create({
      farmerName, phoneNumber, cropType,
      quantity, price, location,
      photoUrl: photoUrl || '',
    });

    res.status(201).json({ success: true, data: crop });
  } catch (err) {
    // Mongoose validation errors → 422
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(422).json({ success: false, message: messages.join('; ') });
    }
    next(err);
  }
});

/* ─────────────────────────────────────────────────────────────
   PUT /api/crops/:id — update a listing (admin operation)
   Partial update: only provided fields are changed.
   ───────────────────────────────────────────────────────────── */
router.put('/:id', async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid crop ID' });
    }

    // Only allow safe fields to be updated (no _id, __v drift)
    const allowed = ['farmerName', 'phoneNumber', 'cropType', 'quantity', 'price', 'location', 'photoUrl'];
    const updates = {};
    allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    const crop = await Crop.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }
    res.json({ success: true, data: crop });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(422).json({ success: false, message: messages.join('; ') });
    }
    next(err);
  }
});

/* ─────────────────────────────────────────────────────────────
   DELETE /api/crops/:id — remove a listing (admin operation)
   ───────────────────────────────────────────────────────────── */
router.delete('/:id', async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid crop ID' });
    }

    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }
    res.json({ success: true, message: 'Listing deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
