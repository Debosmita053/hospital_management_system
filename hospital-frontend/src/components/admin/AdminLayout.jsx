import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import AdminDashboard from './Dashboard';
import UserManagement from './UserManagement';
import DepartmentManagement from './DepartmentManagement';
import RoomManagement from './RoomManagement';
import AppointmentManagement from './AppointmentManagement';
import BillingManagement from './BillingManagement';
import Reports from './Reports';
import Settings from './Settings';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="admin" onLogout={logout} />
      <Navbar user={user} onLogout={logout} />
      
      <main className="ml-64 pt-20 p-8">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/departments" element={<DepartmentManagement />} />
          <Route path="/rooms" element={<RoomManagement />} />
          <Route path="/appointments" element={<AppointmentManagement />} />
          <Route path="/billing" element={<BillingManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminLayout;