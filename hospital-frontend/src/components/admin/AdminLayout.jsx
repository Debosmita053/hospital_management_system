import React, { useContext, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';

// --- Existing Imports ---
import AdminDashboard from './Dashboard';
import PatientManagement from './PatientManagement';
import DepartmentManagement from './DepartmentManagement';
import RoomManagement from './RoomManagement';
import AppointmentManagement from './AppointmentManagement';
import BillingManagement from './BillingManagement';
import Reports from './Reports';
import Settings from './Settings';

// --- Staff Management Imports ---
import DoctorManagement from './DoctorManagement';
import NurseStaffManagement from './NurseStaffManagement';
import PharmacyInventory from './PharmacyInventory';

const AdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar - Completely hidden when sidebarOpen is false */}
            {sidebarOpen && (
                <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-30">
                    <Sidebar role="admin" onLogout={logout} />
                </div>
            )}

            {/* Main Content Area - Full width when sidebar hidden */}
            <div className={`min-h-screen transition-all duration-300 ${
                sidebarOpen ? 'ml-64' : 'ml-0'
            }`}>
                <Navbar 
                    user={user} 
                    onLogout={logout} 
                    onToggleSidebar={toggleSidebar}
                    sidebarOpen={sidebarOpen}
                />
                
                <main className="pt-16 p-8">
                    <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/patients" element={<PatientManagement />} />
                        <Route path="/doctors" element={<DoctorManagement />} />
                        <Route path="/staff" element={<NurseStaffManagement />} />
                        <Route path="/departments" element={<DepartmentManagement />} />
                        <Route path="/rooms" element={<RoomManagement />} />
                        <Route path="/appointments" element={<AppointmentManagement />} />
                        <Route path="/billing" element={<BillingManagement />} />
                        <Route path="/pharmacy" element={<PharmacyInventory />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;