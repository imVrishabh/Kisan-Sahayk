/**
 * src/context/CropsContext.jsx — Global crop listings state management
 *
 * Features:
 *   - Fetch crops from backend with filtering
 *   - Create new crop listings
 *   - Update existing crops
 *   - Delete crops with rollback on error
 *   - Optimistic UI updates for better UX
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cropsApi } from '../services/api';

const CropsContext = createContext(null);

export function CropsProvider({ children }) {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // ── Fetch all crops from backend with filters ─────────────────────────
  const fetchCrops = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const result = await cropsApi.getAll(filters);

      // Handle both array and paginated responses
      const cropsData = result.data || result;
      const paginationData = result.pagination || {
        page: result.currentPage || 1,
        limit: result.count || 10,
        total: result.total || 0,
        pages: result.pages || 1,
      };

      setCrops(Array.isArray(cropsData) ? cropsData : result);
      setPagination(paginationData);
    } catch (err) {
      setError(err.message);
      setCrops([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Load crops on mount ────────────────────────────────────────────────
  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  // ── Create new crop ───────────────────────────────────────────────────
  const addCrop = useCallback(async (newCropData) => {
    try {
      setError(null);
      const result = await cropsApi.create(newCropData);
      const newCrop = result.data || result;

      // Prepend new listing so it appears at the top
      setCrops((prev) => [newCrop, ...prev]);

      return newCrop;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // ── Update crop status ────────────────────────────────────────────────
  const updateCropStatus = useCallback(async (id, status) => {
    try {
      setError(null);

      // Optimistic update
      setCrops((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      );

      const result = await cropsApi.updateStatus(id, status);
      const updatedCrop = result.data || result;

      // Sync with server response
      setCrops((prev) =>
        prev.map((c) => (c._id === id ? updatedCrop : c))
      );

      return updatedCrop;
    } catch (err) {
      setError(err.message);
      // Rollback on error
      fetchCrops();
      throw err;
    }
  }, [fetchCrops]);

  // ── Update crop ───────────────────────────────────────────────────────
  const updateCrop = useCallback(async (id, changes) => {
    try {
      setError(null);

      // Optimistic update
      setCrops((prev) =>
        prev.map((c) => (c._id === id ? { ...c, ...changes } : c))
      );

      const result = await cropsApi.update(id, changes);
      const updatedCrop = result.data || result;

      // Sync with server response (includes updatedAt, etc.)
      setCrops((prev) =>
        prev.map((c) => (c._id === id ? updatedCrop : c))
      );

      return updatedCrop;
    } catch (err) {
      setError(err.message);
      // Rollback on error
      fetchCrops();
      throw err;
    }
  }, [fetchCrops]);

  // ── Delete crop ───────────────────────────────────────────────────────
  const deleteCrop = useCallback(async (id) => {
    try {
      setError(null);

      // Optimistic delete - remove from UI immediately
      const originalCrops = crops;
      setCrops((prev) => prev.filter((c) => c._id !== id));

      await cropsApi.delete(id);
    } catch (err) {
      setError(err.message);
      // Rollback on error
      fetchCrops();
      throw err;
    }
  }, [crops, fetchCrops]);

  // ── Get my crops (farmer's own listings) ───────────────────────────────
  const getMyCrops = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await cropsApi.getMyCrops();
      return result.data || result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Get single crop ───────────────────────────────────────────────────
  const getCropById = useCallback(async (id) => {
    try {
      const result = await cropsApi.getOne(id);
      return result.data || result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // ── Clear error ───────────────────────────────────────────────────────
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    crops,
    loading,
    error,
    pagination,
    fetchCrops,
    addCrop,
    updateCrop,
    updateCropStatus,
    deleteCrop,
    getMyCrops,
    getCropById,
    clearError,
  };

  return (
    <CropsContext.Provider value={value}>
      {children}
    </CropsContext.Provider>
  );
}

/**
 * Hook to access crops context
 * Usage: const { crops, addCrop, deleteCrop } = useCrops();
 */
export function useCrops() {
  const context = useContext(CropsContext);
  if (!context) {
    throw new Error('useCrops must be used within CropsProvider');
  }
  return context;
}
