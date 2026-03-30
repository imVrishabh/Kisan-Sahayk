/**
 * routes/cropRoutes.js — Crop listing routes
 */
const express = require('express');
const router = express.Router();
const {
    getAllCrops,
    getCropById,
    createCrop,
    updateCrop,
    deleteCrop,
    getMyCrops,
    updateCropStatus,
} = require('../controllers/cropController');
const { protect, authorize } = require('../middleware/auth');
const { validateCrop, handleValidationErrors, validateObjectId } = require('../middleware/validation');

// Public routes
router.get('/', getAllCrops);
router.get('/:id', validateObjectId, handleValidationErrors, getCropById);

// Protected farmer routes
router.post('/', protect, validateCrop, handleValidationErrors, createCrop);
router.get('/my-listings', protect, getMyCrops);
router.put('/:id', protect, validateObjectId, handleValidationErrors, updateCrop);
router.put('/:id/status', protect, validateObjectId, handleValidationErrors, updateCropStatus);
router.delete('/:id', protect, validateObjectId, handleValidationErrors, deleteCrop);

module.exports = router;
