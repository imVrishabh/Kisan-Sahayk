/**
 * config/db.js — MongoDB connection configuration
 */
const mongoose = require('mongoose');

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅  MongoDB connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌  MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
}

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
});

module.exports = connectDB;
