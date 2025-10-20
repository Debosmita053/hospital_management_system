
import { Calendar, Users, ClipboardList,  TrendingUp,  Pill } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  // Mock data
  const stats = [
    { 
      label: "Total Patients", 
      value: 145, 
      icon: Users, 
      gradient: 'from-blue-500 to-blue-600',
      change: '+5 this week',
      changeType: 'positive'
    },
    { 
      label: "Today's Appointments", 
      value: 8, 
      icon: Calendar, 
      gradient: 'from-green-500 to-green-600',
      change: '+2 from yesterday',
      changeType: 'positive'
    },
    { 
      label: "Pending Lab Reports", 
      value: 12, 
      icon: ClipboardList, 
      gradient: 'from-purple-500 to-purple-600',
      change: '3 critical',
      changeType: 'warning'
    },
    { 
      label: "Prescriptions Issued", 
      value: 34, 
      icon: Pill, 
      gradient: 'from-orange-500 to-orange-600',
      change: 'This month',
      changeType: 'neutral'
    }
  ];

  const todaysAppointments = [
    { id: 1, time: '09:00 AM', patient: 'John Smith', age: 45, reason: 'Regular Checkup', status: 'upcoming', avatar: 'JS' },
    { id: 2, time: '09:30 AM', patient: 'Sarah Johnson', age: 32, reason: 'Follow-up', status: 'in-progress', avatar: 'SJ' },
    { id: 3, time: '10:00 AM', patient: 'Mike Wilson', age: 58, reason: 'Blood Pressure', status: 'upcoming', avatar: 'MW' },
    { id: 4, time: '10:30 AM', patient: 'Emily Davis', age: 28, reason: 'Fever & Cold', status: 'upcoming', avatar: 'ED' },
    { id: 5, time: '02:00 PM', patient: 'Robert Brown', age: 52, reason: 'Emergency', status: 'urgent', avatar: 'RB' }
  ];

  const recentPatients = [
    { id: 1, name: 'Robert Brown', age: 52, lastVisit: '2 days ago', condition: 'Diabetes Management', status: 'Stable', avatar: 'RB' },
    { id: 2, name: 'Lisa Anderson', age: 38, lastVisit: '1 week ago', condition: 'Hypertension', status: 'Critical', avatar: 'LA' },
    { id: 3, name: 'David Miller', age: 45, lastVisit: '3 days ago', condition: 'Post Surgery', status: 'Recovering', avatar: 'DM' }
  ];

  const notifications = [
    { id: 1, type: 'patient', message: 'New patient John Doe assigned to you', time: '5 mins ago', urgent: false },
    { id: 2, type: 'lab', message: 'Lab report ready for Sarah Johnson', time: '15 mins ago', urgent: true },
    { id: 3, type: 'appointment', message: 'Appointment reminder: Mike Wilson at 10:00 AM', time: '1 hour', urgent: false }
  ];

  // Weekly patient visits data for chart
  const weeklyData = [
    { day: 'Mon', visits: 12 },
    { day: 'Tue', visits: 15 },
    { day: 'Wed', visits: 10 },
    { day: 'Thu', visits: 18 },
    { day: 'Fri', visits: 14 },
    { day: 'Sat', visits: 8 },
    { day: 'Sun', visits: 5 }
  ];

  const maxVisits = Math.max(...weeklyData.map(d => d.visits));

  const getStatusColor = (status) => {
    const colors = {
      'upcoming': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'urgent': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getConditionColor = (status) => {
    const colors = {
      'Stable': 'bg-green-100 text-green-800',
      'Critical': 'bg-red-100 text-red-800',
      'Recovering': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleStartConsultation = (appointment) => {
    // Update appointment status to in-progress
    const confirmed = window.confirm(`Start consultation with ${appointment.patient}?`);
    if (confirmed) {
      alert(`Starting consultation with ${appointment.patient}\n\nFeatures:\n✓ Record vital signs\n✓ Add diagnosis\n✓ Write prescription\n✓ Order lab tests\n✓ Update medical records`);
      // In a real app, this would navigate to a consultation page
      // navigate(`/doctor/consultation/${appointment.id}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, Dr. Smith! 👋</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your patients today</p>
      </div>

      {/* Colorful Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <div key={index} className={`bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' ? 'bg-white bg-opacity-20' :
                  stat.changeType === 'warning' ? 'bg-red-500 bg-opacity-50' :
                  'bg-white bg-opacity-10'
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

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/doctor/appointments" className="flex items-center gap-4 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-500 transition-colors">
              <Calendar className="w-6 h-6 text-blue-600 group-hover:text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">View Appointments</p>
              <p className="text-sm text-gray-500">Manage your schedule</p>
            </div>
          </Link>

          <Link to="/doctor/prescriptions" className="flex items-center gap-4 p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group">
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-500 transition-colors">
              <Pill className="w-6 h-6 text-green-600 group-hover:text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Add Prescription</p>
              <p className="text-sm text-gray-500">Write new prescription</p>
            </div>
          </Link>

          <Link to="/doctor/records" className="flex items-center gap-4 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group">
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-500 transition-colors">
              <ClipboardList className="w-6 h-6 text-purple-600 group-hover:text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Request Lab Test</p>
              <p className="text-sm text-gray-500">Order diagnostic tests</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Today's Appointments</h2>
            <Link to="/doctor/appointments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          
          <div className="space-y-4">
            {todaysAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                    {appointment.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{appointment.patient}</p>
                    <p className="text-sm text-gray-600">{appointment.reason} • Age {appointment.age}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleStartConsultation(appointment)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg text-sm font-medium"
                  >
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Weekly Patient Visits Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Weekly Patient Visits</h2>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-3">
              {weeklyData.map((data, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 w-8">{data.day}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-2 transition-all"
                      style={{ width: `${(data.visits / maxVisits) * 100}%` }}
                    >
                      <span className="text-xs font-semibold text-white">{data.visits}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-semibold text-green-600">94.5%</span>
              </div>
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Patients</h2>
              <Link to="/doctor/patients" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-md">
                    {patient.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900 text-sm">{patient.name}</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getConditionColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{patient.condition}</p>
                    <p className="text-xs text-gray-500">{patient.lastVisit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                {notifications.filter(n => n.urgent).length} Urgent
              </span>
            </div>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg ${
                  notification.urgent ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className={`p-2 rounded-lg ${
                    notification.urgent ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {notification.type === 'patient' && <Users className="w-4 h-4 text-blue-600" />}
                    {notification.type === 'lab' && <ClipboardList className="w-4 h-4 text-red-600" />}
                    {notification.type === 'appointment' && <Calendar className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;