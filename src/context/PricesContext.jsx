/**
 * src/context/PricesContext.jsx — Global market prices state management
 *
 * Features:
 *   - Fetch market prices from backend
 *   - Filter by crop type and state
 *   - Get average prices for analysis
 *   - Admin price management
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { pricesApi } from '../services/api';

const PricesContext = createContext(null);

export function PricesProvider({ children }) {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Fetch all market prices from backend ───────────────────────────────
    const fetchPrices = useCallback(async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);

            const result = await pricesApi.getAll(filters);

            // Handle both array and structured responses
            const pricesData = result.data || result;
            setPrices(Array.isArray(pricesData) ? pricesData : []);
        } catch (err) {
            setError(err.message);
            setPrices([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Load prices on mount ──────────────────────────────────────────────
    useEffect(() => {
        fetchPrices();
    }, [fetchPrices]);

    // ── Get prices for specific crop ──────────────────────────────────────
    const getPricesByCrop = useCallback(async (crop) => {
        try {
            setError(null);
            const result = await pricesApi.getByCrop(crop);
            return result.data || result;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // ── Get average price for a crop ──────────────────────────────────────
    const getAveragePrice = useCallback(async (crop) => {
        try {
            setError(null);
            const result = await pricesApi.getAverage(crop);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // ── Get single price record ───────────────────────────────────────────
    const getPriceById = useCallback(async (id) => {
        try {
            const result = await pricesApi.getOne(id);
            return result.data || result;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // ── Create price (admin only) ─────────────────────────────────────────
    const createPrice = useCallback(async (priceData) => {
        try {
            setError(null);
            const result = await pricesApi.create(priceData);
            const newPrice = result.data || result;
            setPrices((prev) => [...prev, newPrice]);
            return newPrice;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // ── Update price (admin only) ─────────────────────────────────────────
    const updatePrice = useCallback(async (id, priceData) => {
        try {
            setError(null);

            // Optimistic update
            setPrices((prev) =>
                prev.map((p) => (p._id === id ? { ...p, ...priceData } : p))
            );

            const result = await pricesApi.update(id, priceData);
            const updatedPrice = result.data || result;

            // Sync with server response
            setPrices((prev) =>
                prev.map((p) => (p._id === id ? updatedPrice : p))
            );

            return updatedPrice;
        } catch (err) {
            setError(err.message);
            // Rollback on error
            fetchPrices();
            throw err;
        }
    }, [fetchPrices]);

    // ── Delete price (admin only) ─────────────────────────────────────────
    const deletePrice = useCallback(async (id) => {
        try {
            setError(null);

            // Optimistic delete
            setPrices((prev) => prev.filter((p) => p._id !== id));

            await pricesApi.delete(id);
        } catch (err) {
            setError(err.message);
            // Rollback on error
            fetchPrices();
            throw err;
        }
    }, [fetchPrices]);

    // ── Bulk update prices (admin only) ───────────────────────────────────
    const bulkUpdatePrices = useCallback(async (updates) => {
        try {
            setError(null);
            const result = await pricesApi.bulkUpdate({ priceUpdates: updates });
            // Refresh prices after bulk update
            fetchPrices();
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [fetchPrices]);

    // ── Clear error ───────────────────────────────────────────────────────
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value = {
        prices,
        loading,
        error,
        fetchPrices,
        getPricesByCrop,
        getAveragePrice,
        getPriceById,
        createPrice,
        updatePrice,
        deletePrice,
        bulkUpdatePrices,
        clearError,
    };

    return (
        <PricesContext.Provider value={value}>
            {children}
        </PricesContext.Provider>
    );
}

/**
 * Hook to access prices context
 * Usage: const { prices, getPricesByCrop } = usePrices();
 */
export function usePrices() {
    const context = useContext(PricesContext);
    if (!context) {
        throw new Error('usePrices must be used within PricesProvider');
    }
    return context;
}
