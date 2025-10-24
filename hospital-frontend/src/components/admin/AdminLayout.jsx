// ============================================
// FILE: src/components/admin/AdminLayout.jsx (FIXED - Correct File Names)
// ============================================
import React, { useContext, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import Dashboard from './Dashboard';
import PatientManagement from './PatientManagement';
import DoctorManagement from './DoctorManagement';
import NurseStaffManagement from './NurseStaffManagement';
import DepartmentManagement from './DepartmentManagement';
import AppointmentManagement from './AppointmentManagement';
import PharmacyInventory from './PharmacyInventory';  
import RoomManagement from './RoomManagement';
import BillingManagement from './BillingManagement';
import Reports from './Reports';
import Settings from './Settings';
import Profile from './Profile';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar role="admin" onLogout={logout} isOpen={sidebarOpen} />
      <Navbar 
        user={user} 
        onLogout={logout} 
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />
      
      <main className={`pt-16 p-8 transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientManagement />} />
          <Route path="/doctors" element={<DoctorManagement />} />
          <Route path="/staff" element={<NurseStaffManagement />} />
          <Route path="/appointments" element={<AppointmentManagement />} />
          <Route path="/pharmacy" element={<PharmacyInventory />} />
          <Route path="/departments" element={<DepartmentManagement />} />
          <Route path="/rooms" element={<RoomManagement />} />
          <Route path="/billing" element={<BillingManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminLayout;