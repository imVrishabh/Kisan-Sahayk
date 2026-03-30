/**
 * routes/priceRoutes.js — Market price routes
 */
const express = require('express');
const router = express.Router();
const {
    getAllPrices,
    getPricesByCrop,
    getAveragePrice,
    getPriceById,
    createPrice,
    updatePrice,
    deletePrice,
    bulkUpdatePrices,
} = require('../controllers/priceController');
const { protect, adminOnly } = require('../middleware/auth');
const { validateMarketPrice, handleValidationErrors, validateObjectId } = require('../middleware/validation');

// Public routes
router.get('/', getAllPrices);
router.get('/crop/:crop', getPricesByCrop);
router.get('/average/:crop', getAveragePrice);
router.get('/:id', validateObjectId, handleValidationErrors, getPriceById);

// Admin only routes
router.post('/', protect, adminOnly, validateMarketPrice, handleValidationErrors, createPrice);
router.put('/:id', protect, adminOnly, validateObjectId, handleValidationErrors, validateMarketPrice, updatePrice);
router.delete('/:id', protect, adminOnly, validateObjectId, handleValidationErrors, deletePrice);
router.put('/bulk/update', protect, adminOnly, bulkUpdatePrices);

module.exports = router;
