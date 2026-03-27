/**
 * db.js — Mongoose connection helper.
 * Call connectDB() once at server startup.
 * Emits console messages on connect/error/disconnect.
 */
const mongoose = require('mongoose');

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 7+ no longer needs these flags, but kept for clarity
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit so nodemon/PM2 can restart
  }
}

// Log disconnect events (important for prod monitoring)
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

module.exports = connectDB;
