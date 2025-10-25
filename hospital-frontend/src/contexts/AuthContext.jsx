import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data.user;
      if (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      await logout();
      return null;
    }
  };

  // Load user from localStorage on mount and verify token
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (savedUser && token) {
          const userData = JSON.parse(savedUser);
          if (mounted) {
            setUser(userData);
            // Verify token and get fresh user data
            await getCurrentUser();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Check if user has specific role(s)
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response?.data) {
        const { token, user: userData } = response.data;

        if (token && userData) {
          // Save auth data
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);

          const displayName = userData.firstName || userData.email;
          toast.success(`Welcome ${displayName}!`);
          return { success: true, user: userData };
        }
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response?.data) {
        const { token, user: newUser } = response.data;

        if (token && newUser) {
          // Save auth data
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(newUser));
          setUser(newUser);

          toast.success('Registration successful!');
          return { success: true, user: newUser };
        }
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    getCurrentUser,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};