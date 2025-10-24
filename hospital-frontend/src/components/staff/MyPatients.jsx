import React, { useState, useContext } from 'react';
import { Search, Phone, Eye, Users, Activity, Calendar, AlertCircle } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const MyPatients = () => {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');

  const patients = [
    { 
      id: 1, 
      name: 'John Smith', 
      age: 45, 
      gender: 'Male',
      room: '101', 
      condition: 'Stable',
      diagnosis: 'Hypertension',
      lastVitals: { bp: '120/80', temp: '98.6°F', pulse: '72', spo2: '98%' },
      medications: ['Amlodipine 5mg', 'Aspirin 81mg'],
      lastCheck: '2 hours ago',
      assignedDate: '2025-10-15'
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      age: 32, 
      gender: 'Female',
      room: '102', 
      condition: 'Improving',
      diagnosis: 'Diabetes Type 2',
      lastVitals: { bp: '130/85', temp: '98.4°F', pulse: '78', spo2: '97%' },
      medications: ['Metformin 500mg', 'Glipizide 5mg'],
      lastCheck: '1 hour ago',
      assignedDate: '2025-10-18'
    },
    { 
      id: 3, 
      name: 'Mike Wilson', 
      age: 58, 
      gender: 'Male',
      room: '103', 
      condition: 'Critical',
      diagnosis: 'Post-Surgery Recovery',
      lastVitals: { bp: '140/90', temp: '99.1°F', pulse: '88', spo2: '95%' },
      medications: ['Pain Management', 'Antibiotics'],
      lastCheck: '30 mins ago',
      assignedDate: '2025-10-17'
    },
    { 
      id: 4, 
      name: 'Emily Davis', 
      age: 28, 
      gender: 'Female',
      room: '104', 
      condition: 'Stable',
      diagnosis: 'Pneumonia',
      lastVitals: { bp: '118/75', temp: '98.8°F', pulse: '70', spo2: '96%' },
      medications: ['Amoxicillin', 'Cough Syrup'],
      lastCheck: '3 hours ago',
      assignedDate: '2025-10-19'
    }
  ];

  // Calculate stats
  const stats = {
    totalPatients: patients.length,
    stable: patients.filter(p => p.condition === 'Stable').length,
    critical: patients.filter(p => p.condition === 'Critical').length,
    recent: patients.filter(p => p.lastCheck.includes('mins') || p.lastCheck.includes('hour')).length
  };

  // Stats cards with gradient colors
  const statCards = [
    { 
      label: 'Total Patients', 
      value: stats.totalPatients, 
      icon: Users, 
      gradient: 'from-blue-500 to-blue-600',
      description: 'Under your care'
    },
    { 
      label: 'Stable', 
      value: stats.stable, 
      icon: Activity, 
      gradient: 'from-green-500 to-green-600',
      description: 'Good condition'
    },
    { 
      label: 'Critical', 
      value: stats.critical, 
      icon: AlertCircle, 
      gradient: 'from-red-500 to-red-600',
      description: 'Need attention'
    },
    { 
      label: 'Recent Checks', 
      value: stats.recent, 
      icon: Calendar, 
      gradient: 'from-purple-500 to-purple-600',
      description: 'Last hour'
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.room.includes(searchTerm)
  );

  const getConditionColor = (condition) => {
  const colors = {
    'Stable': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    'Improving': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    'Critical': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    'Under Observation': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
  };
  return colors[condition] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
};

  const getRoleSpecificTitle = () => {
    const titles = {
      nurse: 'My Assigned Patients',
      lab_technician: 'Patients - Test Requests',
      pharmacist: 'Patients - Prescriptions',
      ward_boy: 'Patients in My Rooms'
    };
    return titles[user?.role] || 'My Patients';
  };

  // Handler functions for buttons
  const handleViewPatient = (patient) => {
    // This would navigate to patient details page in real app
    console.log('Viewing patient:', patient.name);
    toast.success(`Viewing ${patient.name}'s details`);
    // In real app: navigate(`/staff/patients/${patient.id}`);
  };

  const handleCallPatient = (patient) => {
    // This would initiate a call in real app
    console.log('Calling patient:', patient.name);
    toast.success(`Calling ${patient.name} in room ${patient.room}`);
    // In real app: initiate call system
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{getRoleSpecificTitle()}</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">View and manage patient information</p>
      </div>

      {/* Stats Grid with Gradient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className={`bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white text-opacity-90 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-white text-opacity-75 text-xs">{stat.description}</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by patient name or room number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
    </div>
      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-xl">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{patient.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{patient.age}y • {patient.gender} • Room {patient.room}</p>
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mt-2 ${getConditionColor(patient.condition)}`}>
                    {patient.condition}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">Diagnosis</p>
                <p className="text-sm text-gray-900 dark:text-white">{patient.diagnosis}</p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">Last Vitals</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-900 dark:text-white">
                  <p>BP: {patient.lastVitals.bp}</p>
                  <p>Temp: {patient.lastVitals.temp}</p>
                  <p>Pulse: {patient.lastVitals.pulse}</p>
                  <p>SpO2: {patient.lastVitals.spo2}</p>
                </div>
              </div>

              {user?.role === 'nurse' && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">Medications</p>
                  <ul className="text-sm text-gray-900 dark:text-white space-y-1">
                    {patient.medications.map((med, index) => (
                      <li key={index}>• {med}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700 pt-4">
                <p>Last checked: {patient.lastCheck}</p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewPatient(patient)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button 
                    onClick={() => handleCallPatient(patient)}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPatients;