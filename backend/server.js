/**
 * server.js — Express application entry point.
 *
 * Loads env variables → connects to MongoDB → mounts routes → starts HTTP server.
 */
require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const connectDB = require('./db');
const cropRoutes  = require('./routes/cropRoutes');
const priceRoutes = require('./routes/priceRoutes');
const errorHandler = require('./middleware/errorHandler');

// ── Boot ─────────────────────────────────────────────────────────────────────
connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

// ── Core Middleware ───────────────────────────────────────────────────────────
// CORS: allow only the configured frontend origin(s)
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON bodies. Max 5mb to accommodate base64 crop photos.
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health-check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', ts: new Date().toISOString() })
);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/crops',  cropRoutes);
app.use('/api/prices', priceRoutes);

// ── 404 Catch-all ─────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// ── Centralised Error Handler ─────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () =>
  console.log(`🚀  Kisan Sahayk API running on http://localhost:${PORT}`)
);

// Graceful shutdown
process.on('SIGINT', async () => {
  const mongoose = require('mongoose');
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
