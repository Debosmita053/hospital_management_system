import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Building2, Bed, Calendar, 
  DollarSign, FileText, Settings, LogOut, Stethoscope,
  Pill, UserCog, Heart, ClipboardList, Activity,
  Clock, User
} from 'lucide-react';

const Sidebar = ({ role, onLogout, isOpen }) => {
  const location = useLocation();

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Patient Management', path: '/admin/patients' },
    { icon: Stethoscope, label: 'Doctor Management', path: '/admin/doctors' },
    { icon: UserCog, label: 'Staff Management', path: '/admin/staff' },
    { icon: Building2, label: 'Departments', path: '/admin/departments' },
    { icon: Bed, label: 'Rooms', path: '/admin/rooms' },
    { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
    { icon: Pill, label: 'Pharmacy', path: '/admin/pharmacy' },
    { icon: DollarSign, label: 'Billing', path: '/admin/billing' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: User, label: 'Profile', path: '/admin/profile' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const doctorMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor' },
    { icon: Calendar, label: 'My Appointments', path: '/doctor/appointments' },
    { icon: Users, label: 'My Patients', path: '/doctor/patients' },
    { icon: ClipboardList, label: 'Medical Records', path: '/doctor/records' },
    { icon: Activity, label: 'Prescriptions', path: '/doctor/prescriptions' },
    { icon: Clock, label: 'My Schedule', path: '/doctor/schedule' },
    { icon: User, label: 'Profile', path: '/doctor/profile' },
  ];

  const staffMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/staff' },
    { icon: Users, label: 'My Patients', path: '/staff/patients' },
    { icon: Activity, label: 'Tasks', path: '/staff/tasks' },
    { icon: Clock, label: 'Schedule', path: '/staff/schedule' },
    { icon: User, label: 'Profile', path: '/staff/profile' },
  ];

  const getMenuItems = () => {
    switch(role) {
      case 'admin':
        return adminMenuItems;
      case 'doctor':
        return doctorMenuItems;
      case 'nurse':
      case 'lab_technician':
      case 'pharmacist':
      case 'ward_boy':
        return staffMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const isActive = (path) => {
    if (path === `/${role}`) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 ${
      isOpen ? 'w-64' : 'w-0'
    } overflow-hidden`}>
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="bg-primary-600 dark:bg-primary-500 p-2 rounded-xl">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">HealthCare</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-1 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;