/**
 * scripts/seed.js — one-time seed script.
 *
 * Run with:   node scripts/seed.js          (from the backend/ directory)
 * Or:         npm run seed                   (from backend/)
 *
 * Seeds MarketPrice collection with default Mandi rates.
 * Seeds Crop collection with sample listings.
 * Skips seeding if data already exists (idempotent).
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Crop = require('../models/Crop');
const MarketPrice = require('../models/MarketPrice');

// ── Seed data ───────────────────────────────────────────────────────────────
const PRICE_SEEDS = [
  { crop: 'Rice',  variety: 'IR-36 (Fine)',      state: 'Chhattisgarh', min: 2100, max: 2500, avg: 2350, change: 50,  emoji: '🌾' },
  { crop: 'Rice',  variety: 'HMT (Medium)',       state: 'Chhattisgarh', min: 1950, max: 2200, avg: 2080, change: -30, emoji: '🌾' },
  { crop: 'Rice',  variety: 'Sona Masuri',        state: 'Madhya Pradesh',min: 2200, max: 2600, avg: 2420, change: 80,  emoji: '🌾' },
  { crop: 'Paddy', variety: 'MTU-7029',           state: 'Chhattisgarh', min: 1800, max: 2050, avg: 1950, change: 20,  emoji: '🌿' },
  { crop: 'Paddy', variety: 'PR-106',             state: 'Madhya Pradesh',min: 1750, max: 1980, avg: 1870, change: -15, emoji: '🌿' },
  { crop: 'Wheat', variety: 'Lok-1',              state: 'Madhya Pradesh',min: 2150, max: 2450, avg: 2300, change: 40,  emoji: '🚜' },
  { crop: 'Wheat', variety: 'Sharbati',           state: 'Chhattisgarh', min: 2300, max: 2700, avg: 2520, change: 120, emoji: '🚜' },
  { crop: 'Daal',  variety: 'Chana Dal',          state: 'Madhya Pradesh',min: 4200, max: 4800, avg: 4500, change: -50, emoji: '🫘' },
  { crop: 'Daal',  variety: 'Arhar / Toor Dal',   state: 'Chhattisgarh', min: 5500, max: 6200, avg: 5800, change: 200, emoji: '🫘' },
  { crop: 'Daal',  variety: 'Moong Dal',          state: 'Madhya Pradesh',min: 6000, max: 7000, avg: 6500, change: 100, emoji: '🫘' },
];

const CROP_SEEDS = [
  { farmerName: 'Ramesh Kumar',  phoneNumber: '9098197054', cropType: 'Rice',  quantity: '80 Quintal',  price: 2350, location: 'Durg, Chhattisgarh',      photoUrl: '' },
  { farmerName: 'Sunita Yadav',  phoneNumber: '9770850156', cropType: 'Paddy', quantity: '50 Quintal',  price: 1950, location: 'Rajnandgaon, CG',          photoUrl: '' },
  { farmerName: 'Mohan Sinha',   phoneNumber: '9340001122', cropType: 'Wheat', quantity: '120 Quintal', price: 2300, location: 'Raipur, Chhattisgarh',      photoUrl: '' },
  { farmerName: 'Priya Patel',   phoneNumber: '8120334455', cropType: 'Daal',  quantity: '30 Quintal',  price: 4500, location: 'Bilaspur, Chhattisgarh',    photoUrl: '' },
  { farmerName: 'Arjun Desai',   phoneNumber: '7987665544', cropType: 'Rice',  quantity: '200 Quintal', price: 2420, location: 'Jagdalpur, Chhattisgarh',   photoUrl: '' },
  { farmerName: 'Kavita Verma',  phoneNumber: '9876554321', cropType: 'Wheat', quantity: '60 Quintal',  price: 2520, location: 'Bastar, Chhattisgarh',      photoUrl: '' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅  Connected to MongoDB for seeding…');

    // ── Market Prices ───────────────────────────────────────
    const priceCount = await MarketPrice.countDocuments();
    if (priceCount === 0) {
      await MarketPrice.insertMany(PRICE_SEEDS);
      console.log(`✅  Seeded ${PRICE_SEEDS.length} market price records`);
    } else {
      console.log(`ℹ️  Market prices already exist (${priceCount} records) — skipping`);
    }

    // ── Crop Listings ────────────────────────────────────────
    const cropCount = await Crop.countDocuments();
    if (cropCount === 0) {
      await Crop.insertMany(CROP_SEEDS);
      console.log(`✅  Seeded ${CROP_SEEDS.length} crop listings`);
    } else {
      console.log(`ℹ️  Crop listings already exist (${cropCount} records) — skipping`);
    }

    console.log('🎉  Seed complete — database is ready!');
  } catch (err) {
    console.error('❌  Seed error:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌  Connection closed');
  }
}

seed();
