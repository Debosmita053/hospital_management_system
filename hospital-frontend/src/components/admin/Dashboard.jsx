import React from 'react';
import { Users, UserPlus, Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react';

// Helper function for Indian Rupee formatting
const formatRupees = (amountString) => {
    // Remove '$', commas, and convert to number, then format
    const number = parseFloat(amountString.replace('$', '').replace(/,/g, ''));
    if (isNaN(number)) return amountString; // Return original if conversion fails
    // Use 'en-IN' locale for Indian numbering (lakhs, crores)
    return `₹${number.toLocaleString('en-IN')}`;
};

const StatCard = ({ title, value, change, icon: Icon, gradient }) => (
    <div className={`rounded-xl shadow-lg p-6 text-white ${gradient} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-white/80 text-sm mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
                {change && (
                    <p className="text-sm mt-2 flex items-center">
                        <TrendingUp className="h-4 w-4 text-white/90 mr-1" />
                        <span className="text-white/90 font-medium">{change}</span>
                        <span className="text-white/70 ml-1">vs last month</span>
                    </p>
                )}
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Icon className="h-6 w-6 text-white" />
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    // Colorful gradient stats with Indian Rupee formatting
    const stats = [
        { 
            title: 'Total Patients', 
            value: '2,543', 
            change: '+12.5%', 
            icon: Users, 
            gradient: 'bg-gradient-to-br from-blue-500 to-blue-600' 
        },
        { 
            title: 'Total Doctors', 
            value: '42', 
            change: '+2', 
            icon: UserPlus, 
            gradient: 'bg-gradient-to-br from-green-500 to-green-600' 
        },
        { 
            title: 'Appointments Today', 
            value: '156', 
            change: '+8.2%', 
            icon: Calendar, 
            gradient: 'bg-gradient-to-br from-purple-500 to-purple-600' 
        },
        { 
            title: 'Revenue (Month)', 
            value: formatRupees('45231'), 
            change: '+15.3%', 
            icon: DollarSign, 
            gradient: 'bg-gradient-to-br from-amber-500 to-amber-600' 
        },
    ];

    const recentActivities = [
        { id: 1, action: 'New patient registered', user: 'John Doe', time: '2 mins ago', type: 'patient' },
        { id: 2, action: 'Appointment completed', user: 'Dr. Smith', time: '15 mins ago', type: 'appointment' },
        { id: 3, action: 'Payment received', user: 'Bill #1234', time: '1 hour ago', type: 'payment' },
        { id: 4, action: 'New doctor added', user: 'Dr. Sarah Lee', time: '2 hours ago', type: 'doctor' },
        { id: 5, action: 'Patient discharged', user: 'Jane Wilson', time: '3 hours ago', type: 'patient' },
    ];

    const upcomingAppointments = [
        { id: 1, patient: 'John Doe', doctor: 'Dr. Smith', time: '10:00 AM', department: 'Cardiology' },
        { id: 2, patient: 'Jane Smith', doctor: 'Dr. Lee', time: '11:30 AM', department: 'Neurology' },
        { id: 3, patient: 'Bob Johnson', doctor: 'Dr. Davis', time: '02:00 PM', department: 'Orthopedics' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Colorful Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center">
                            <Activity className="h-5 w-5 mr-2 text-primary-600" />
                            Recent Activity
                        </h2>
                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                    activity.type === 'patient' ? 'bg-blue-500' :
                                    activity.type === 'doctor' ? 'bg-green-500' :
                                    activity.type === 'appointment' ? 'bg-purple-500' :
                                    'bg-amber-500'
                                }`}></div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900">{activity.action}</p>
                                    <p className="text-sm text-gray-500">{activity.user}</p>
                                </div>
                                <span className="text-xs text-gray-400">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Today's Appointments</h2>
                    <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                            <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <p className="text-sm font-medium text-gray-900">{appointment.patient}</p>
                                <p className="text-xs text-gray-600 mt-1">{appointment.doctor}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-primary-600 font-medium">{appointment.department}</span>
                                    <span className="text-xs text-gray-500">{appointment.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
                        View All Appointments
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;