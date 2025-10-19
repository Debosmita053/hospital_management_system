import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Building2, Bed, Calendar, 
  DollarSign, FileText, Settings, LogOut, Stethoscope,
   Pill, UserCog,
  Heart
} from 'lucide-react';

const Sidebar = ({ role, onLogout }) => {
  const location = useLocation();

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Patient Management', path: '/admin/patients' },
    { icon: Stethoscope, label: 'Doctor Management', path: '/admin/doctors' },
    { icon: UserCog, label: 'Nurse & Staff', path: '/admin/staff' },
    { icon: Building2, label: 'Departments', path: '/admin/departments' },
    { icon: Bed, label: 'Rooms', path: '/admin/rooms' },
    { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
    { icon: Pill, label: 'Pharmacy', path: '/admin/pharmacy' },
    { icon: DollarSign, label: 'Billing', path: '/admin/billing' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : [];

  const isActive = (path) => {
    if (path === `/${role}`) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sidebar Header - h-16 (Same as navbar) */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="bg-blue-600 p-2 rounded-xl">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <span className="ml-3 text-xl font-bold text-gray-900">HealthCare</span>
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
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;