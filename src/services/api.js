/**
 * src/services/api.js — Enhanced Axios HTTP client for Kisan Sahayk backend.
 * 
 * Features:
 *   - Automatic JWT token injection in headers
 *   - Request/response interceptors
 *   - Error handling with fallback messages
 *   - Support for all backend endpoints
 */
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Create axios instance
const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request Interceptor: Add JWT token to every request ──────────────────────
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kisan_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle errors ──────────────────────────────────────
http.interceptors.response.use(
  (res) => res,
  (error) => {
    // Extract error message from backend response or fallback
    const msg =
      error.response?.data?.message ||
      error.message ||
      'Network error — check your connection';

    // Log token errors for debugging
    if (error.response?.status === 401) {
      localStorage.removeItem('kisan_token');
      localStorage.removeItem('kisan_user');
    }

    return Promise.reject(new Error(msg));
  }
);

// ──────── AUTHENTICATION API ──────────────────────────────────────────────────
export const authApi = {
  /**
   * Register new user
   * POST /api/auth/register
   */
  register: (data) =>
    http.post('/api/auth/register', data).then((r) => r.data),

  /**
   * Login user
   * POST /api/auth/login
   */
  login: (data) =>
    http.post('/api/auth/login', data).then((r) => r.data),

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  getCurrentUser: () =>
    http.get('/api/auth/me').then((r) => r.data),

  /**
   * Update user profile
   * PUT /api/auth/profile
   */
  updateProfile: (data) =>
    http.put('/api/auth/profile', data).then((r) => r.data),

  /**
   * Change password
   * PUT /api/auth/change-password
   */
  changePassword: (data) =>
    http.put('/api/auth/change-password', data).then((r) => r.data),
};

// ──────── CROPS API ───────────────────────────────────────────────────────────
export const cropsApi = {
  /**
   * Get all crops with optional filters
   * GET /api/crops
   * Query params: type, q (search), sort, page, limit, status
   */
  getAll: (params = {}) =>
    http.get('/api/crops', { params }).then((r) => r.data),

  /**
   * Get single crop by ID
   * GET /api/crops/:id
   */
  getOne: (id) =>
    http.get(`/api/crops/${id}`).then((r) => r.data),

  /**
   * Create new crop listing (authenticated)
   * POST /api/crops
   */
  create: (data) =>
    http.post('/api/crops', data).then((r) => r.data),

  /**
   * Get farmer's own crop listings (authenticated)
   * GET /api/crops/my-listings
   */
  getMyCrops: () =>
    http.get('/api/crops/my-listings').then((r) => r.data),

  /**
   * Update crop listing (authenticated, owner or admin)
   * PUT /api/crops/:id
   */
  update: (id, data) =>
    http.put(`/api/crops/${id}`, data).then((r) => r.data),

  /**
   * Update crop status (authenticated, owner or admin)
   * PUT /api/crops/:id/status
   */
  updateStatus: (id, status) =>
    http.put(`/api/crops/${id}/status`, { status }).then((r) => r.data),

  /**
   * Delete crop listing (authenticated, owner or admin)
   * DELETE /api/crops/:id
   */
  delete: (id) =>
    http.delete(`/api/crops/${id}`).then((r) => r.data),
};

// ──────── MARKET PRICES API ───────────────────────────────────────────────────
export const pricesApi = {
  /**
   * Get all market prices
   * GET /api/prices
   * Query params: crop, state, sort
   */
  getAll: (params = {}) =>
    http.get('/api/prices', { params }).then((r) => r.data),

  /**
   * Get prices for specific crop
   * GET /api/prices/crop/:crop
   */
  getByCrop: (crop) =>
    http.get(`/api/prices/crop/${crop}`).then((r) => r.data),

  /**
   * Get average price for a crop
   * GET /api/prices/average/:crop
   */
  getAverage: (crop) =>
    http.get(`/api/prices/average/${crop}`).then((r) => r.data),

  /**
   * Get single price record
   * GET /api/prices/:id
   */
  getOne: (id) =>
    http.get(`/api/prices/${id}`).then((r) => r.data),

  /**
   * Create price (admin only)
   * POST /api/prices
   */
  create: (data) =>
    http.post('/api/prices', data).then((r) => r.data),

  /**
   * Update price (admin only)
   * PUT /api/prices/:id
   */
  update: (id, data) =>
    http.put(`/api/prices/${id}`, data).then((r) => r.data),

  /**
   * Delete price (admin only)
   * DELETE /api/prices/:id
   */
  delete: (id) =>
    http.delete(`/api/prices/${id}`).then((r) => r.data),

  /**
   * Bulk update prices (admin only)
   * PUT /api/prices/bulk/update
   */
  bulkUpdate: (data) =>
    http.put('/api/prices/bulk/update', data).then((r) => r.data),
};

// ──────── HEALTH CHECK ────────────────────────────────────────────────────────
export const healthApi = {
  /**
   * Check if backend is online
   * GET /health
   */
  check: () =>
    http.get('/health').then((r) => r.data),

  /**
   * Get API version info
   * GET /api/version
   */
  getVersion: () =>
    http.get('/api/version').then((r) => r.data),
};

export default http;
