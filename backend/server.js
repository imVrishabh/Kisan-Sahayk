/**
 * server.js — Express application entry point
 *
 * Sets up Express, connects to MongoDB, configures middleware, mounts routes,
 * and starts the HTTP server.
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const cropRoutes = require('./routes/cropRoutes');
const priceRoutes = require('./routes/priceRoutes');

// ── Boot ─────────────────────────────────────────────────────────────────────
connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

// ── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());

// Rate limiting: allow 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later',
});
app.use(limiter);

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
    cors({
        origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

// ── Logging ──────────────────────────────────────────────────────────────────
app.use(morgan('combined'));

// ── Body Parser ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) =>
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// ── API Version ──────────────────────────────────────────────────────────────
app.get('/api/version', (_req, res) =>
    res.json({ version: '1.0.0', name: 'Kisan Sahayk API' })
);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/prices', priceRoutes);

// ── 404 Catch-all ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        available_endpoints: [
            'GET /api/version',
            'GET /health',
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET /api/crops',
            'POST /api/crops (protected)',
            'GET /api/prices',
            'POST /api/prices (admin only)',
        ],
    });
});

// ── Centralized Error Handler ─────────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`
  ╔════════════════════════════════════════════════════╗
  ║   🚀  Kisan Sahayk API                              ║
  ║   Running on: http://localhost:${PORT}              ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}                     ║
  ╚════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
