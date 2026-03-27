/**
 * middleware/errorHandler.js — Centralised Express error handler.
 *
 * Catches all errors passed via next(err).
 * Returns a consistent JSON shape: { success: false, message, stack? }
 * Stack trace is only included in development mode.
 */
module.exports = function errorHandler(err, _req, res, _next) {
  const isDev = process.env.NODE_ENV !== 'production';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // MongoDB duplicate key (unique constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    return res.status(409).json({
      success: false,
      message: `Duplicate value for field: ${field}`,
    });
  }

  // Mongoose validation (shouldn't reach here since routes handle it, but safety net)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(422).json({ success: false, message: messages.join('; ') });
  }

  // Default 500
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(isDev && { stack: err.stack }),
  });
};
