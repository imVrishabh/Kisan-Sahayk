/**
 * CropsContext.jsx — Global crop listings state.
 *
 * Sources data from the Express+MongoDB backend via the api.js service.
 * Falls back gracefully:
 *   - Initial load shows a spinner
 *   - API errors are surfaced as a toast-style error banner
 *   - Optimistic UI for delete/update so the UX feels instant
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cropsApi } from '../services/api';

const CropsContext = createContext(null);

export function CropsProvider({ children }) {
  const [crops, setCrops]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // ── Fetch all listings from backend ───────────────────────
  const fetchCrops = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await cropsApi.getAll(filters);
      setCrops(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => { fetchCrops(); }, [fetchCrops]);

  // ── Create ────────────────────────────────────────────────
  const addCrop = async (newCropData) => {
    const result = await cropsApi.create(newCropData);
    // Prepend new listing so it appears at the top
    setCrops((prev) => [result.data, ...prev]);
    return result.data;
  };

  // ── Delete (optimistic) ───────────────────────────────────
  const deleteCrop = async (id) => {
    // Remove from UI immediately for responsiveness
    setCrops((prev) => prev.filter((c) => c._id !== id));
    try {
      await cropsApi.remove(id);
    } catch (err) {
      // Roll back on API failure
      setError(`Delete failed: ${err.message}`);
      fetchCrops();
    }
  };

  // ── Update (optimistic) ───────────────────────────────────
  const updateCrop = async (id, changes) => {
    // Apply locally first
    setCrops((prev) =>
      prev.map((c) => (c._id === id ? { ...c, ...changes } : c))
    );
    try {
      const result = await cropsApi.update(id, changes);
      // Sync with server response (includes updatedAt etc.)
      setCrops((prev) =>
        prev.map((c) => (c._id === id ? result.data : c))
      );
    } catch (err) {
      setError(`Update failed: ${err.message}`);
      fetchCrops();
    }
  };

  return (
    <CropsContext.Provider
      value={{ crops, loading, error, fetchCrops, addCrop, deleteCrop, updateCrop }}
    >
      {children}
    </CropsContext.Provider>
  );
}

export function useCrops() {
  return useContext(CropsContext);
}
