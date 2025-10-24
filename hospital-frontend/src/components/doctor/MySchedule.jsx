import React, { useState} from 'react';
import { Calendar, Clock, Plus, Edit2, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const MySchedule = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);

  const [schedule, setSchedule] = useState({
    Monday: [
      { id: 1, startTime: '09:00', endTime: '12:00', status: 'available', slots: 6, type: 'regular' },
      { id: 2, startTime: '14:00', endTime: '17:00', status: 'available', slots: 6, type: 'regular' }
    ],
    Tuesday: [
      { id: 3, startTime: '09:00', endTime: '12:00', status: 'available', slots: 6, type: 'regular' },
      { id: 4, startTime: '14:00', endTime: '17:00', status: 'available', slots: 6, type: 'regular' }
    ],
    Wednesday: [
      { id: 5, startTime: '09:00', endTime: '12:00', status: 'available', slots: 6, type: 'regular' }
    ],
    Thursday: [
      { id: 6, startTime: '09:00', endTime: '12:00', status: 'available', slots: 6, type: 'regular' },
      { id: 7, startTime: '14:00', endTime: '17:00', status: 'available', slots: 6, type: 'regular' }
    ],
    Friday: [
      { id: 8, startTime: '09:00', endTime: '13:00', status: 'available', slots: 8, type: 'regular' }
    ],
    Saturday: [
      { id: 9, startTime: '09:00', endTime: '12:00', status: 'available', slots: 6, type: 'regular' }
    ],
    Sunday: []
  });

  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    status: 'available',
    type: 'regular'
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAddSlot = () => {
    setEditMode(false);
    setFormData({ startTime: '', endTime: '', status: 'available', type: 'regular' });
    setShowModal(true);
  };

  const handleEditSlot = (slot) => {
    setEditMode(true);
    setCurrentSlot(slot);
    setFormData({
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: slot.status,
      type: slot.type || 'regular'
    });
    setShowModal(true);
  };

  const handleDeleteSlot = (slotId) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      setSchedule({
        ...schedule,
        [selectedDay]: schedule[selectedDay].filter(s => s.id !== slotId)
      });
      toast.success('Time slot deleted');
    }
  };

  const calculateSlots = (start, end) => {
    const startHour = parseInt(start.split(':')[0]);
    const startMinute = parseInt(start.split(':')[1]);
    const endHour = parseInt(end.split(':')[0]);
    const endMinute = parseInt(end.split(':')[1]);
    
    const totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    return Math.floor(totalMinutes / 30); // 30-minute slots
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const slots = calculateSlots(formData.startTime, formData.endTime);
    
    if (slots <= 0) {
      toast.error('End time must be after start time');
      return;
    }

    if (editMode) {
      setSchedule({
        ...schedule,
        [selectedDay]: schedule[selectedDay].map(s => 
          s.id === currentSlot.id ? { ...s, ...formData, slots } : s
        )
      });
      toast.success('Time slot updated!');
    } else {
      const newSlot = {
        id: Date.now(),
        ...formData,
        slots
      };
      setSchedule({
        ...schedule,
        [selectedDay]: [...schedule[selectedDay], newSlot].sort((a, b) => 
          a.startTime.localeCompare(b.startTime)
        )
      });
      toast.success('Time slot added!');
    }
    
    setShowModal(false);
  };

  const getTotalSlots = (day) => {
    return schedule[day].reduce((sum, slot) => sum + slot.slots, 0);
  };

  const getTotalWeeklySlots = () => {
    return days.reduce((sum, day) => sum + getTotalSlots(day), 0);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Schedule</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your availability and appointment slots</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Weekly Slots</p>
              <p className="text-3xl font-bold">{getTotalWeeklySlots()}</p>
            </div>
            <div className="p-3 bg-blue-400 bg-opacity-20 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100">Available Days</p>
              <p className="text-3xl font-bold">
                {days.filter(day => schedule[day].length > 0).length}/7
              </p>
            </div>
            <div className="p-3 bg-green-400 bg-opacity-20 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100">Daily Slots</p>
              <p className="text-3xl font-bold">{getTotalSlots(selectedDay)}</p>
            </div>
            <div className="p-3 bg-purple-400 bg-opacity-20 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex space-x-2 overflow-x-auto">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedDay === day
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {day}
              <span className="ml-2 text-xs opacity-75">
                ({getTotalSlots(day)} slots)
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Schedule for Selected Day */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedDay}'s Schedule</h2>
          <button
            onClick={handleAddSlot}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Add Time Slot</span>
          </button>
        </div>

        {schedule[selectedDay].length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No time slots scheduled for {selectedDay}</p>
            <button
              onClick={handleAddSlot}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add First Time Slot
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {schedule[selectedDay].map((slot) => (
              <div key={slot.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {slot.startTime} - {slot.endTime}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {slot.slots} appointment slots • 30 minutes each
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    slot.status === 'available' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-300'
                  }`}>
                    {slot.status === 'available' ? 'Available' : 'Unavailable'}
                  </span>
                  <button
                    onClick={() => handleEditSlot(slot)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Regular Slot Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editMode ? 'Edit Time Slot' : 'Add Time Slot'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Note:</strong> Slots are 30 minutes each. 
                  {formData.startTime && formData.endTime && (
                    <span className="block mt-1">
                      This will create <strong>{calculateSlots(formData.startTime, formData.endTime)}</strong> appointment slots.
                    </span>
                  )}
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editMode ? 'Update' : 'Add'} Slot
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySchedule;