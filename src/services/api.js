/**
 * src/services/api.js — Axios HTTP client for Kisan Sahayk backend.
 *
 * Usage:
 *   import { cropsApi, pricesApi } from '../services/api';
 *   const { data } = await cropsApi.getAll({ type: 'Rice' });
 */
import axios from 'axios';

// Base URL comes from Vite env var (set VITE_API_URL in .env)
// Falls back to local backend during development.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000, // 10s timeout
  headers: { 'Content-Type': 'application/json' },
});

// ── Response interceptor: unwrap { success, data } ────────────────────────────
http.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg =
      error.response?.data?.message ||
      error.message ||
      'Network error — check your connection';
    return Promise.reject(new Error(msg));
  }
);

// ── Crops API helpers ─────────────────────────────────────────────────────────
export const cropsApi = {
  /** GET /api/crops — returns array of crop documents */
  getAll: (params = {}) =>
    http.get('/api/crops', { params }).then((r) => r.data),

  /** GET /api/crops/:id */
  getOne: (id) =>
    http.get(`/api/crops/${id}`).then((r) => r.data),

  /**
   * POST /api/crops — create listing
   * Body: { farmerName, phoneNumber, cropType, quantity, price, location, photoUrl? }
   */
  create: (body) =>
    http.post('/api/crops', body).then((r) => r.data),

  /**
   * PUT /api/crops/:id — partial update (admin)
   * Body: any subset of crop fields
   */
  update: (id, body) =>
    http.put(`/api/crops/${id}`, body).then((r) => r.data),

  /** DELETE /api/crops/:id (admin) */
  remove: (id) =>
    http.delete(`/api/crops/${id}`).then((r) => r.data),
};

// ── Market Prices API helpers ─────────────────────────────────────────────────
export const pricesApi = {
  /** GET /api/prices — returns all Mandi price rows */
  getAll: (params = {}) =>
    http.get('/api/prices', { params }).then((r) => r.data),

  /** PUT /api/prices/:id — admin price update */
  update: (id, body) =>
    http.put(`/api/prices/${id}`, body).then((r) => r.data),
};
