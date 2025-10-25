import React, { createContext, useState, useEffect } from 'react';
<<<<<<< Updated upstream
import { useNavigate } from 'react-router-dom';
=======
import api from '../services/api';
>>>>>>> Stashed changes
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

<<<<<<< Updated upstream
  // Mock user database - Replace with your API calls
  const mockUsers = {
    // Admin
    'admin@hospital.com': {
      id: 1,
      email: 'admin@hospital.com',
      name: 'John Doe',
      role: 'admin',
      password: 'admin123'
    },
    
    // Doctor
    'doctor@hospital.com': {
      id: 2,
      email: 'doctor@hospital.com',
      name: 'Dr. John Smith',
      role: 'doctor',
      specialization: 'Cardiologist',
      password: 'doctor123'
    },
    
    // Nurse
    'nurse@hospital.com': {
      id: 3,
      email: 'nurse@hospital.com',
      name: 'Sarah Johnson',
      role: 'nurse',
      department: 'General Ward',
      password: 'nurse123'
    },
    
    // Lab Technician
    'lab@hospital.com': {
      id: 4,
      email: 'lab@hospital.com',
      name: 'Mike Chen',
      role: 'lab_technician',
      department: 'Laboratory',
      password: 'lab123'
    },
    
    // Pharmacist
    'pharmacist@hospital.com': {
      id: 5,
      email: 'pharmacist@hospital.com',
      name: 'Emily Davis',
      role: 'pharmacist',
      department: 'Pharmacy',
      password: 'pharmacist123'
    },
    
    // Ward Boy
    'wardboy@hospital.com': {
      id: 6,
      email: 'wardboy@hospital.com',
      name: 'Raj Kumar',
      role: 'ward_boy',
      department: 'General Ward',
      password: 'wardboy123'
    }
  };

  // Login function - SIMPLIFIED (no navigation)
  const login = async (email, password) => {
    try {
      // Check if user exists in mock database
      const userData = mockUsers[email];
      
      if (!userData) {
        return { success: false, error: 'User not found' };
      }

      if (userData.password !== password) {
        return { success: false, error: 'Invalid password' };
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = userData;
      
      // Save user to state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast.success(`Welcome ${userWithoutPassword.name}!`);
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  // Register function (optional - for adding new staff)
  const register = async (userData) => {
    try {
      // In real app, make API call here
      console.log('Registering user:', userData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
=======
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });

      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);

      const { token, user: newUser } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);

      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/login';
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Get current user error:', error);
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getCurrentUser, loading }}>
      {children}
>>>>>>> Stashed changes
    </AuthContext.Provider>
  );
};