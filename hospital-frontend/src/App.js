import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import DoctorLayout from './components/doctor/DoctorLayout';

// Temporary dashboard placeholders
const AdminDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
    <p className="mt-4">Welcome to the Admin Panel!</p>
  </div>
);

const PatientDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Patient Dashboard</h1>
    <p className="mt-4">Welcome, Patient!</p>
  </div>
);

const NurseDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Nurse Dashboard</h1>
    <p className="mt-4">Welcome, Nurse!</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
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

          {/* Patient Routes */}
          <Route
            path="/patient/*"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Nurse Routes */}
          <Route
            path="/nurse/*"
            element={
              <ProtectedRoute allowedRoles={['nurse']}>
                <NurseDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;