import React, { useState, useEffect } from 'react';
import { Users, ClipboardList, CheckCircle, TrendingUp, Activity, Clock } from 'lucide-react';
import api from '../../services/api';

const NurseDashboard = () => {
  const [stats, setStats] = useState({
    assignedPatients: 0,
    todaysTasks: 0,
    completedTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/nurse');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching nurse stats:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">Nurse Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your patients and tasks</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Assigned Patients"
          value={stats.assignedPatients}
          icon={Users}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Today's Tasks"
          value={stats.todaysTasks}
          icon={ClipboardList}
          gradient="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={CheckCircle}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Tasks Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Today's Tasks</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Vital Signs Check</p>
                  <p className="text-xs text-gray-600">Room 201 - John Doe</p>
                </div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Pending</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Medication Administration</p>
                  <p className="text-xs text-gray-600">Room 105 - Jane Smith</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Completed</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Patient Assessment</p>
                  <p className="text-xs text-gray-600">Room 312 - Mike Johnson</p>
                </div>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">In Progress</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Assigned Patients</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  JD
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-600">Room 201 - Cardiac Care</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Stable</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  JS
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Jane Smith</p>
                  <p className="text-xs text-gray-600">Room 105 - General Ward</p>
                </div>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">Monitor</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                MJ
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Mike Johnson</p>
                <p className="text-xs text-gray-600">Room 312 - ICU</p>
              </div>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Critical</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
