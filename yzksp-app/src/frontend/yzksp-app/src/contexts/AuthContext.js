import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const response = await apiService.getCurrentUser();
      console.log('Current user response:', response.data);
      setUser(response.data);
      console.log('User state updated:', response.data);
    } catch (error) {
      console.error('Error checking auth status:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      setUser(null);
      console.log('User state cleared');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Attempting login...');
      const response = await apiService.login(username, password);
      console.log('Login response:', response.data);
      setUser(response.data.user);
      console.log('User state updated after login:', response.data.user);
      await checkAuthStatus(); // ログイン後に再度認証状態を確認
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout...');
      await apiService.logout();
      setUser(null);
      console.log('User state cleared after logout');
    } catch (error) {
      console.error('Logout error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('Attempting registration...');
      const response = await apiService.register(username, email, password);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};