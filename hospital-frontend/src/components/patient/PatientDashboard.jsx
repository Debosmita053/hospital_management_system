import React, { useState, useEffect } from 'react';
import { Calendar, FileText, CreditCard, Clock, TrendingUp, Activity } from 'lucide-react';
import api from '../../services/api';

const PatientDashboard = () => {
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalBills: 0,
    pendingBills: 0,
    medicalRecords: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/patient');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching patient stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, gradient, change }) => (
    <div className={`rounded-xl shadow-lg p-6 text-white ${gradient} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          {change && (
            <p className="text-sm mt-2 flex items-center">
              <TrendingUp className="h-4 w-4 text-white/90 mr-1" />
              <span className="text-white/90 font-medium">{change}</span>
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your health portal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          icon={Calendar}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Bills"
          value={stats.totalBills}
          icon={CreditCard}
          gradient="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Pending Bills"
          value={stats.pendingBills}
          icon={Clock}
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
        />
        <StatCard
          title="Medical Records"
          value={stats.medicalRecords}
          icon={FileText}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-900 font-medium">Book Appointment</span>
              </div>
              <span className="text-blue-600">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-900 font-medium">View Medical Records</span>
              </div>
              <span className="text-green-600">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-gray-900 font-medium">Pay Bills</span>
              </div>
              <span className="text-purple-600">→</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Appointment scheduled with Dr. Smith</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Medical report uploaded</p>
                <p className="text-sm text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Bill payment received</p>
                <p className="text-sm text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
