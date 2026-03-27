/**
 * routes/priceRoutes.js — Market price endpoints.
 *
 * GET /api/prices        — all Mandi price rows (optionally filtered by ?crop=Rice)
 * PUT /api/prices/:id    — admin: update a single price row
 */
const express = require('express');
const mongoose = require('mongoose');
const MarketPrice = require('../models/MarketPrice');

const router = express.Router();

/* ─────────────────────────────────────────────────────────────
   GET /api/prices
   Query: ?crop=Rice  – filter by crop type
   ───────────────────────────────────────────────────────────── */
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    const validCrops = ['Rice', 'Paddy', 'Wheat', 'Daal'];
    if (req.query.crop && validCrops.includes(req.query.crop)) {
      filter.crop = req.query.crop;
    }

    const prices = await MarketPrice.find(filter).sort({ crop: 1 }).lean();
    res.json({ success: true, count: prices.length, data: prices });
  } catch (err) {
    next(err);
  }
});

/* ─────────────────────────────────────────────────────────────
   PUT /api/prices/:id — update a price row (admin operation)
   Allowed fields: min, max, avg, change, variety, state
   ───────────────────────────────────────────────────────────── */
router.put('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid price ID' });
    }

    const allowed = ['min', 'max', 'avg', 'change', 'variety', 'state'];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const price = await MarketPrice.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!price) {
      return res.status(404).json({ success: false, message: 'Price record not found' });
    }
    res.json({ success: true, data: price });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(422).json({ success: false, message: messages.join('; ') });
    }
    next(err);
  }
});

module.exports = router;
