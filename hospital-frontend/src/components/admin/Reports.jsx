import React, { useState } from 'react';
import {
    TrendingUp, Users, DollarSign, Calendar, Download,
    BarChart3, PieChart, Activity
} from 'lucide-react';

// --- Reports Component ---
const Reports = () => {
    const [dateRange, setDateRange] = useState('thisMonth');
    const [reportType, setReportType] = useState('all');

    // Mock report data (no changes needed here)
    const reportStats = {
        totalPatients: 2543,
        newPatients: 145,
        totalAppointments: 1256,
        completedAppointments: 1089,
        revenue: 245630,
        expenses: 98450,
        profit: 147180,
        occupancyRate: 78.5,
    };

    const departmentStats = [
        { name: 'Cardiology', patients: 345, revenue: 78500, appointments: 289 },
        { name: 'Neurology', patients: 234, revenue: 56700, appointments: 198 },
        { name: 'Orthopedics', patients: 456, revenue: 89200, appointments: 412 },
        { name: 'Pediatrics', patients: 389, revenue: 45600, appointments: 357 },
        { name: 'Emergency', patients: 567, revenue: 123400, appointments: 489 },
    ];

    const doctorPerformance = [
        { name: 'Dr. Sarah Smith', patients: 145, revenue: 34500, rating: 4.9 },
        { name: 'Dr. Mike Davis', patients: 132, revenue: 29800, rating: 4.8 },
        { name: 'Dr. Emily Brown', patients: 156, revenue: 38900, rating: 4.7 },
        { name: 'Dr. John Lee', patients: 128, revenue: 31200, rating: 4.9 },
        { name: 'Dr. Robert Wilson', patients: 167, revenue: 42300, rating: 4.8 },
    ];

    const monthlyRevenue = [
        { month: 'Jan', revenue: 185000, expenses: 89000 },
        { month: 'Feb', revenue: 198000, expenses: 92000 },
        { month: 'Mar', revenue: 212000, expenses: 95000 },
        { month: 'Apr', revenue: 205000, expenses: 91000 },
        { month: 'May', revenue: 225000, expenses: 98000 },
        { month: 'Jun', revenue: 245630, expenses: 98450 },
    ];

    // Added a 'category' key to link reports to the filter
    const availableReports = [
        { id: 1, name: 'Patient Registration Report', icon: Users, color: 'blue', category: 'clinical' },
        { id: 2, name: 'Appointment Statistics', icon: Calendar, color: 'green', category: 'operational' },
        { id: 3, name: 'Revenue & Financial Report', icon: DollarSign, color: 'yellow', category: 'financial' },
        { id: 4, name: 'Department Performance', icon: BarChart3, color: 'purple', category: 'operational' },
        { id: 5, name: 'Doctor Performance Report', icon: Activity, color: 'red', category: 'clinical' },
        { id: 6, name: 'Bed Occupancy Report', icon: PieChart, color: 'indigo', category: 'operational' },
    ];

    const handleDownloadReport = (reportName) => {
        // Mock download
        alert(`Downloading ${reportName} report for ${dateRange}...`);
    };

    // CORE FIX: Filter the available reports based on reportType state
    const filteredAvailableReports = availableReports.filter(report => {
        if (reportType === 'all') {
            return true; // Show all reports
        }
        // Match the report's category to the selected reportType
        return report.category === reportType;
    });

    // Helper function for Indian Rupee formatting
    const formatRupees = (amount) => {
        return amount.toLocaleString('en-IN');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                    <p className="text-gray-600 mt-1">View hospital performance and generate reports</p>
                </div>
                <button
                    onClick={() => handleDownloadReport('All Reports')} // Changed to use the existing mock function
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Download className="h-5 w-5" />
                    <span>Export All</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="today">Today</option>
                            <option value="thisWeek">This Week</option>
                            <option value="thisMonth">This Month</option>
                            <option value="lastMonth">Last Month</option>
                            <option value="thisYear">This Year</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="all">All Reports</option>
                            <option value="financial">Financial</option>
                            <option value="operational">Operational</option>
                            <option value="clinical">Clinical</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Key Metrics - CURRENCY UPDATED HERE */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Patients</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{reportStats.totalPatients}</p>
                            <p className="text-xs text-green-600 mt-2 flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +{reportStats.newPatients} new
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Appointments</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{reportStats.totalAppointments}</p>
                            <p className="text-xs text-gray-600 mt-2">
                                {reportStats.completedAppointments} completed
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Calendar className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">₹{formatRupees(reportStats.revenue)}</p>
                            <p className="text-xs text-green-600 mt-2">
                                Profit: ₹{formatRupees(reportStats.profit)}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <DollarSign className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Occupancy Rate</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{reportStats.occupancyRate}%</p>
                            <p className="text-xs text-gray-600 mt-2">Bed utilization</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Activity className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Available Reports */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Available Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Iterate over the FILTERED list */}
                    {filteredAvailableReports.map((report) => {
                        const Icon = report.icon;
                        return (
                            <div
                                key={report.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3">
                                        {/* NOTE: Tailwind CSS JIT mode is required for dynamic color classes like this */}
                                        <div className={`p-2 bg-${report.color}-100 rounded-lg`}>
                                            <Icon className={`h-5 w-5 text-${report.color}-600`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-900">{report.name}</h3>
                                            <p className="text-xs text-gray-500 mt-1">Date Range: {dateRange}</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDownloadReport(report.name)}
                                    className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>Download</span>
                                </button>
                            </div>
                        );
                    })}
                    {filteredAvailableReports.length === 0 && (
                        <p className="text-gray-500 col-span-full py-8 text-center">
                            No reports match the selected type or filters.
                        </p>
                    )}
                </div>
            </div>

            {/* Department Performance and Top Performing Doctors sections - CURRENCY UPDATED HERE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Department Performance</h2>
                    <div className="space-y-4">
                        {departmentStats.map((dept, index) => (
                            <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium text-gray-900">{dept.name}</h3>
                                    <span className="text-sm font-bold text-green-600">₹{formatRupees(dept.revenue)}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{dept.patients} patients</span>
                                    <span>{dept.appointments} appointments</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Top Performing Doctors</h2>
                    <div className="space-y-4">
                        {doctorPerformance.map((doctor, index) => (
                            <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span className="text-indigo-600 font-medium text-sm">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">{doctor.name}</h3>
                                            <p className="text-xs text-gray-500">Rating: {doctor.rating}⭐</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-green-600">₹{formatRupees(doctor.revenue)}</p>
                                        <p className="text-xs text-gray-500">{doctor.patients} patients</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Monthly Revenue Chart - CURRENCY UPDATED HERE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend (Last 6 Months)</h2>
                <div className="space-y-3">
                    {monthlyRevenue.map((month, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">{month.month}</span>
                                <div className="flex items-center space-x-4">
                                    <span className="text-xs text-green-600">Rev: ₹{formatRupees(month.revenue)}</span>
                                    <span className="text-xs text-red-600">Exp: ₹{formatRupees(month.expenses)}</span>
                                </div>
                            </div>
                            <div className="flex space-x-1">
                                <div
                                    className="h-2 bg-green-500 rounded"
                                    // Style logic is based on maximum potential revenue (e.g., 300000)
                                    style={{ width: `${(month.revenue / 300000) * 100}%` }}
                                ></div>
                                <div
                                    className="h-2 bg-red-500 rounded"
                                    // Style logic is based on maximum potential revenue (e.g., 300000)
                                    style={{ width: `${(month.expenses / 300000) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;