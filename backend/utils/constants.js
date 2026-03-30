/**
 * utils/constants.js — Application constants
 */

const CROP_TYPES = ['Rice', 'Paddy', 'Wheat', 'Daal'];

const CROP_QUALITIES = ['standard', 'premium', 'organic'];

const CROP_STATUS = ['available', 'sold', 'discontinued'];

const USER_ROLES = ['farmer', 'buyer', 'admin'];

const SORT_OPTIONS = {
    crops: {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        price_asc: { price: 1 },
        price_desc: { price: -1 },
        quality: { quality: 1 },
    },
    prices: {
        crop: { crop: 1, state: 1 },
        price_asc: { avg: 1 },
        price_desc: { avg: -1 },
        highest: { max: -1 },
        lowest: { min: 1 },
        updated: { updatedAt: -1 },
    },
};

const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Not authorized to access this route',
    FORBIDDEN: 'Admin access only',
    NOT_FOUND: 'Resource not found',
    INVALID_ID: 'Invalid ID format',
    DUPLICATE_EMAIL: 'Email already registered',
    DUPLICATE_PHONENUMBER: 'Phone number already registered',
    INVALID_CREDENTIALS: 'Invalid email or password',
    INVALID_TOKEN: 'Token is not valid',
    TOKEN_EXPIRED: 'Token has expired',
};

const API_RESPONSE = {
    success: (message, data = null, statusCode = 200) => ({
        success: true,
        message,
        data,
        statusCode,
    }),
    error: (message, statusCode = 500) => ({
        success: false,
        message,
        statusCode,
    }),
};

module.exports = {
    CROP_TYPES,
    CROP_QUALITIES,
    CROP_STATUS,
    USER_ROLES,
    SORT_OPTIONS,
    ERROR_MESSAGES,
    API_RESPONSE,
};
