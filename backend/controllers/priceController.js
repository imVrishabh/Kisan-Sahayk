/**
 * controllers/priceController.js — Market price logic
 */
const MarketPrice = require('../models/MarketPrice');

// Get all market prices
exports.getAllPrices = async (req, res, next) => {
    try {
        const { crop, state, sort = 'crop' } = req.query;

        // Build filter
        const filter = {};

        if (crop && ['Rice', 'Paddy', 'Wheat', 'Daal'].includes(crop)) {
            filter.crop = crop;
        }

        if (state && state.trim()) {
            filter.state = new RegExp(state.trim(), 'i');
        }

        // Sort options
        const sortMap = {
            crop: { crop: 1, state: 1 },
            price_asc: { avg: 1 },
            price_desc: { avg: -1 },
            highest: { max: -1 },
            lowest: { min: 1 },
            updated: { updatedAt: -1 },
        };
        const sortOption = sortMap[sort] || sortMap.crop;

        const prices = await MarketPrice.find(filter).sort(sortOption);

        res.status(200).json({
            success: true,
            count: prices.length,
            data: prices,
        });
    } catch (error) {
        next(error);
    }
};

// Get prices by crop type
exports.getPricesByCrop = async (req, res, next) => {
    try {
        const { crop } = req.params;

        if (!['Rice', 'Paddy', 'Wheat', 'Daal'].includes(crop)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid crop type. Must be: Rice, Paddy, Wheat, or Daal',
            });
        }

        const prices = await MarketPrice.find({ crop }).sort({ state: 1 });

        res.status(200).json({
            success: true,
            count: prices.length,
            data: prices,
        });
    } catch (error) {
        next(error);
    }
};

// Get average price for a crop
exports.getAveragePrice = async (req, res, next) => {
    try {
        const { crop } = req.params;

        if (!['Rice', 'Paddy', 'Wheat', 'Daal'].includes(crop)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid crop type',
            });
        }

        const prices = await MarketPrice.find({ crop });

        if (prices.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No prices found for ${crop}`,
            });
        }

        const avgPrice =
            prices.reduce((sum, p) => sum + p.avg, 0) / prices.length;
        const minPrice = Math.min(...prices.map((p) => p.min));
        const maxPrice = Math.max(...prices.map((p) => p.max));

        res.status(200).json({
            success: true,
            crop,
            count: prices.length,
            averagePrice: Math.round(avgPrice),
            minPrice,
            maxPrice,
            data: prices,
        });
    } catch (error) {
        next(error);
    }
};

// Get price by ID
exports.getPriceById = async (req, res, next) => {
    try {
        const price = await MarketPrice.findById(req.params.id);

        if (!price) {
            return res.status(404).json({ success: false, message: 'Price record not found' });
        }

        res.status(200).json({ success: true, data: price });
    } catch (error) {
        next(error);
    }
};

// Create market price (admin only)
exports.createPrice = async (req, res, next) => {
    try {
        const { crop, variety, state, min, max, avg, change, mandi, district } = req.body;

        // Auto-calculate change percent if not provided
        let changePercent = 0;
        if (change) {
            changePercent = ((change / avg) * 100).toFixed(2);
        }

        const price = await MarketPrice.create({
            crop,
            variety,
            state,
            min,
            max,
            avg,
            change,
            changePercent,
            mandi,
            district,
        });

        res.status(201).json({
            success: true,
            message: 'Price record created successfully',
            data: price,
        });
    } catch (error) {
        next(error);
    }
};

// Update market price (admin only)
exports.updatePrice = async (req, res, next) => {
    try {
        let price = await MarketPrice.findById(req.params.id);

        if (!price) {
            return res.status(404).json({ success: false, message: 'Price record not found' });
        }

        const { min, max, avg, change, variety, state, mandi, district } = req.body;

        // Update allowed fields
        if (min !== undefined) price.min = min;
        if (max !== undefined) price.max = max;
        if (avg !== undefined) price.avg = avg;
        if (change !== undefined) {
            price.change = change;
            price.changePercent = ((change / avg) * 100).toFixed(2);
        }
        if (variety !== undefined) price.variety = variety;
        if (state !== undefined) price.state = state;
        if (mandi !== undefined) price.mandi = mandi;
        if (district !== undefined) price.district = district;

        await price.save();

        res.status(200).json({
            success: true,
            message: 'Price updated successfully',
            data: price,
        });
    } catch (error) {
        next(error);
    }
};

// Delete market price (admin only)
exports.deletePrice = async (req, res, next) => {
    try {
        const price = await MarketPrice.findByIdAndDelete(req.params.id);

        if (!price) {
            return res.status(404).json({ success: false, message: 'Price record not found' });
        }

        res.status(200).json({ success: true, message: 'Price record deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Bulk update prices (admin only)
exports.bulkUpdatePrices = async (req, res, next) => {
    try {
        const { priceUpdates } = req.body; // Array of { id, ...updates }

        if (!Array.isArray(priceUpdates)) {
            return res
                .status(400)
                .json({ success: false, message: 'priceUpdates must be an array' });
        }

        const results = [];

        for (const update of priceUpdates) {
            const { id, ...updateData } = update;
            const price = await MarketPrice.findByIdAndUpdate(id, updateData, {
                new: true,
            });
            if (price) results.push(price);
        }

        res.status(200).json({
            success: true,
            message: `${results.length} prices updated successfully`,
            data: results,
        });
    } catch (error) {
        next(error);
    }
};
