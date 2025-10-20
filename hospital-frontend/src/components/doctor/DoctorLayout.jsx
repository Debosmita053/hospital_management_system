import React, { useContext, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import DoctorDashboard from './DoctorDashboard';
import MyAppointments from './MyAppointments';
import MyPatients from './MyPatients';
import MedicalRecords from './MedicalRecords';
import Prescriptions from './Prescriptions';
import MySchedule from './MySchedule';

const DoctorLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="doctor" onLogout={logout} isOpen={sidebarOpen} />
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
          <Route path="/" element={<DoctorDashboard />} />
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/patients" element={<MyPatients />} />
          <Route path="/records" element={<MedicalRecords />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/schedule" element={<MySchedule />} />
        </Routes>
      </main>
    </div>
  );
};

export default DoctorLayout;