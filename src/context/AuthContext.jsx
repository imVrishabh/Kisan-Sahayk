/**
 * src/context/AuthContext.jsx — Global authentication state management
 * 
 * Manages:
 *   - User login/logout
 *   - JWT token storage
 *   - User profile data
 *   - Protected route access
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // ── Initialize auth state from localStorage on mount ──────────────────────────
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('kisan_token');
            const storedUser = localStorage.getItem('kisan_user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            }
        } catch (err) {
            console.error('Failed to restore auth state:', err);
            localStorage.removeItem('kisan_token');
            localStorage.removeItem('kisan_user');
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Register new user ─────────────────────────────────────────────────────────
    const register = useCallback(async (registerData) => {
        try {
            setError(null);
            setLoading(true);

            const response = await authApi.register(registerData);

            if (response.token && response.user) {
                // Store token and user in localStorage
                localStorage.setItem('kisan_token', response.token);
                localStorage.setItem('kisan_user', JSON.stringify(response.user));

                // Update state
                setToken(response.token);
                setUser(response.user);
                setIsAuthenticated(true);

                return response;
            }
        } catch (err) {
            const errorMsg = err.message || 'Registration failed';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Login user ────────────────────────────────────────────────────────────────
    const login = useCallback(async (loginData) => {
        try {
            setError(null);
            setLoading(true);

            const response = await authApi.login(loginData);

            if (response.token && response.user) {
                // Store token and user in localStorage
                localStorage.setItem('kisan_token', response.token);
                localStorage.setItem('kisan_user', JSON.stringify(response.user));

                // Update state
                setToken(response.token);
                setUser(response.user);
                setIsAuthenticated(true);

                return response;
            }
        } catch (err) {
            const errorMsg = err.message || 'Login failed';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Logout user ───────────────────────────────────────────────────────────────
    const logout = useCallback(() => {
        localStorage.removeItem('kisan_token');
        localStorage.removeItem('kisan_user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
    }, []);

    // ── Get current user profile ──────────────────────────────────────────────────
    const getCurrentUser = useCallback(async () => {
        if (!token) {
            return null;
        }

        try {
            setError(null);
            const response = await authApi.getCurrentUser();
            if (response.data) {
                setUser(response.data);
                localStorage.setItem('kisan_user', JSON.stringify(response.data));
                return response.data;
            }
        } catch (err) {
            console.error('Failed to get current user:', err);
            if (err.message.includes('401')) {
                logout();
            }
        }
    }, [token, logout]);

    // ── Update user profile ───────────────────────────────────────────────────────
    const updateProfile = useCallback(async (profileData) => {
        try {
            setError(null);
            setLoading(true);

            const response = await authApi.updateProfile(profileData);
            if (response.data) {
                setUser(response.data);
                localStorage.setItem('kisan_user', JSON.stringify(response.data));
                return response.data;
            }
        } catch (err) {
            const errorMsg = err.message || 'Profile update failed';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Change password ───────────────────────────────────────────────────────────
    const changePassword = useCallback(async (passwordData) => {
        try {
            setError(null);
            setLoading(true);

            const response = await authApi.changePassword(passwordData);
            return response;
        } catch (err) {
            const errorMsg = err.message || 'Password change failed';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Clear error ───────────────────────────────────────────────────────────────
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value = {
        user,
        token,
        loading,
        error,
        isAuthenticated,
        register,
        login,
        logout,
        getCurrentUser,
        updateProfile,
        changePassword,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * Usage: const { user, login, logout } = useAuth();
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
