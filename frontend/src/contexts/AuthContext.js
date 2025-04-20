import React, { createContext, useContext, useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '../constants/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated on initial load
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    if (token) {
      // Here you would typically validate the token with your backend
      // For now, we'll just set authenticated to true
      setIsAuthenticated(true);
      // You would also fetch user data here
      setUser({
        email: 'user@example.com', // This would come from your backend
        name: 'User Name' // This would come from your backend
      });
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 