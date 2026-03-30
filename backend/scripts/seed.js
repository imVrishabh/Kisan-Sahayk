/**
 * scripts/seed.js — Database seeding script
 *
 * Populates the database with sample data for development and testing.
 * Run with: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Crop = require('../models/Crop');
const MarketPrice = require('../models/MarketPrice');

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Crop.deleteMany({});
        await MarketPrice.deleteMany({});
        console.log('✅ Cleared existing data');

        // ── Create Users ──────────────────────────────────────────────────────
        const users = await User.create([
            {
                name: 'Raj Kumar',
                email: 'raj@example.com',
                password: 'password123',
                phoneNumber: '9876543210',
                role: 'farmer',
                location: 'Punjab',
                isVerified: true,
            },
            {
                name: 'Priya Singh',
                email: 'priya@example.com',
                password: 'password123',
                phoneNumber: '9876543211',
                role: 'farmer',
                location: 'Haryana',
                isVerified: true,
            },
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'admin123',
                phoneNumber: '9876543212',
                role: 'admin',
                isVerified: true,
            },
        ]);
        console.log('✅ Created users:', users.length);

        // ── Create Crops ──────────────────────────────────────────────────────
        const crops = await Crop.create([
            {
                farmerId: users[0]._id,
                farmerName: 'Raj Kumar',
                phoneNumber: '9876543210',
                cropType: 'Rice',
                variety: 'Basmati',
                quantity: '50 Quintal',
                price: 2500,
                location: 'Jalandhar',
                district: 'Jalandhar',
                state: 'Punjab',
                description: 'Premium quality basmati rice, freshly harvested',
                quality: 'premium',
                harvestDate: new Date('2026-03-15'),
                status: 'available',
                isVerified: true,
            },
            {
                farmerId: users[0]._id,
                farmerName: 'Raj Kumar',
                phoneNumber: '9876543210',
                cropType: 'Wheat',
                variety: 'HD-2967',
                quantity: '30 Quintal',
                price: 2200,
                location: 'Jalandhar',
                district: 'Jalandhar',
                state: 'Punjab',
                description: 'High yield wheat variety',
                quality: 'standard',
                harvestDate: new Date('2026-03-20'),
                status: 'available',
                isVerified: true,
            },
            {
                farmerId: users[1]._id,
                farmerName: 'Priya Singh',
                phoneNumber: '9876543211',
                cropType: 'Daal',
                variety: 'Moong',
                quantity: '25 Quintal',
                price: 5500,
                location: 'Faridabad',
                district: 'Faridabad',
                state: 'Haryana',
                description: 'Organic moong dal',
                quality: 'organic',
                harvestDate: new Date('2026-02-28'),
                status: 'available',
                isVerified: true,
            },
            {
                farmerId: users[1]._id,
                farmerName: 'Priya Singh',
                phoneNumber: '9876543211',
                cropType: 'Paddy',
                variety: 'PR-106',
                quantity: '40 Quintal',
                price: 2100,
                location: 'Faridabad',
                district: 'Faridabad',
                state: 'Haryana',
                description: 'Good quality paddy',
                quality: 'standard',
                harvestDate: new Date('2026-03-10'),
                status: 'available',
                isVerified: true,
            },
        ]);
        console.log('✅ Created crops:', crops.length);

        // ── Create Market Prices ─────────────────────────────────────────────
        const prices = await MarketPrice.create([
            {
                crop: 'Rice',
                variety: 'Basmati',
                state: 'Punjab',
                district: 'Jalandhar',
                mandi: 'Jalandhar Mandi',
                min: 2400,
                max: 2600,
                avg: 2500,
                change: 50,
                changePercent: 2.04,
            },
            {
                crop: 'Rice',
                variety: 'Basmati',
                state: 'Haryana',
                district: 'Hisar',
                mandi: 'Hisar Mandi',
                min: 2350,
                max: 2550,
                avg: 2450,
                change: 30,
                changePercent: 1.24,
            },
            {
                crop: 'Wheat',
                variety: 'HD-2967',
                state: 'Punjab',
                district: 'Ludhiana',
                mandi: 'Ludhiana Mandi',
                min: 2100,
                max: 2300,
                avg: 2200,
                change: 0,
                changePercent: 0,
            },
            {
                crop: 'Wheat',
                variety: 'HD-2967',
                state: 'Haryana',
                district: 'Karnal',
                mandi: 'Karnal Mandi',
                min: 2050,
                max: 2250,
                avg: 2150,
                change: -50,
                changePercent: -2.27,
            },
            {
                crop: 'Daal',
                variety: 'Moong',
                state: 'Haryana',
                district: 'Faridabad',
                mandi: 'Faridabad Mandi',
                min: 5300,
                max: 5700,
                avg: 5500,
                change: 100,
                changePercent: 1.85,
            },
            {
                crop: 'Daal',
                variety: 'Moong',
                state: 'Maharashtra',
                district: 'Nashik',
                mandi: 'Nashik Mandi',
                min: 5400,
                max: 5800,
                avg: 5600,
                change: 60,
                changePercent: 1.08,
            },
            {
                crop: 'Paddy',
                variety: 'PR-106',
                state: 'Haryana',
                district: 'Faridabad',
                mandi: 'Faridabad Mandi',
                min: 2000,
                max: 2200,
                avg: 2100,
                change: 0,
                changePercent: 0,
            },
            {
                crop: 'Paddy',
                variety: 'PR-106',
                state: 'Punjab',
                district: 'Patiala',
                mandi: 'Patiala Mandi',
                min: 1950,
                max: 2150,
                avg: 2050,
                change: -30,
                changePercent: -1.44,
            },
        ]);
        console.log('✅ Created market prices:', prices.length);

        console.log(`
    ╔════════════════════════════════════════════════════╗
    ║   ✅  Database seeding completed!                  ║
    ║   Users: ${users.length}                                    ║
    ║   Crops: ${crops.length}                                    ║
    ║   Market Prices: ${prices.length}                           ║
    ╚════════════════════════════════════════════════════╝
    
    📝 Sample Credentials:
    
    Farmer Account:
    Email: raj@example.com
    Password: password123
    
    Admin Account:
    Email: admin@example.com
    Password: admin123
    `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

seedData();
