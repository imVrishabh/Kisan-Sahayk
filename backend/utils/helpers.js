/**
 * utils/helpers.js — Helper functions
 */

/**
 * Validate Indian phone number
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} - True if valid
 */
function isValidPhoneNumber(phoneNumber) {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(phoneNumber);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
}

/**
 * Format price with currency
 * @param {number} price - Price to format
 * @param {string} currency - Currency code (default: INR)
 * @returns {string} - Formatted price string
 */
function formatPrice(price, currency = 'INR') {
    const symbols = {
        INR: '₹',
        USD: '$',
        EUR: '€',
    };
    const symbol = symbols[currency] || currency;
    return `${symbol}${price.toLocaleString()}`;
}

/**
 * Calculate percentage change
 * @param {number} oldValue - Old value
 * @param {number} newValue - New value
 * @returns {number} - Percentage change
 */
function calculatePercentageChange(oldValue, newValue) {
    if (oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Get trend emoji based on price change
 * @param {number} change - Price change value
 * @returns {string} - Emoji representing trend
 */
function getTrendEmoji(change) {
    if (change > 0) return '📈'; // Going up
    if (change < 0) return '📉'; // Going down
    return '➡️'; // Flat
}

/**
 * Paginate array
 * @param {array} array - Array to paginate
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {object} - Paginated data with metadata
 */
function paginate(array, page = 1, limit = 10) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;
    const total = array.length;

    return {
        data: array.slice(skip, skip + limitNum),
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum),
            hasNextPage: skip + limitNum < total,
            hasPrevPage: pageNum > 1,
        },
    };
}

/**
 * Generate random ID
 * @returns {string} - Random ID
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitize user object (remove sensitive fields)
 * @param {object} user - User object
 * @returns {object} - Sanitized user object
 */
function sanitizeUser(user) {
    const { password, __v, ...sanitized } = user.toObject ? user.toObject() : user;
    return sanitized;
}

/**
 * Check if value exists in array (case-insensitive)
 * @param {array} array - Array to check
 * @param {string} value - Value to find
 * @returns {boolean} - True if found
 */
function containsIgnoreCase(array, value) {
    return array.some((item) => item.toLowerCase() === value.toLowerCase());
}

module.exports = {
    isValidPhoneNumber,
    isValidEmail,
    formatPrice,
    calculatePercentageChange,
    getTrendEmoji,
    paginate,
    generateId,
    sanitizeUser,
    containsIgnoreCase,
};
