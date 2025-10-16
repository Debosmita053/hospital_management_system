// ============================================
// FILE 1: src/components/admin/RoomManagement.jsx
// ============================================
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Bed, DoorOpen, AlertCircle, X, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const RoomManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: 'general_ward',
    floor: '1',
    capacity: '1',
    chargePerDay: '',
    department: '',
  });

  // Mock rooms data
  const [rooms, setRooms] = useState([
    {
      id: 1,
      roomNumber: 'ICU-101',
      roomType: 'icu',
      floor: 1,
      capacity: 1,
      currentOccupancy: 1,
      status: 'occupied',
      chargePerDay: 500,
      department: 'Emergency',
      assignedStaff: ['Nurse Jane', 'Ward Boy Mike'],
    },
    {
      id: 2,
      roomNumber: 'PVT-201',
      roomType: 'private',
      floor: 2,
      capacity: 1,
      currentOccupancy: 0,
      status: 'available',
      chargePerDay: 300,
      department: 'General',
      assignedStaff: ['Nurse Sarah'],
    },
    {
      id: 3,
      roomNumber: 'GEN-301',
      roomType: 'general_ward',
      floor: 3,
      capacity: 4,
      currentOccupancy: 2,
      status: 'available',
      chargePerDay: 150,
      department: 'General',
      assignedStaff: ['Nurse Emily', 'Ward Boy John'],
    },
    {
      id: 4,
      roomNumber: 'ICU-102',
      roomType: 'icu',
      floor: 1,
      capacity: 1,
      currentOccupancy: 0,
      status: 'maintenance',
      chargePerDay: 500,
      department: 'Emergency',
      assignedStaff: [],
    },
    {
      id: 5,
      roomNumber: 'PVT-202',
      roomType: 'private',
      floor: 2,
      capacity: 1,
      currentOccupancy: 1,
      status: 'occupied',
      chargePerDay: 300,
      department: 'Cardiology',
      assignedStaff: ['Nurse Lisa'],
    },
    {
      id: 6,
      roomNumber: 'SEMI-203',
      roomType: 'semi_private',
      floor: 2,
      capacity: 2,
      currentOccupancy: 1,
      status: 'available',
      chargePerDay: 200,
      department: 'General',
      assignedStaff: ['Nurse Amy'],
    },
  ]);

  const handleOpenModal = (room = null) => {
    if (room) {
      setSelectedRoom(room);
      setFormData({
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        floor: room.floor.toString(),
        capacity: room.capacity.toString(),
        chargePerDay: room.chargePerDay.toString(),
        department: room.department,
      });
    } else {
      setSelectedRoom(null);
      setFormData({
        roomNumber: '',
        roomType: 'general_ward',
        floor: '1',
        capacity: '1',
        chargePerDay: '',
        department: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedRoom) {
      // Update existing room
      setRooms(
        rooms.map((room) =>
          room.id === selectedRoom.id
            ? {
                ...room,
                roomNumber: formData.roomNumber,
                roomType: formData.roomType,
                floor: parseInt(formData.floor),
                capacity: parseInt(formData.capacity),
                chargePerDay: parseFloat(formData.chargePerDay),
                department: formData.department,
              }
            : room
        )
      );
      toast.success('Room updated successfully!');
    } else {
      // Add new room
      const newRoom = {
        id: rooms.length + 1,
        roomNumber: formData.roomNumber,
        roomType: formData.roomType,
        floor: parseInt(formData.floor),
        capacity: parseInt(formData.capacity),
        currentOccupancy: 0,
        status: 'available',
        chargePerDay: parseFloat(formData.chargePerDay),
        department: formData.department,
        assignedStaff: [],
      };
      setRooms([...rooms, newRoom]);
      toast.success('Room created successfully!');
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter((room) => room.id !== id));
      toast.success('Room deleted successfully!');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Filter rooms
  const filteredRooms = rooms.filter((room) => {
    const matchesType = filterType === 'all' || room.roomType === filterType;
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    return matchesType && matchesStatus;
  });

  // Calculate stats
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.status === 'available').length;
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length;
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const totalOccupied = rooms.reduce((sum, r) => sum + r.currentOccupancy, 0);
  const occupancyRate = ((totalOccupied / totalCapacity) * 100).toFixed(1);

  const getRoomTypeLabel = (type) => {
    const types = {
      icu: 'ICU',
      private: 'Private',
      semi_private: 'Semi-Private',
      general_ward: 'General Ward',
      operation_theater: 'Operation Theater',
      emergency: 'Emergency',
    };
    return types[type] || type;
  };

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-800 border-green-200',
      occupied: 'bg-red-100 text-red-800 border-red-200',
      maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      reserved: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    if (status === 'available') return <DoorOpen className="h-4 w-4" />;
    if (status === 'occupied') return <Bed className="h-4 w-4" />;
    if (status === 'maintenance') return <AlertCircle className="h-4 w-4" />;
    return <Bed className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600 mt-1">Manage hospital rooms and bed assignments</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Room</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rooms</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalRooms}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bed className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{availableRooms}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DoorOpen className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Occupied</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{occupiedRooms}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Bed className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Occupancy Rate</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{occupancyRate}%</p>
              <p className="text-xs text-gray-500 mt-1">{totalOccupied}/{totalCapacity} beds</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="icu">ICU</option>
              <option value="private">Private</option>
              <option value="semi_private">Semi-Private</option>
              <option value="general_ward">General Ward</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Room Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{room.roomNumber}</h3>
                  <p className="text-sm text-gray-500">Floor {room.floor}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenModal(room)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Room Type and Status */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                  {getRoomTypeLabel(room.roomType)}
                </span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${getStatusColor(room.status)}`}>
                  {getStatusIcon(room.status)}
                  {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </span>
              </div>

              {/* Capacity */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Capacity</span>
                  <span className="text-sm font-medium text-gray-900">
                    {room.currentOccupancy}/{room.capacity} beds
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      room.currentOccupancy === room.capacity
                        ? 'bg-red-500'
                        : room.currentOccupancy > 0
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(room.currentOccupancy / room.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Department and Charge */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Department</span>
                  <span className="text-sm font-medium text-gray-900">{room.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Charge/Day</span>
                  <span className="text-sm font-bold text-green-600">${room.chargePerDay}</span>
                </div>
              </div>

              {/* Assigned Staff */}
              {room.assignedStaff.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-600">Assigned Staff</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {room.assignedStaff.map((staff, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {staff}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Room Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedRoom ? 'Edit Room' : 'Add New Room'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Number *
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  required
                  value={formData.roomNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., ICU-101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type *
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="icu">ICU</option>
                  <option value="private">Private</option>
                  <option value="semi_private">Semi-Private</option>
                  <option value="general_ward">General Ward</option>
                  <option value="operation_theater">Operation Theater</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor *
                  </label>
                  <input
                    type="number"
                    name="floor"
                    required
                    min="1"
                    value={formData.floor}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Charge per Day ($) *
                </label>
                <input
                  type="number"
                  name="chargePerDay"
                  required
                  min="0"
                  step="0.01"
                  value={formData.chargePerDay}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="150.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Cardiology"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {selectedRoom ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;