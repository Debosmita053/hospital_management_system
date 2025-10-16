import React, { createContext, useState, useEffect } from 'react';
// import api from '../services/api'; // Commented out for mock auth

export const AuthContext = createContext();

// Mock users database
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@hospital.com',
    password: 'admin123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
  },
  {
    id: '2',
    email: 'doctor@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    firstName: 'Dr. Sarah',
    lastName: 'Smith',
  },
  {
    id: '3',
    email: 'patient@hospital.com',
    password: 'patient123',
    role: 'patient',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    id: '4',
    email: 'nurse@hospital.com',
    password: 'nurse123',
    role: 'nurse',
    firstName: 'Jane',
    lastName: 'Wilson',
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user in mock database
    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
      };

      const mockToken = 'mock-jwt-token-' + foundUser.id;

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true, user: userData };
    } else {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }
  };

  const register = async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create new mock user
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      email: userData.email,
      role: userData.role,
      firstName: userData.profileData.firstName,
      lastName: userData.profileData.lastName,
    };

    const mockToken = 'mock-jwt-token-' + newUser.id;

    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);

    return { success: true, user: newUser };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
