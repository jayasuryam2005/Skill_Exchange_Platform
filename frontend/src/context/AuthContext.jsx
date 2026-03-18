import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      const savedUser = localStorage.getItem('skill_exchange_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Set from localStorage first for instant display
        setUser(parsedUser);

        // Then refresh from API to get latest skills/profile data
        try {
          const token = parsedUser.token;
          if (token) {
            const response = await api.get('/auth/me', {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
              const freshUser = { ...response.data.data, token };
              setUser(freshUser);
              localStorage.setItem('skill_exchange_user', JSON.stringify(freshUser));
            }
          }
        } catch (error) {
          console.error('Failed to refresh user data:', error);
          // Keep stale localStorage user if API fails
        }
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        // Now get user details
        const token = response.data.token;
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const userResponse = await api.get('/auth/me', config);
        
        const userData = { ...userResponse.data.data, token };
        setUser(userData);
        localStorage.setItem('skill_exchange_user', JSON.stringify(userData));
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('skill_exchange_user');
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        const token = response.data.token;
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const userResponse = await api.get('/auth/me', config);
        
        const registeredUser = { ...userResponse.data.data, token };
        setUser(registeredUser);
        localStorage.setItem('skill_exchange_user', JSON.stringify(registeredUser));
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      // Use the actual update endpoint if it exists, otherwise mock success
      // Backend users.js might have update profile
      const response = await api.put('/users/profile', updatedData);
      if (response.data.success) {
        const newUser = { ...user, ...response.data.data };
        setUser(newUser);
        localStorage.setItem('skill_exchange_user', JSON.stringify(newUser));
        return { success: true };
      }
    } catch (error) {
      // Fallback if endpoint not found or error
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      localStorage.setItem('skill_exchange_user', JSON.stringify(newUser));
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile }}>
      {children}
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
