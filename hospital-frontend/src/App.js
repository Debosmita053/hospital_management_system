// ============================================
// FILE: src/App.js (Updated with Landing Page)
// ============================================
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './components/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import DoctorLayout from './components/doctor/DoctorLayout';
import StaffLayout from './components/staff/StaffLayout';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            />
            
            {/* Doctor Routes */}
            <Route
              path="/doctor/*"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorLayout />
                </ProtectedRoute>
              }
            />
            
            {/* Staff Portal Routes - Unified for all support staff */}
            <Route
              path="/staff/*"
              element={
                <ProtectedRoute allowedRoles={['nurse', 'lab_technician', 'pharmacist', 'ward_boy']}>
                  <StaffLayout />
                </ProtectedRoute>
              }
            />
            
            {/* Catch all - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;