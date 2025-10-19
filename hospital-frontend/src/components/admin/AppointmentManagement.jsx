import React, { useState } from 'react';
import { Calendar, Clock, User, Search, Filter, Eye, CheckCircle, XCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AppointmentManagement = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Mock appointments data
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      appointmentNumber: 'APT20241001',
      patientName: 'John Doe',
      patientNumber: 'PAT001',
      doctorName: 'Dr. Sarah Smith',
      department: 'Cardiology',
      date: '2024-12-20',
      time: '10:00 AM',
      reason: 'Regular checkup for general health assessment.',
      status: 'scheduled',
    },
    {
      id: 2,
      appointmentNumber: 'APT20241002',
      patientName: 'Jane Wilson',
      patientNumber: 'PAT002',
      doctorName: 'Dr. Mike Davis',
      department: 'Neurology',
      date: '2024-12-20',
      time: '11:30 AM',
      reason: 'Persistent severe headaches for the past two weeks.',
      status: 'confirmed',
    },
    {
      id: 3,
      appointmentNumber: 'APT20241003',
      patientName: 'Bob Johnson',
      patientNumber: 'PAT003',
      doctorName: 'Dr. Emily Brown',
      department: 'Pediatrics',
      date: '2024-12-20',
      time: '02:00 PM',
      reason: 'Routine MMR and flu shots for annual vaccination schedule.',
      status: 'completed',
    },
    {
      id: 4,
      appointmentNumber: 'APT20241004',
      patientName: 'Alice Cooper',
      patientNumber: 'PAT004',
      doctorName: 'Dr. John Lee',
      department: 'Orthopedics',
      date: '2024-12-21',
      time: '09:00 AM',
      reason: 'Evaluation of chronic discomfort in the right knee joint.',
      status: 'cancelled',
    },
    {
      id: 5,
      appointmentNumber: 'APT20241005',
      patientName: 'Tom Hardy',
      patientNumber: 'PAT005',
      doctorName: 'Dr. Sarah Smith',
      department: 'Cardiology',
      date: '2024-12-21',
      time: '03:30 PM',
      reason: 'Follow-up on recent blood test results and medication review.',
      status: 'scheduled',
    },
  ]);

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.appointmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || apt.date === selectedDate;

    return matchesStatus && matchesSearch && matchesDate;
  });

  const handleStatusUpdate = (id, newStatus) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, status: newStatus } : apt
      )
    );
    toast.success(`Appointment status updated to ${newStatus}!`);
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Calculate stats
  const totalAppointments = appointments.length;
  const todayDate = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayDate).length; 
  const totalCompleted = appointments.filter(a => a.status === 'completed').length; 
  const totalCancelled = appointments.filter(a => a.status === 'cancelled').length;

  // Stats Card Component
  const StatCard = ({ title, value, icon: Icon, gradient, textColor = 'text-white' }) => (
    <div className={`rounded-xl shadow-lg p-6 text-white ${gradient} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm mb-1">{title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  // Detail Modal Component
  const AppointmentDetailModal = ({ appointment, onClose, getStatusColor }) => {
    if (!appointment) return null;

    const StatusPill = ({ status }) => (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(status)}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg m-4">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-bold text-gray-900">
              Appointment Details: {appointment.appointmentNumber}
            </h3>
            <button 
              onClick={onClose} 
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-4 text-sm text-gray-700">
            <div className="grid grid-cols-2 gap-y-3">
              <p className="font-semibold text-gray-900">Patient:</p>
              <p>{appointment.patientName} ({appointment.patientNumber})</p>

              <p className="font-semibold text-gray-900">Doctor:</p>
              <p>{appointment.doctorName}</p>

              <p className="font-semibold text-gray-900">Department:</p>
              <p>{appointment.department}</p>
              
              <p className="font-semibold text-gray-900">Date & Time:</p>
              <p>{appointment.date} at {appointment.time}</p>

              <p className="font-semibold text-gray-900">Status:</p>
              <StatusPill status={appointment.status} />
            </div>

            <div className='pt-4 border-t mt-4'>
                <p className="font-semibold text-gray-900 mb-2">Reason for Appointment:</p>
                <p className='bg-gray-50 p-3 rounded-lg border'>{appointment.reason}</p>
            </div>
          </div>

          <div className="p-4 border-t flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
        <p className="text-gray-600 mt-1">View and manage all patient appointments</p>
      </div>

      {/* Colorful Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Appointments" 
          value={totalAppointments} 
          icon={Calendar}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard 
          title="Today's Appointments" 
          value={todayAppointments} 
          icon={Clock}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard 
          title="Total Completed" 
          value={totalCompleted} 
          icon={CheckCircle}
          gradient="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard 
          title="Total Cancelled" 
          value={totalCancelled} 
          icon={XCircle}
          gradient="bg-gradient-to-br from-red-500 to-red-600"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient, doctor, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
            />
          </div>
          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Appointment ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Doctor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.length > 0 ? filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {appointment.appointmentNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
                        <p className="text-xs text-gray-500">{appointment.patientNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {appointment.doctorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                      {appointment.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.date}</div>
                    <div className="text-xs text-gray-500">{appointment.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(appointment)} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Confirm Appointment"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                        {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Mark Complete"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Cancel"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    No appointments found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AppointmentDetailModal 
        appointment={selectedAppointment} 
        onClose={() => setSelectedAppointment(null)} 
        getStatusColor={getStatusColor}
      />
    </div>
  );
};

export default AppointmentManagement;