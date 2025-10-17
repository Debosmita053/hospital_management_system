import React, { useState } from 'react';
import { 
  Search, Plus, Edit2, Trash2, Users, Bed, 
  UserPlus, X, CheckCircle, AlertCircle, User 
} from 'lucide-react';
import toast from 'react-hot-toast';

const RoomManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showBedModal, setShowBedModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  // Mock data
  const [rooms, setRooms] = useState([
    {
      id: 1,
      roomNumber: '101',
      floor: 1,
      type: 'ICU',
      capacity: 2,
      occupied: 1,
      status: 'available',
      department: 'Critical Care',
      chargePerDay: 5000,
      assignedStaff: [
        { id: 1, name: 'Nurse Sarah Wilson', role: 'nurse', shift: 'Morning' },
        { id: 2, name: 'Ward Boy John', role: 'wardboy', shift: 'Night' }
      ],
      beds: [
        { id: 1, bedNumber: '101-A', status: 'occupied', patient: { id: 1, name: 'John Doe', admissionDate: '2024-10-10' } },
        { id: 2, bedNumber: '101-B', status: 'available', patient: null }
      ]
    },
    {
      id: 2,
      roomNumber: '201',
      floor: 2,
      type: 'Private',
      capacity: 1,
      occupied: 0,
      status: 'available',
      department: 'Cardiology',
      chargePerDay: 3000,
      assignedStaff: [
        { id: 3, name: 'Nurse Emily Brown', role: 'nurse', shift: 'Evening' }
      ],
      beds: [
        { id: 3, bedNumber: '201-A', status: 'available', patient: null }
      ]
    },
    {
      id: 3,
      roomNumber: '301',
      floor: 3,
      type: 'General Ward',
      capacity: 4,
      occupied: 4,
      status: 'occupied',
      department: 'General Medicine',
      chargePerDay: 1500,
      assignedStaff: [
        { id: 4, name: 'Nurse Lisa Taylor', role: 'nurse', shift: 'Morning' },
        { id: 5, name: 'Ward Boy Mike', role: 'wardboy', shift: 'Morning' },
        { id: 6, name: 'Nurse Anna Lee', role: 'nurse', shift: 'Night' }
      ],
      beds: [
        { id: 4, bedNumber: '301-A', status: 'occupied', patient: { id: 2, name: 'Jane Smith', admissionDate: '2024-10-12' } },
        { id: 5, bedNumber: '301-B', status: 'occupied', patient: { id: 3, name: 'Bob Johnson', admissionDate: '2024-10-13' } },
        { id: 6, bedNumber: '301-C', status: 'occupied', patient: { id: 4, name: 'Alice Brown', admissionDate: '2024-10-14' } },
        { id: 7, bedNumber: '301-D', status: 'occupied', patient: { id: 5, name: 'Tom Wilson', admissionDate: '2024-10-15' } }
      ]
    }
  ]);

  // Available staff for assignment
  const availableStaff = [
    { id: 1, name: 'Sarah Wilson', role: 'nurse', specialization: 'ICU Care', available: true },
    { id: 2, name: 'John Davis', role: 'wardboy', department: 'General', available: true },
    { id: 3, name: 'Emily Brown', role: 'nurse', specialization: 'Cardiology', available: true },
    { id: 4, name: 'Lisa Taylor', role: 'nurse', specialization: 'General Medicine', available: true },
    { id: 5, name: 'Mike Johnson', role: 'wardboy', department: 'Critical Care', available: true },
    { id: 6, name: 'Anna Lee', role: 'nurse', specialization: 'Emergency', available: true },
    { id: 7, name: 'Tom Brown', role: 'wardboy', department: 'General', available: true },
    { id: 8, name: 'Kate Wilson', role: 'nurse', specialization: 'Pediatrics', available: true }
  ];

  // Available patients for bed allocation
  const availablePatients = [
    { id: 6, name: 'Michael Scott', age: 45, gender: 'Male', condition: 'Post Surgery', priority: 'high' },
    { id: 7, name: 'Pam Beesly', age: 32, gender: 'Female', condition: 'Observation', priority: 'medium' },
    { id: 8, name: 'Jim Halpert', age: 38, gender: 'Male', condition: 'Recovery', priority: 'low' },
    { id: 9, name: 'Dwight Schrute', age: 40, gender: 'Male', condition: 'Emergency', priority: 'high' },
    { id: 10, name: 'Angela Martin', age: 35, gender: 'Female', condition: 'Treatment', priority: 'medium' }
  ];

  const [formData, setFormData] = useState({
    roomNumber: '',
    floor: '',
    type: 'General Ward',
    capacity: 1,
    department: '',
    chargePerDay: '',
    status: 'available'
  });

  const [selectedStaff, setSelectedStaff] = useState([]);
  const [selectedBed, setSelectedBed] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedShift, setSelectedShift] = useState('Morning');

  // Statistics
  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    occupancyRate: Math.round((rooms.reduce((sum, r) => sum + r.occupied, 0) / rooms.reduce((sum, r) => sum + r.capacity, 0)) * 100)
  };

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || room.type === filterType;
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Handle room operations
  const handleAddRoom = () => {
    setModalMode('add');
    setFormData({
      roomNumber: '',
      floor: '',
      type: 'General Ward',
      capacity: 1,
      department: '',
      chargePerDay: '',
      status: 'available'
    });
    setShowModal(true);
  };

  const handleEditRoom = (room) => {
    setModalMode('edit');
    setSelectedRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      floor: room.floor,
      type: room.type,
      capacity: room.capacity,
      department: room.department,
      chargePerDay: room.chargePerDay,
      status: room.status
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      const newRoom = {
        id: rooms.length + 1,
        ...formData,
        occupied: 0,
        assignedStaff: [],
        beds: Array.from({ length: formData.capacity }, (_, i) => ({
          id: Date.now() + i,
          bedNumber: `${formData.roomNumber}-${String.fromCharCode(65 + i)}`,
          status: 'available',
          patient: null
        }))
      };
      setRooms([...rooms, newRoom]);
      toast.success('Room added successfully!');
    } else {
      setRooms(rooms.map(room => 
        room.id === selectedRoom.id 
          ? { ...room, ...formData }
          : room
      ));
      toast.success('Room updated successfully!');
    }
    setShowModal(false);
  };

  const handleDeleteRoom = (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter(room => room.id !== id));
      toast.success('Room deleted successfully!');
    }
  };

  // Staff assignment functions
  const handleAssignStaff = (room) => {
    setSelectedRoom(room);
    setSelectedStaff([]);
    setSelectedShift('Morning');
    setShowStaffModal(true);
  };

  const handleStaffSelect = (staff) => {
    setSelectedStaff(prev => {
      const exists = prev.find(s => s.id === staff.id);
      if (exists) {
        return prev.filter(s => s.id !== staff.id);
      } else {
        return [...prev, staff];
      }
    });
  };

  const handleConfirmStaffAssignment = () => {
    const staffWithShift = selectedStaff.map(staff => ({
      ...staff,
      shift: selectedShift
    }));

    setRooms(rooms.map(room => 
      room.id === selectedRoom.id
        ? {
            ...room,
            assignedStaff: [...room.assignedStaff, ...staffWithShift]
          }
        : room
    ));

    toast.success(`${selectedStaff.length} staff member(s) assigned successfully!`);
    setShowStaffModal(false);
    setSelectedStaff([]);
  };

  const handleRemoveStaff = (roomId, staffId) => {
    setRooms(rooms.map(room => 
      room.id === roomId
        ? {
            ...room,
            assignedStaff: room.assignedStaff.filter(s => s.id !== staffId)
          }
        : room
    ));
    toast.success('Staff removed successfully!');
  };

  // Bed allocation functions
  const handleAllocateBed = (room, bed) => {
    setSelectedRoom(room);
    setSelectedBed(bed);
    setSelectedPatient(null);
    setShowBedModal(true);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const handleConfirmBedAllocation = () => {
    if (!selectedPatient) {
      toast.error('Please select a patient!');
      return;
    }

    setRooms(rooms.map(room => 
      room.id === selectedRoom.id
        ? {
            ...room,
            occupied: room.occupied + 1,
            status: room.occupied + 1 >= room.capacity ? 'occupied' : 'available',
            beds: room.beds.map(bed =>
              bed.id === selectedBed.id
                ? {
                    ...bed,
                    status: 'occupied',
                    patient: {
                      ...selectedPatient,
                      admissionDate: new Date().toISOString().split('T')[0]
                    }
                  }
                : bed
            )
          }
        : room
    ));

    toast.success(`Bed ${selectedBed.bedNumber} allocated to ${selectedPatient.name}!`);
    setShowBedModal(false);
    setSelectedPatient(null);
  };

  const handleDischargeBed = (roomId, bedId) => {
    if (window.confirm('Are you sure you want to discharge this patient?')) {
      setRooms(rooms.map(room => 
        room.id === roomId
          ? {
              ...room,
              occupied: room.occupied - 1,
              status: 'available',
              beds: room.beds.map(bed =>
                bed.id === bedId
                  ? { ...bed, status: 'available', patient: null }
                  : bed
              )
            }
          : room
      ));
      toast.success('Patient discharged successfully!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600 mt-1">Manage hospital rooms, beds, and staff assignments</p>
        </div>
        <button
          onClick={handleAddRoom}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          Add Room
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bed className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Rooms</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.available}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Occupied Rooms</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.occupied}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.occupancyRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by room number or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="ICU">ICU</option>
            <option value="Private">Private</option>
            <option value="General Ward">General Ward</option>
            <option value="OT">OT</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
          </select>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRooms.map(room => (
          <div key={room.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Room Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Bed className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Room {room.roomNumber}</h3>
                  <p className="text-sm text-gray-600">Floor {room.floor}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditRoom(room)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteRoom(room.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Room Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {room.type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1 ${
                  room.status === 'available' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {room.status === 'available' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {room.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Department</span>
                <span className="text-sm font-medium text-gray-900">{room.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Charge/Day</span>
                <span className="text-sm font-medium text-gray-900">₹{room.chargePerDay}</span>
              </div>
            </div>

            {/* Bed Occupancy */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Bed Occupancy</span>
                <span className="text-sm text-gray-600">{room.occupied}/{room.capacity}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    (room.occupied / room.capacity) >= 0.9 ? 'bg-red-600' :
                    (room.occupied / room.capacity) >= 0.7 ? 'bg-orange-600' :
                    'bg-green-600'
                  }`}
                  style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                />
              </div>
            </div>

            {/* Beds Section */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-gray-900">Beds ({room.beds.length})</h4>
              </div>
              <div className="space-y-2">
                {room.beds.map(bed => (
                  <div key={bed.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Bed size={16} className={bed.status === 'occupied' ? 'text-orange-600' : 'text-green-600'} />
                      <span className="text-sm font-medium text-gray-900">{bed.bedNumber}</span>
                      {bed.patient && (
                        <span className="text-xs text-gray-600">- {bed.patient.name}</span>
                      )}
                    </div>
                    {bed.status === 'available' ? (
                      <button
                        onClick={() => handleAllocateBed(room, bed)}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Allocate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDischargeBed(room.id, bed.id)}
                        className="px-3 py-1 bg-orange-600 text-white text-xs rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Discharge
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Staff Section */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  Assigned Staff ({room.assignedStaff.length})
                </h4>
                <button
                  onClick={() => handleAssignStaff(room)}
                  className="flex items-center gap-1 px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <UserPlus size={16} />
                  Assign
                </button>
              </div>
              <div className="space-y-2">
                {room.assignedStaff.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-2">No staff assigned</p>
                ) : (
                  room.assignedStaff.map(staff => (
                    <div key={staff.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {staff.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                          <p className="text-xs text-gray-600">
                            {staff.role === 'nurse' ? 'Nurse' : 'Ward Boy'} • {staff.shift}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveStaff(room.id, staff.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Room Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {modalMode === 'add' ? 'Add New Room' : 'Edit Room'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                  <input
                    type="number"
                    required
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="ICU">ICU</option>
                  <option value="Private">Private</option>
                  <option value="General Ward">General Ward</option>
                  <option value="OT">OT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (Number of Beds)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="10"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Critical Care">Critical Care</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Charge per Day (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.chargePerDay}
                  onChange={(e) => setFormData({ ...formData, chargePerDay: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {modalMode === 'add' ? 'Add Room' : 'Update Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Assign Staff to Room {selectedRoom?.roomNumber}
                </h2>
                <button
                  onClick={() => setShowStaffModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">Select nurses and ward boys to assign to this room</p>
            </div>

            <div className="p-6 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Shift</label>
              <div className="flex gap-2">
                {['Morning', 'Evening', 'Night'].map(shift => (
                  <button
                    key={shift}
                    type="button"
                    onClick={() => setSelectedShift(shift)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedShift === shift
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {shift}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {availableStaff.map(staff => {
                  const isAssigned = selectedRoom?.assignedStaff.some(s => s.id === staff.id);
                  const isSelected = selectedStaff.some(s => s.id === staff.id);
                  
                  return (
                    <div
                      key={staff.id}
                      onClick={() => !isAssigned && handleStaffSelect(staff)}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        isAssigned
                          ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                          : isSelected
                          ? 'bg-primary-50 border-primary-500'
                          : 'bg-white border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          staff.role === 'nurse' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          <User size={20} className={staff.role === 'nurse' ? 'text-blue-600' : 'text-green-600'} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{staff.name}</p>
                          <p className="text-sm text-gray-600">
                            {staff.role === 'nurse' ? '👩‍⚕️ Nurse' : '👨‍💼 Ward Boy'} 
                            {staff.specialization && ` • ${staff.specialization}`}
                            {staff.department && ` • ${staff.department}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isAssigned && (
                          <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                            Already Assigned
                          </span>
                        )}
                        {!isAssigned && (
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? 'bg-primary-600 border-primary-600'
                              : 'border-gray-300'
                          }`}>
                            {isSelected && <CheckCircle size={14} className="text-white" />}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">
                  {selectedStaff.length} staff member(s) selected
                </span>
                <span className="text-sm font-medium text-primary-600">
                  Shift: {selectedShift}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowStaffModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStaffAssignment}
                  disabled={selectedStaff.length === 0}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign ({selectedStaff.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Allocate Bed Modal */}
      {showBedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Allocate Bed {selectedBed?.bedNumber}
                </h2>
                <button
                  onClick={() => setShowBedModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Room {selectedRoom?.roomNumber} • {selectedRoom?.type} • {selectedRoom?.department}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Select Patient to Admit</h3>
              <div className="space-y-2">
                {availablePatients.map(patient => {
                  const isSelected = selectedPatient?.id === patient.id;
                  
                  return (
                    <div
                      key={patient.id}
                      onClick={() => handlePatientSelect(patient)}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary-50 border-primary-500'
                          : 'bg-white border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-600">{patient.age} yrs • {patient.gender}</span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              patient.priority === 'high'
                                ? 'bg-red-100 text-red-700'
                                : patient.priority === 'medium'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {patient.priority.toUpperCase()} Priority
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Condition: {patient.condition}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'bg-primary-600 border-primary-600'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle size={14} className="text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              {selectedPatient && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">Selected Patient:</p>
                  <p className="text-sm text-blue-700">
                    {selectedPatient.name} • {selectedPatient.age} yrs • {selectedPatient.condition}
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBedModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBedAllocation}
                  disabled={!selectedPatient}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Allocate Bed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;