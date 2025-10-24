import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Edit,
  User,
  MapPin,
  ChevronDown,
  ChevronUp,
  Download,
  Mail,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const MyAppointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [calendarView, setCalendarView] = useState('month'); // 'day', 'week', 'month'
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showRequests, setShowRequests] = useState(false);
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 9, 1)); // October 2025

  // Mock data
  const [appointments, setAppointments] = useState([
    { 
      id: 'APT001', 
      patientId: 'P001', 
      patient: 'Rajesh Kumar', 
      age: 45, 
      gender: 'Male', 
      phone: '+91 98765 43210', 
      email: 'rajesh.kumar@email.com',
      date: '2025-10-20', 
      time: '09:00 AM', 
      duration: 30,
      reason: 'Diabetes Checkup', 
      status: 'scheduled', 
      notes: 'Regular diabetes monitoring', 
      avatar: 'RK',
      type: 'follow-up',
      location: 'Room 101',
      bloodGroup: 'B+',
      allergies: 'None'
    },
    { 
      id: 'APT002', 
      patientId: 'P002', 
      patient: 'Priya Sharma', 
      age: 32, 
      gender: 'Female', 
      phone: '+91 87654 32109', 
      email: 'priya.sharma@email.com',
      date: '2025-10-20', 
      time: '09:30 AM', 
      duration: 45,
      reason: 'Pregnancy Consultation', 
      status: 'confirmed', 
      notes: 'First trimester, 8 weeks', 
      avatar: 'PS',
      type: 'consultation',
      location: 'Room 102',
      bloodGroup: 'O+',
      allergies: 'Penicillin'
    },
    { 
      id: 'APT003', 
      patientId: 'P003', 
      patient: 'Amit Patel', 
      age: 58, 
      gender: 'Male', 
      phone: '+91 76543 21098', 
      email: 'amit.patel@email.com',
      date: '2025-10-21', 
      time: '10:00 AM', 
      duration: 30,
      reason: 'Blood Pressure Check', 
      status: 'scheduled', 
      notes: 'Hypertension patient', 
      avatar: 'AP',
      type: 'checkup',
      location: 'Room 101',
      bloodGroup: 'A+',
      allergies: 'Dust, Pollen'
    },
    { 
      id: 'APT004', 
      patientId: 'P004', 
      patient: 'Sunita Reddy', 
      age: 52, 
      gender: 'Female', 
      phone: '+91 65432 10987', 
      email: 'sunita.reddy@email.com',
      date: '2025-10-18', 
      time: '11:00 AM', 
      duration: 60,
      reason: 'Arthritis Treatment', 
      status: 'completed', 
      notes: 'Rheumatoid arthritis follow-up', 
      avatar: 'SR',
      type: 'consultation',
      location: 'Room 103',
      bloodGroup: 'AB+',
      allergies: 'None'
    }
  ]);

  // Appointment requests data
  const [appointmentRequests, setAppointmentRequests] = useState([
    {
      id: 'REQ001',
      patientId: 'P007',
      patient: 'David Miller',
      age: 41,
      gender: 'Male',
      phone: '+91 98765 12340',
      email: 'david.m@email.com',
      preferredDates: ['2025-10-22', '2025-10-23'],
      reason: 'Back Pain Consultation',
      urgency: 'normal',
      requestedBy: 'Reception',
      requestedAt: '2025-10-19 14:30',
      notes: 'Patient prefers morning slots',
      medicalHistory: 'Previous back injury in 2020'
    },
    {
      id: 'REQ002',
      patientId: 'P008',
      patient: 'Maria Garcia',
      age: 35,
      gender: 'Female',
      phone: '+91 87654 12340',
      email: 'maria.g@email.com',
      preferredDates: ['2025-10-21'],
      reason: 'Pregnancy Checkup',
      urgency: 'high',
      requestedBy: 'Admin',
      requestedAt: '2025-10-19 16:15',
      notes: 'First trimester, urgent consultation needed',
      medicalHistory: 'First pregnancy'
    }
  ]);

  const stats = [
    { 
      label: "Today's Appointments", 
      value: appointments.filter(a => a.date === '2025-10-20').length, 
      icon: Calendar,
      gradient: 'from-blue-500 to-blue-600',
      change: '+2 from yesterday',
      changeType: 'positive'
    },
    { 
      label: 'Upcoming', 
      value: appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length, 
      icon: Clock,
      gradient: 'from-green-500 to-green-600',
      change: '5 this week',
      changeType: 'positive'
    },
    { 
      label: 'Pending Requests', 
      value: appointmentRequests.length, 
      icon: User,
      gradient: 'from-orange-500 to-orange-600',
      change: '2 require attention',
      changeType: 'warning'
    },
    { 
      label: 'Completed', 
      value: appointments.filter(a => a.status === 'completed').length, 
      icon: CheckCircle,
      gradient: 'from-purple-500 to-purple-600',
      change: 'This month',
      changeType: 'neutral'
    }
  ];

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesDate = !selectedDate || appointment.date === selectedDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: { 
        bg: 'bg-blue-100 dark:bg-blue-900/30', 
        text: 'text-blue-800 dark:text-blue-300', 
        label: 'Scheduled', 
        icon: Clock 
      },
      confirmed: { 
        bg: 'bg-green-100 dark:bg-green-900/30', 
        text: 'text-green-800 dark:text-green-300', 
        label: 'Confirmed', 
        icon: CheckCircle 
      },
      completed: { 
        bg: 'bg-gray-100 dark:bg-gray-800', 
        text: 'text-gray-800 dark:text-gray-300', 
        label: 'Completed', 
        icon: CheckCircle 
      },
      cancelled: { 
        bg: 'bg-red-100 dark:bg-red-900/30', 
        text: 'text-red-800 dark:text-red-300', 
        label: 'Cancelled', 
        icon: XCircle 
      }
    };
    const badge = badges[status] || badges.scheduled;
    const Icon = badge.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text} flex items-center space-x-1`}>
        <Icon className="w-3 h-3" />
        <span>{badge.label}</span>
      </span>
    );
  };

  // Calendar Functions
  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAppointmentsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateString);
  };

  const handleCall = (phoneNumber, patientName) => {
    toast.success(`Calling ${patientName} at ${phoneNumber}`);
  };

  const handleViewPatient = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleSendMessage = (phoneNumber, patientName) => {
    toast.success(`SMS reminder sent to ${patientName}`);
  };

  const handleSendEmail = (email, patientName) => {
    toast.success(`Email sent to ${patientName}`);
  };

  const handleComplete = (id) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'completed' } : apt
    ));
    toast.success('Appointment marked as completed!');
  };

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: 'cancelled' } : apt
      ));
      toast.success('Appointment cancelled');
    }
  };

  const handleReschedule = (appointment) => {
    const newDate = prompt('Enter new date (YYYY-MM-DD):', appointment.date);
    const newTime = prompt('Enter new time:', appointment.time);
    
    if (newDate && newTime) {
      setAppointments(appointments.map(apt => 
        apt.id === appointment.id 
          ? { ...apt, date: newDate, time: newTime, status: 'scheduled' }
          : apt
      ));
      toast.success('Appointment rescheduled!');
    }
  };

  // Request Management
  const handleApproveRequest = (requestId) => {
    const request = appointmentRequests.find(req => req.id === requestId);
    if (request) {
      const newAppointment = {
        id: `APT${String(appointments.length + 1).padStart(3, '0')}`,
        patientId: request.patientId,
        patient: request.patient,
        age: request.age,
        gender: request.gender,
        phone: request.phone,
        email: request.email,
        date: request.preferredDates[0],
        time: '10:00 AM',
        reason: request.reason,
        status: 'scheduled',
        notes: request.notes,
        avatar: request.patient.split(' ').map(n => n[0]).join(''),
        type: 'consultation',
        location: 'Room 101',
        bloodGroup: 'Unknown',
        allergies: 'None'
      };
      
      setAppointments([...appointments, newAppointment]);
      setAppointmentRequests(appointmentRequests.filter(req => req.id !== requestId));
      toast.success('Appointment request approved!');
    }
  };

  const handleRejectRequest = (requestId) => {
    if (window.confirm('Are you sure you want to reject this appointment request?')) {
      setAppointmentRequests(appointmentRequests.filter(req => req.id !== requestId));
      toast.success('Appointment request rejected');
    }
  };

  const toggleAppointmentExpand = (appointmentId) => {
    setExpandedAppointment(expandedAppointment === appointmentId ? null : appointmentId);
  };

  // Calendar Component
  const CalendarView = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-24 p-1 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayAppointments = getAppointmentsForDate(date);
      
      calendarDays.push(
        <div key={day} className="h-24 p-1 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
          <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">{day}</div>
          <div className="space-y-1 max-h-16 overflow-y-auto">
            {dayAppointments.map(apt => (
              <div 
                key={apt.id}
                className={`text-xs p-1 rounded truncate ${
                  apt.status === 'completed' ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300' :
                  apt.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                }`}
                title={`${apt.time} - ${apt.patient}`}
              >
                {apt.time} - {apt.patient.split(' ')[0]}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button 
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCalendarView('month')}
              className={`px-3 py-1 rounded-lg text-sm ${
                calendarView === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Month
            </button>
            <button 
              onClick={() => setCalendarView('week')}
              className={`px-3 py-1 rounded-lg text-sm ${
                calendarView === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Week
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays}
        </div>

        {/* Calendar Legend */}
        <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/30 rounded"></div>
            <span>Scheduled</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-100 dark:bg-red-900/30 rounded"></div>
            <span>Cancelled</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Appointments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your patient appointments</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowRequests(!showRequests)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              showRequests 
                ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300' 
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            View Requests ({appointmentRequests.length})
          </button>
          <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {viewMode === 'list' ? 'Calendar View' : 'List View'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-200`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-10'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-white text-opacity-90 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-4xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Appointment Requests Section */}
      {showRequests && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Appointment Requests</h2>
            <span className="text-sm text-gray-600 dark:text-gray-400">{appointmentRequests.length} pending requests</span>
          </div>
          <div className="space-y-4">
            {appointmentRequests.map(request => (
              <div key={request.id} className="flex items-center justify-between p-4 border border-orange-200 dark:border-orange-800 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-semibold">
                    {request.patient.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{request.patient}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{request.reason}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Preferred dates: {request.preferredDates.join(', ')} • {request.requestedBy}
                    </p>
                    {request.notes && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{request.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApproveRequest(request.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && <CalendarView />}

      {/* Filters - Only show in list view */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button 
              onClick={() => toast.success('Export functionality - will implement with backend')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      )}

      {/* Appointments List - Only show in list view */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No appointments found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Try changing your filters or check the calendar view</p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold flex-shrink-0">
                      {appointment.avatar}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{appointment.patient}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ID: {appointment.patientId} • {appointment.age}y • {appointment.gender}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(appointment.status)}
                          <button 
                            onClick={() => toggleAppointmentExpand(appointment.id)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                          >
                            {expandedAppointment === appointment.id ? 
                              <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : 
                              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            }
                          </button>
                        </div>
                      </div>

                      {/* Basic Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{appointment.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{appointment.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{appointment.location}</span>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedAppointment === appointment.id && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                              <p className="text-sm text-gray-900 dark:text-white">{appointment.email}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</p>
                              <p className="text-sm text-gray-900 dark:text-white">{appointment.duration} mins</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Blood Group</p>
                              <p className="text-sm text-gray-900 dark:text-white">{appointment.bloodGroup}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Allergies</p>
                              <p className="text-sm text-gray-900 dark:text-white">{appointment.allergies}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Reason & Notes */}
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Visit</p>
                        <p className="text-sm text-gray-900 dark:text-white">{appointment.reason}</p>
                        {appointment.notes && (
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">
                            <strong>Note:</strong> {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 ml-4">
                    <button 
                      onClick={() => handleViewPatient(appointment)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    
                    <button 
                      onClick={() => handleCall(appointment.phone, appointment.patient)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </button>

                    {/* Quick Actions */}
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleSendMessage(appointment.phone, appointment.patient)}
                        className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs flex items-center justify-center"
                      >
                        <MessageCircle className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => handleSendEmail(appointment.email, appointment.patient)}
                        className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs flex items-center justify-center"
                      >
                        <Mail className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Status Actions */}
                    {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                      <>
                        <button
                          onClick={() => handleComplete(appointment.id)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Complete</span>
                        </button>
                        <button
                          onClick={() => handleReschedule(appointment)}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium flex items-center space-x-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Reschedule</span>
                        </button>
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-2"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Patient Details</h3>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-xl">
                  {selectedAppointment.avatar}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedAppointment.patient}</h4>
                  <p className="text-gray-600 dark:text-gray-400">ID: {selectedAppointment.patientId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Age & Gender</p>
                  <p className="text-gray-900 dark:text-white">{selectedAppointment.age} years, {selectedAppointment.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Blood Group</p>
                  <p className="text-gray-900 dark:text-white">{selectedAppointment.bloodGroup}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</p>
                  <p className="text-gray-900 dark:text-white">{selectedAppointment.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                  <p className="text-gray-900 dark:text-white">{selectedAppointment.email}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Appointment Details</p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-900 dark:text-white"><strong>Date & Time:</strong> {selectedAppointment.date} at {selectedAppointment.time}</p>
                  <p className="mt-2 text-gray-900 dark:text-white"><strong>Reason:</strong> {selectedAppointment.reason}</p>
                  <p className="mt-2 text-gray-900 dark:text-white"><strong>Location:</strong> {selectedAppointment.location}</p>
                  {selectedAppointment.notes && (
                    <p className="mt-2 text-gray-900 dark:text-white"><strong>Notes:</strong> {selectedAppointment.notes}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleCall(selectedAppointment.phone, selectedAppointment.patient)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Patient</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;