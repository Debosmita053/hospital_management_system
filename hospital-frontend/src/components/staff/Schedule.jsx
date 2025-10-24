import React, { useContext } from 'react';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';

const Schedule = () => {
  const { user } = useContext(AuthContext);

  const schedule = {
    Monday: { enabled: true, shift: 'Morning (6 AM - 2 PM)', location: user?.role === 'nurse' ? 'ICU - Floor 2' : user?.role === 'lab_technician' ? 'Lab - A' : user?.role === 'pharmacist' ? 'Pharmacy' : 'Ward - Floor 2' },
    Tuesday: { enabled: true, shift: 'Morning (6 AM - 2 PM)', location: user?.role === 'nurse' ? 'ICU - Floor 2' : user?.role === 'lab_technician' ? 'Lab - A' : user?.role === 'pharmacist' ? 'Pharmacy' : 'Ward - Floor 2' },
    Wednesday: { enabled: true, shift: 'Morning (6 AM - 2 PM)', location: user?.role === 'nurse' ? 'ICU - Floor 2' : user?.role === 'lab_technician' ? 'Lab - A' : user?.role === 'pharmacist' ? 'Pharmacy' : 'Ward - Floor 2' },
    Thursday: { enabled: true, shift: 'Morning (6 AM - 2 PM)', location: user?.role === 'nurse' ? 'ICU - Floor 2' : user?.role === 'lab_technician' ? 'Lab - A' : user?.role === 'pharmacist' ? 'Pharmacy' : 'Ward - Floor 2' },
    Friday: { enabled: true, shift: 'Morning (6 AM - 2 PM)', location: user?.role === 'nurse' ? 'ICU - Floor 2' : user?.role === 'lab_technician' ? 'Lab - A' : user?.role === 'pharmacist' ? 'Pharmacy' : 'Ward - Floor 2' },
    Saturday: { enabled: false, shift: 'Off Day', location: '-' },
    Sunday: { enabled: false, shift: 'Off Day', location: '-' }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getTotalHours = () => {
    return Object.values(schedule).filter(day => day.enabled).length * 8;
  };

  const getWorkingDays = () => {
    return Object.values(schedule).filter(day => day.enabled).length;
  };

  // Stats with gradient colors and icons
  const stats = [
    { 
      label: 'Working Days', 
      value: getWorkingDays(), 
      icon: Calendar, 
      gradient: 'from-blue-500 to-blue-600',
      description: 'This week'
    },
    { 
      label: 'Total Hours', 
      value: `${getTotalHours()}h`, 
      icon: Clock, 
      gradient: 'from-green-500 to-green-600',
      description: 'Weekly hours'
    },
    { 
      label: 'Current Week', 
      value: 'Oct 21-27', 
      icon: TrendingUp, 
      gradient: 'from-purple-500 to-purple-600',
      description: 'Schedule period'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Schedule</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">View your weekly work schedule</p>
      </div>

      {/* Stats with Gradient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
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

      {/* Weekly Schedule */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Weekly Schedule</h2>
        
        <div className="space-y-4">
          {days.map((day) => {
            const daySchedule = schedule[day];
            return (
              <div key={day} className={`p-4 rounded-lg border-2 ${
                daySchedule.enabled 
                  ? 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      daySchedule.enabled ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-600'
                    }`}>
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{day}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{daySchedule.location}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {daySchedule.enabled ? (
                      <>
                        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-medium">
                          <Clock className="w-4 h-4" />
                          <span>{daySchedule.shift}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">8 hours</p>
                      </>
                    ) : (
                      <span className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                        Off Day
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shift Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Shift Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg">
            <p className="text-blue-100 text-sm mb-1">Morning Shift</p>
            <p className="font-semibold text-lg">6:00 AM - 2:00 PM</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg">
            <p className="text-purple-100 text-sm mb-1">Evening Shift</p>
            <p className="font-semibold text-lg">2:00 PM - 10:00 PM</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg">
            <p className="text-orange-100 text-sm mb-1">Night Shift</p>
            <p className="font-semibold text-lg">10:00 PM - 6:00 AM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;