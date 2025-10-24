import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Users, CheckCircle, Clock, AlertCircle, Calendar, Activity, FlaskConical, Pill, Bed } from 'lucide-react';


const StaffDashboard = () => {
  const { user } = useContext(AuthContext);
  const getFirstName = () => {
    if (!user?.name) return 'Staff Member';
    return user.name.split(' ')[0]; // Get first word of the name
  };

  // Get role-specific title and icon
  const getRoleConfig = () => {
    const configs = {
      nurse: {
        title: 'Nurse',
        icon: Users,
        color: 'blue',
        stats: [
          { label: 'Assigned Patients', value: 12, icon: Users, color: 'blue', gradient: 'from-blue-500 to-blue-600' },
          { label: 'Vital Signs Recorded', value: 8, icon: Activity, color: 'green', gradient: 'from-green-500 to-green-600' },
          { label: 'Medications Due', value: 4, icon: Clock, color: 'yellow', gradient: 'from-yellow-500 to-yellow-600' },
          { label: 'Urgent Tasks', value: 2, icon: AlertCircle, color: 'red', gradient: 'from-red-500 to-red-600' }
        ],
        tasks: [
          { id: 1, patient: 'John Smith', task: 'Administer medication', time: '09:00 AM', priority: 'high', room: '101' },
          { id: 2, patient: 'Sarah Johnson', task: 'Check vital signs', time: '10:30 AM', priority: 'medium', room: '102' },
          { id: 3, patient: 'Mike Wilson', task: 'Change dressing', time: '11:00 AM', priority: 'high', room: '103' },
        ]
      },
      lab_technician: {
        title: 'Lab Technician',
        icon: FlaskConical,
        color: 'purple',
        stats: [
          { label: 'Pending Tests', value: 15, icon: FlaskConical, color: 'purple', gradient: 'from-purple-500 to-purple-600' },
          { label: 'Tests Completed', value: 23, icon: CheckCircle, color: 'green', gradient: 'from-green-500 to-green-600' },
          { label: 'Results Uploaded', value: 20, icon: Activity, color: 'blue', gradient: 'from-blue-500 to-blue-600' },
          { label: 'Urgent Tests', value: 3, icon: AlertCircle, color: 'red', gradient: 'from-red-500 to-red-600' }
        ],
        tasks: [
          { id: 1, patient: 'John Doe', task: 'Blood Test - CBC', time: '09:00 AM', priority: 'high', room: 'Lab-A' },
          { id: 2, patient: 'Jane Smith', task: 'Urine Analysis', time: '10:00 AM', priority: 'medium', room: 'Lab-B' },
          { id: 3, patient: 'Bob Wilson', task: 'X-Ray - Chest', time: '11:30 AM', priority: 'urgent', room: 'Radiology' },
        ]
      },
      pharmacist: {
        title: 'Pharmacist',
        icon: Pill,
        color: 'green',
        stats: [
          { label: 'Pending Prescriptions', value: 8, icon: Pill, color: 'yellow', gradient: 'from-yellow-500 to-yellow-600' },
          { label: 'Dispensed Today', value: 25, icon: CheckCircle, color: 'green', gradient: 'from-green-500 to-green-600' },
          { label: 'Low Stock Items', value: 5, icon: AlertCircle, color: 'red', gradient: 'from-red-500 to-red-600' },
          { label: 'Orders to Place', value: 3, icon: Clock, color: 'blue', gradient: 'from-blue-500 to-blue-600' }
        ],
        tasks: [
          { id: 1, patient: 'Alice Brown', task: 'Dispense prescription', time: '09:15 AM', priority: 'high', room: 'Pharmacy' },
          { id: 2, patient: 'Charlie Green', task: 'Medication counseling', time: '10:00 AM', priority: 'medium', room: 'Pharmacy' },
          { id: 3, patient: 'David Lee', task: 'Check medicine interaction', time: '11:00 AM', priority: 'high', room: 'Pharmacy' },
        ]
      },
      ward_boy: {
        title: 'Ward Boy',
        icon: Bed,
        color: 'orange',
        stats: [
          { label: 'Assigned Rooms', value: 6, icon: Bed, color: 'blue', gradient: 'from-blue-500 to-blue-600' },
          { label: 'Tasks Completed', value: 12, icon: CheckCircle, color: 'green', gradient: 'from-green-500 to-green-600' },
          { label: 'Pending Tasks', value: 4, icon: Clock, color: 'yellow', gradient: 'from-yellow-500 to-yellow-600' },
          { label: 'Patient Transfers', value: 2, icon: Users, color: 'purple', gradient: 'from-purple-500 to-purple-600' }
        ],
        tasks: [
          { id: 1, patient: 'Room 201', task: 'Clean and sanitize', time: '09:00 AM', priority: 'high', room: 'Ward-201' },
          { id: 2, patient: 'Patient Transfer', task: 'Transfer to ICU', time: '10:00 AM', priority: 'urgent', room: 'Ward-202' },
          { id: 3, patient: 'Room 203', task: 'Prepare for admission', time: '11:30 AM', priority: 'medium', room: 'Ward-203' },
        ]
      }
    };
    return configs[user?.role] || configs.nurse;
  };

  const config = getRoleConfig();
  const RoleIcon = config.icon;
  const firstName = getFirstName();
  
  const assignedPatients = [
    { id: 1, name: 'John Smith', room: '101', condition: 'Stable', lastCheck: '2 hours ago' },
    { id: 2, name: 'Sarah Johnson', room: '102', condition: 'Improving', lastCheck: '1 hour ago' },
    { id: 3, name: 'Mike Wilson', room: '103', condition: 'Critical', lastCheck: '30 mins ago' }
  ];

  const getPriorityColor = (priority) => {
      const colors = {
        urgent: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
        high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
        medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
        low: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
      };
      return colors[priority] || colors.medium;
    };

  const getConditionColor = (condition) => {
    const colors = {
      'Stable': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      'Improving': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      'Critical': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      'Under Observation': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
    };
    return colors[condition] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
  };

  // Get role-specific quick actions
  const getQuickActions = () => {
    const actions = {
      nurse: [
        { icon: Activity, label: 'Record Vitals', path: '/staff/patients', gradient: 'from-blue-500 to-blue-600' },
        { icon: Pill, label: 'Medications', path: '/staff/tasks', gradient: 'from-green-500 to-green-600' },
        { icon: Users, label: 'Patient List', path: '/staff/patients', gradient: 'from-purple-500 to-purple-600' },
        { icon: CheckCircle, label: 'Complete Task', path: '/staff/tasks', gradient: 'from-orange-500 to-orange-600' }
      ],
      lab_technician: [
        { icon: FlaskConical, label: 'Test Requests', path: '/staff/tasks', gradient: 'from-purple-500 to-purple-600' },
        { icon: Activity, label: 'Upload Results', path: '/staff/tasks', gradient: 'from-blue-500 to-blue-600' },
        { icon: CheckCircle, label: 'Lab Status', path: '/staff/tasks', gradient: 'from-green-500 to-green-600' },
        { icon: Calendar, label: 'Schedule', path: '/staff/schedule', gradient: 'from-orange-500 to-orange-600' }
      ],
      pharmacist: [
        { icon: Pill, label: 'Prescriptions', path: '/staff/tasks', gradient: 'from-green-500 to-green-600' },
        { icon: Activity, label: 'Inventory', path: '/staff/tasks', gradient: 'from-blue-500 to-blue-600' },
        { icon: AlertCircle, label: 'Low Stock', path: '/staff/tasks', gradient: 'from-red-500 to-red-600' },
        { icon: CheckCircle, label: 'Dispense', path: '/staff/tasks', gradient: 'from-purple-500 to-purple-600' }
      ],
      ward_boy: [
        { icon: Bed, label: 'My Rooms', path: '/staff/tasks', gradient: 'from-blue-500 to-blue-600' },
        { icon: Users, label: 'Transfers', path: '/staff/tasks', gradient: 'from-orange-500 to-orange-600' },
        { icon: CheckCircle, label: 'Tasks', path: '/staff/tasks', gradient: 'from-green-500 to-green-600' },
        { icon: Activity, label: 'Equipment', path: '/staff/tasks', gradient: 'from-purple-500 to-purple-600' }
      ]
    };
    return actions[user?.role] || actions.nurse;
  };

  const quickActions = getQuickActions();

  return (
    <div className="space-y-6">
      {/* Header - FIXED: Using firstName extracted from user.name */}
      <div className="flex items-center space-x-4">
  <div className={`p-4 bg-${config.color}-100 dark:bg-${config.color}-900/30 rounded-xl`}>
    <RoleIcon className={`w-8 h-8 text-${config.color}-600 dark:text-${config.color}-400`} />
    </div>
    <div>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      Welcome back, {firstName}! 👋
    </h1>
    <p className="text-gray-600 dark:text-gray-300 mt-1">{config.title} Dashboard - Here's your overview for today</p>
    </div>
  </div>

      {/* Stats Grid with Beautiful Gradient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {config.stats.map((stat, index) => {
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
                  <p className="text-white text-opacity-75 text-xs">Today's count</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
         <h2 className="text-xl font-bold text-gray-900 dark:text-white">Today's Tasks</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{config.tasks.length} tasks</span>
          </div>
          
          <div className="space-y-4">
            {config.tasks.map((task) => (
              <div key={task.id} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{task.room}</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">{task.task}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{task.patient}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{task.time}</p>
                  <button className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                    Mark Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Patients / Quick Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user?.role === 'ward_boy' ? 'Recent Activity' : 'Assigned Patients'}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">{assignedPatients.length} {user?.role === 'ward_boy' ? 'items' : 'patients'}</span>
          </div>
          
          <div className="space-y-4">
            {assignedPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{patient.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Room {patient.room}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last check: {patient.lastCheck}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getConditionColor(patient.condition)}`}>
                    {patient.condition}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions - Now with working links */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const ActionIcon = action.icon;
            return (
              <Link
                key={index}
                to={action.path}
                className={`flex flex-col items-center justify-center p-6 bg-gradient-to-br ${action.gradient} text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105`}
              >
                <ActionIcon className="w-8 h-8 mb-2" />
                <span className="font-medium text-center">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;