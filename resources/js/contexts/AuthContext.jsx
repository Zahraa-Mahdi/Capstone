import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                // Set the token in axios headers
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Verify token with backend
                const response = await api.get('/user');
                setUser(response.data);
                setIsAuthenticated(true);
            } else {
                clearAuthState();
            }
        } catch (error) {
            clearAuthState();
        } finally {
            setLoading(false);
        }
    };

    const clearAuthState = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
    };

    const login = async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            
            if (response.data.user && response.data.access_token) {
                const { user, access_token: token } = response.data;
                
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('isAuthenticated', 'true');
                
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                setUser(user);
                setIsAuthenticated(true);
                
                return { success: true };
            }
            return { success: false, error: 'Invalid credentials' };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'An error occurred during login'
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuthState();
        }
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            loading,
            login,
            logout,
            checkAuthStatus
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext; 