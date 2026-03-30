/**
 * controllers/cropController.js — Crop listing logic
 */
const Crop = require('../models/Crop');

// Get all crops (with filtering, sorting, and pagination)
exports.getAllCrops = async (req, res, next) => {
    try {
        const { type, q, sort = 'newest', page = 1, limit = 10, status = 'available' } = req.query;

        // Build filter
        const filter = { status };

        if (type && ['Rice', 'Paddy', 'Wheat', 'Daal'].includes(type)) {
            filter.cropType = type;
        }

        if (q && q.trim()) {
            const rx = new RegExp(q.trim(), 'i');
            filter.$or = [
                { farmerName: rx },
                { location: rx },
                { cropType: rx },
                { variety: rx },
            ];
        }

        // Sort options
        const sortMap = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            price_asc: { price: 1 },
            price_desc: { price: -1 },
            quality: { quality: 1 },
        };
        const sortOption = sortMap[sort] || sortMap.newest;

        // Pagination
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        const crops = await Crop.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .populate('farmerId', 'name phoneNumber location');

        const total = await Crop.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: crops.length,
            total,
            pages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            data: crops,
        });
    } catch (error) {
        next(error);
    }
};

// Get single crop
exports.getCropById = async (req, res, next) => {
    try {
        const crop = await Crop.findById(req.params.id).populate(
            'farmerId',
            'name phoneNumber location email'
        );

        if (!crop) {
            return res.status(404).json({ success: false, message: 'Crop not found' });
        }

        res.status(200).json({ success: true, data: crop });
    } catch (error) {
        next(error);
    }
};

// Create crop listing
exports.createCrop = async (req, res, next) => {
    try {
        const {
            farmerName,
            phoneNumber,
            cropType,
            variety,
            quantity,
            price,
            location,
            district,
            state,
            description,
            photoUrl,
            quality,
            harvestDate,
            storageLocation,
        } = req.body;

        const crop = await Crop.create({
            farmerId: req.user.id,
            farmerName,
            phoneNumber,
            cropType,
            variety,
            quantity,
            price,
            location,
            district,
            state,
            description,
            photoUrl,
            quality,
            harvestDate,
            storageLocation,
        });

        res.status(201).json({
            success: true,
            message: 'Crop listing created successfully',
            data: crop,
        });
    } catch (error) {
        next(error);
    }
};

// Update crop
exports.updateCrop = async (req, res, next) => {
    try {
        let crop = await Crop.findById(req.params.id);

        if (!crop) {
            return res.status(404).json({ success: false, message: 'Crop not found' });
        }

        // Check authorization - only farmer or admin can update
        if (crop.farmerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res
                .status(403)
                .json({ success: false, message: 'Not authorized to update this crop' });
        }

        crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: 'Crop updated successfully',
            data: crop,
        });
    } catch (error) {
        next(error);
    }
};

// Delete crop
exports.deleteCrop = async (req, res, next) => {
    try {
        const crop = await Crop.findById(req.params.id);

        if (!crop) {
            return res.status(404).json({ success: false, message: 'Crop not found' });
        }

        // Check authorization
        if (crop.farmerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res
                .status(403)
                .json({ success: false, message: 'Not authorized to delete this crop' });
        }

        await Crop.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: 'Crop deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get my crops (farmer's own listings)
exports.getMyCrops = async (req, res, next) => {
    try {
        const crops = await Crop.find({ farmerId: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: crops.length,
            data: crops,
        });
    } catch (error) {
        next(error);
    }
};

// Update crop status
exports.updateCropStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['available', 'sold', 'discontinued'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: available, sold, or discontinued',
            });
        }

        let crop = await Crop.findById(req.params.id);

        if (!crop) {
            return res.status(404).json({ success: false, message: 'Crop not found' });
        }

        // Check authorization
        if (crop.farmerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res
                .status(403)
                .json({ success: false, message: 'Not authorized to update this crop' });
        }

        crop.status = status;
        await crop.save();

        res.status(200).json({
            success: true,
            message: `Crop marked as ${status}`,
            data: crop,
        });
    } catch (error) {
        next(error);
    }
};
