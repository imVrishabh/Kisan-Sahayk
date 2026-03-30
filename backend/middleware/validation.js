/**
 * middleware/validation.js — Request validation middleware
 */
const { validationResult, body, param } = require('express-validator');

exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map((err) => err.msg);
        return res.status(422).json({ success: false, message: messages.join('; ') });
    }
    next();
};

// Crop validation rules
exports.validateCrop = [
    body('farmerName').trim().notEmpty().withMessage('Farmer name is required'),
    body('phoneNumber')
        .matches(/^[6-9]\d{9}$/)
        .withMessage('Enter a valid 10-digit Indian mobile number'),
    body('cropType')
        .isIn(['Rice', 'Paddy', 'Wheat', 'Daal'])
        .withMessage('Invalid crop type'),
    body('quantity').trim().notEmpty().withMessage('Quantity is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('location').trim().notEmpty().withMessage('Location is required'),
];

// User registration validation
exports.validateUserRegistration = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('phoneNumber')
        .optional()
        .matches(/^[6-9]\d{9}$/)
        .withMessage('Enter a valid 10-digit Indian mobile number'),
];

// User login validation
exports.validateUserLogin = [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Market price update validation
exports.validateMarketPrice = [
    body('min').isNumeric().withMessage('Min price must be a number'),
    body('max').isNumeric().withMessage('Max price must be a number'),
    body('avg').isNumeric().withMessage('Average price must be a number'),
    body('change').optional().isNumeric().withMessage('Change must be a number'),
];

// ObjectId validation
exports.validateObjectId = [
    param('id').isMongoId().withMessage('Invalid ID format'),
];
