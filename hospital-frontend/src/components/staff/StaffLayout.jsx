import React, { useContext, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import StaffDashboard from './StaffDashboard';
import MyPatients from './MyPatients';
import Tasks from './Tasks';
import Schedule from './Schedule';
import Profile from './Profile';

const StaffLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar role={user?.role || 'nurse'} onLogout={logout} isOpen={sidebarOpen} />
      <Navbar 
        user={user} 
        onLogout={logout} 
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />
      
      <main className={`transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-0'
      } pt-16`}>
        <div className="p-8">
          <Routes>
            <Route path="/" element={<StaffDashboard />} />
            <Route path="/patients" element={<MyPatients />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default StaffLayout;
