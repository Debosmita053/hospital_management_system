import React, { useState } from 'react';
import { 
  Search, Plus, Edit2, Trash2, Bed,
  CheckCircle, XCircle, AlertCircle, Wrench, Eye, X, ArrowLeft, User
} from 'lucide-react';
import toast from 'react-hot-toast';

const RoomManagement = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // add, edit, assignPatient, viewBeds
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [detailedView, setDetailedView] = useState(null);

  // Mock data - Rooms
  const [rooms, setRooms] = useState([
    {
      id: 1,
      roomNumber: 'ICU-101',
      type: 'ICU',
      floor: '3rd Floor',
      department: 'Cardiology',
      totalBeds: 4,
      occupiedBeds: 3,
      availableBeds: 1,
      status: 'available',
      maintenanceStatus: 'operational',
      chargePerDay: 5000,
      amenities: ['AC', 'Oxygen', 'Monitor', 'Ventilator'],
      beds: [
        { 
          bedNumber: 'B1', 
          status: 'occupied', 
          patient: { 
            id: 'P001', 
            name: 'John Doe', 
            admissionDate: '2024-10-10',
            assignedDoctor: 'DR-001',
            doctorName: 'Dr. Raj Sharma'
          } 
        },
        { 
          bedNumber: 'B2', 
          status: 'occupied', 
          patient: { 
            id: 'P002', 
            name: 'Jane Smith', 
            admissionDate: '2024-10-12',
            assignedDoctor: 'DR-001',
            doctorName: 'Dr. Raj Sharma'
          } 
        },
        { 
          bedNumber: 'B3', 
          status: 'occupied', 
          patient: { 
            id: 'P003', 
            name: 'Bob Wilson', 
            admissionDate: '2024-10-14',
            assignedDoctor: 'DR-002',
            doctorName: 'Dr. Priya Singh'
          } 
        },
        { bedNumber: 'B4', status: 'available', patient: null }
      ]
    },
    {
      id: 2,
      roomNumber: 'ICU-102',
      type: 'ICU',
      floor: '3rd Floor',
      department: 'Cardiology',
      totalBeds: 4,
      occupiedBeds: 4,
      availableBeds: 0,
      status: 'occupied',
      maintenanceStatus: 'operational',
      chargePerDay: 5000,
      amenities: ['AC', 'Oxygen', 'Monitor', 'Ventilator'],
      beds: [
        { 
          bedNumber: 'B1', 
          status: 'occupied', 
          patient: { 
            id: 'P004', 
            name: 'Alice Brown', 
            admissionDate: '2024-10-11',
            assignedDoctor: 'DR-001',
            doctorName: 'Dr. Raj Sharma'
          } 
        },
        { 
          bedNumber: 'B2', 
          status: 'occupied', 
          patient: { 
            id: 'P005', 
            name: 'Charlie Green', 
            admissionDate: '2024-10-13',
            assignedDoctor: 'DR-003',
            doctorName: 'Dr. Amit Kumar'
          } 
        },
        { 
          bedNumber: 'B3', 
          status: 'occupied', 
          patient: { 
            id: 'P006', 
            name: 'David Lee', 
            admissionDate: '2024-10-14',
            assignedDoctor: 'DR-001',
            doctorName: 'Dr. Raj Sharma'
          } 
        },
        { 
          bedNumber: 'B4', 
          status: 'occupied', 
          patient: { 
            id: 'P007', 
            name: 'Emma Davis', 
            admissionDate: '2024-10-15',
            assignedDoctor: 'DR-002',
            doctorName: 'Dr. Priya Singh'
          } 
        }
      ]
    },
    {
      id: 3,
      roomNumber: 'Private-301',
      type: 'Private',
      floor: '3rd Floor',
      department: 'Neurology',
      totalBeds: 1,
      occupiedBeds: 1,
      availableBeds: 0,
      status: 'occupied',
      maintenanceStatus: 'operational',
      chargePerDay: 3000,
      amenities: ['AC', 'TV', 'WiFi', 'Attached Bathroom'],
      beds: [
        { 
          bedNumber: 'B1', 
          status: 'occupied', 
          patient: { 
            id: 'P008', 
            name: 'Frank Miller', 
            admissionDate: '2024-10-09',
            assignedDoctor: 'DR-002',
            doctorName: 'Dr. Priya Singh'
          } 
        }
      ]
    },
    {
      id: 4,
      roomNumber: 'Private-302',
      type: 'Private',
      floor: '3rd Floor',
      department: 'Neurology',
      totalBeds: 1,
      occupiedBeds: 0,
      availableBeds: 1,
      status: 'available',
      maintenanceStatus: 'operational',
      chargePerDay: 3000,
      amenities: ['AC', 'TV', 'WiFi', 'Attached Bathroom'],
      beds: [
        { bedNumber: 'B1', status: 'available', patient: null }
      ]
    },
    {
      id: 5,
      roomNumber: 'Ward-201',
      type: 'General Ward',
      floor: '2nd Floor',
      department: 'Orthopedics',
      totalBeds: 6,
      occupiedBeds: 4,
      availableBeds: 2,
      status: 'available',
      maintenanceStatus: 'operational',
      chargePerDay: 1000,
      amenities: ['Fan', 'Shared Bathroom'],
      beds: [
        { 
          bedNumber: 'B1', 
          status: 'occupied', 
          patient: { 
            id: 'P009', 
            name: 'Grace Taylor', 
            admissionDate: '2024-10-08',
            assignedDoctor: 'DR-003',
            doctorName: 'Dr. Amit Kumar'
          } 
        },
        { 
          bedNumber: 'B2', 
          status: 'occupied', 
          patient: { 
            id: 'P010', 
            name: 'Henry Wilson', 
            admissionDate: '2024-10-10',
            assignedDoctor: 'DR-003',
            doctorName: 'Dr. Amit Kumar'
          } 
        },
        { bedNumber: 'B3', status: 'available', patient: null },
        { 
          bedNumber: 'B4', 
          status: 'occupied', 
          patient: { 
            id: 'P011', 
            name: 'Ivy Brown', 
            admissionDate: '2024-10-12',
            assignedDoctor: 'DR-005',
            doctorName: 'Dr. Sanjay Gupta'
          } 
        },
        { bedNumber: 'B5', status: 'available', patient: null },
        { 
          bedNumber: 'B6', 
          status: 'occupied', 
          patient: { 
            id: 'P012', 
            name: 'Jack Robinson', 
            admissionDate: '2024-10-14',
            assignedDoctor: 'DR-003',
            doctorName: 'Dr. Amit Kumar'
          } 
        }
      ]
    },
    {
  id: 6,
  roomNumber: 'OT-1',
  type: 'Operation Theatre',
  floor: '4th Floor',
  department: 'Surgery',
  totalBeds: 1,
  occupiedBeds: 0,
  availableBeds: 1,
  status: 'available',
  maintenanceStatus: 'operational',
  chargePerDay: 10000,
  amenities: ['Surgical Equipment', 'Anesthesia', 'Monitoring'],
  beds: [
    { bedNumber: 'OT-1', status: 'available', patient: null } // Changed from 'OT' to 'OT-1'
  ]
},
    {
      id: 7,
      roomNumber: 'Ward-202',
      type: 'General Ward',
      floor: '2nd Floor',
      department: 'Orthopedics',
      totalBeds: 6,
      occupiedBeds: 0,
      availableBeds: 0,
      status: 'maintenance',
      maintenanceStatus: 'under-maintenance',
      chargePerDay: 1000,
      amenities: ['Fan', 'Shared Bathroom'],
      beds: [
        { bedNumber: 'B1', status: 'maintenance', patient: null },
        { bedNumber: 'B2', status: 'maintenance', patient: null },
        { bedNumber: 'B3', status: 'maintenance', patient: null },
        { bedNumber: 'B4', status: 'maintenance', patient: null },
        { bedNumber: 'B5', status: 'maintenance', patient: null },
        { bedNumber: 'B6', status: 'maintenance', patient: null }
      ]
    },
    {
      id: 8,
      roomNumber: 'Semi-Private-401',
      type: 'Semi-Private',
      floor: '4th Floor',
      department: 'Pediatrics',
      totalBeds: 2,
      occupiedBeds: 1,
      availableBeds: 1,
      status: 'available',
      maintenanceStatus: 'operational',
      chargePerDay: 2000,
      amenities: ['AC', 'TV', 'Shared Bathroom'],
      beds: [
        { 
          bedNumber: 'B1', 
          status: 'occupied', 
          patient: { 
            id: 'P013', 
            name: 'Kelly White', 
            admissionDate: '2024-10-13',
            assignedDoctor: 'DR-004',
            doctorName: 'Dr. Anjali Mehta'
          } 
        },
        { bedNumber: 'B2', status: 'available', patient: null }
      ]
    }
  ]);

  // Available patients for assignment
  const availablePatients = [
    { id: 'P014', name: 'Liam Johnson', age: 45, gender: 'Male', condition: 'Stable' },
    { id: 'P015', name: 'Mia Davis', age: 32, gender: 'Female', condition: 'Critical' },
    { id: 'P016', name: 'Noah Martinez', age: 28, gender: 'Male', condition: 'Stable' }
  ];

  // Available doctors for assignment
  const availableDoctors = [
    { id: 'DR-001', name: 'Dr. Raj Sharma', specialization: 'Cardiologist', department: 'Cardiology' },
    { id: 'DR-002', name: 'Dr. Priya Singh', specialization: 'Neurologist', department: 'Neurology' },
    { id: 'DR-003', name: 'Dr. Amit Kumar', specialization: 'Orthopedic Surgeon', department: 'Orthopedics' },
    { id: 'DR-004', name: 'Dr. Anjali Mehta', specialization: 'Pediatrician', department: 'Pediatrics' },
    { id: 'DR-005', name: 'Dr. Sanjay Gupta', specialization: 'General Surgeon', department: 'Surgery' },
    { id: 'DR-006', name: 'Dr. Neha Patel', specialization: 'Emergency Medicine', department: 'Emergency' }
  ];

  const [selectedBed, setSelectedBed] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const [formData, setFormData] = useState({
    roomNumber: '',
    type: '',
    floor: '',
    department: '',
    totalBeds: 1,
    chargePerDay: '',
    amenities: '',
    maintenanceStatus: 'operational'
  });

  // Calculate stats
  const stats = {
    totalRooms: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    maintenance: rooms.filter(r => r.maintenanceStatus === 'under-maintenance').length,
    totalBeds: rooms.reduce((sum, r) => sum + r.totalBeds, 0),
    occupiedBeds: rooms.reduce((sum, r) => sum + r.occupiedBeds, 0),
    availableBeds: rooms.reduce((sum, r) => sum + r.availableBeds, 0),
    occupancyRate: Math.round(
      (rooms.reduce((sum, r) => sum + r.occupiedBeds, 0) / rooms.reduce((sum, r) => sum + r.totalBeds, 0)) * 100
    ),
    // OT-specific stats
    operationTheatres: rooms.filter(r => r.type === 'Operation Theatre').length,
    availableOTs: rooms.filter(r => r.type === 'Operation Theatre' && r.status === 'available').length
  };

  // Handlers
  const handleAddRoom = () => {
    setModalType('add');
    setSelectedRoom(null);
    setFormData({
      roomNumber: '', type: '', floor: '', department: '', totalBeds: 1,
      chargePerDay: '', amenities: '', maintenanceStatus: 'operational'
    });
    setShowModal(true);
  };

  const handleEditRoom = (room) => {
    setModalType('edit');
    setSelectedRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      type: room.type,
      floor: room.floor,
      department: room.department,
      totalBeds: room.totalBeds,
      chargePerDay: room.chargePerDay,
      amenities: room.amenities.join(', '),
      maintenanceStatus: room.maintenanceStatus
    });
    setShowModal(true);
  };

  const handleDeleteRoom = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (room.occupiedBeds > 0) {
      toast.error('Cannot delete room with occupied beds');
      return;
    }
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter(r => r.id !== roomId));
      toast.success('Room deleted successfully');
    }
  };

  const handleSubmitRoom = (e) => {
  e.preventDefault();
  const amenitiesArray = formData.amenities.split(',').map(a => a.trim()).filter(a => a);
  
  if (selectedRoom) {
    // Update existing room
    const updatedRooms = rooms.map(r => {
      if (r.id === selectedRoom.id) {
        const newTotalBeds = parseInt(formData.totalBeds);
        const currentTotalBeds = r.totalBeds;
        
        let updatedBeds = [...r.beds];
        
        // Adjust bed count if total beds changed
        if (newTotalBeds > currentTotalBeds) {
          // Add new beds
          for (let i = currentTotalBeds + 1; i <= newTotalBeds; i++) {
            updatedBeds.push({
              bedNumber: formData.type === 'Operation Theatre' ? `OT-${i}` : `B${i}`,
              status: formData.maintenanceStatus === 'under-maintenance' ? 'maintenance' : 'available',
              patient: null
            });
          }
        } else if (newTotalBeds < currentTotalBeds) {
          // Remove beds (only if they're not occupied)
          const occupiedBeds = updatedBeds.filter(bed => bed.status === 'occupied').length;
          if (occupiedBeds > newTotalBeds) {
            toast.error(`Cannot reduce beds below ${occupiedBeds} as there are occupied beds`);
            return r;
          }
          updatedBeds = updatedBeds.slice(0, newTotalBeds);
        }
        
        // Update bed statuses based on maintenance status (preserve existing patient assignments)
        updatedBeds = updatedBeds.map(bed => {
          if (formData.maintenanceStatus === 'under-maintenance') {
            return { ...bed, status: 'maintenance' };
          } else {
            // If operational, keep occupied beds as occupied, others as available
            return {
              ...bed,
              status: bed.patient ? 'occupied' : 'available'
            };
          }
        });
        
        const occupiedBedsCount = updatedBeds.filter(bed => bed.status === 'occupied').length;
        const availableBedsCount = formData.maintenanceStatus === 'under-maintenance' ? 0 : (newTotalBeds - occupiedBedsCount);
        
        // Determine room status
        let newStatus;
        if (formData.maintenanceStatus === 'under-maintenance') {
          newStatus = 'maintenance';
        } else {
          newStatus = occupiedBedsCount === 0 ? 'available' : 
                     occupiedBedsCount === newTotalBeds ? 'occupied' : 'available';
        }
        
        const updatedRoom = {
          ...r,
          roomNumber: formData.roomNumber,
          type: formData.type,
          floor: formData.floor,
          department: formData.department,
          chargePerDay: parseInt(formData.chargePerDay),
          totalBeds: newTotalBeds,
          amenities: amenitiesArray,
          occupiedBeds: occupiedBedsCount,
          availableBeds: availableBedsCount,
          status: newStatus,
          maintenanceStatus: formData.maintenanceStatus,
          beds: updatedBeds
        };

        // Update detailed view if it's currently viewing this room
        if (detailedView && detailedView.id === selectedRoom.id) {
          setDetailedView(updatedRoom);
        }

        return updatedRoom;
      }
      return r;
    });
    
    setRooms(updatedRooms);
    toast.success('Room updated successfully');
  } else {
    // Add new room - FIXED: Create unique bed numbers for OT
    const beds = [];
    for (let i = 1; i <= formData.totalBeds; i++) {
      beds.push({
        bedNumber: formData.type === 'Operation Theatre' ? `OT-${i}` : `B${i}`,
        status: formData.maintenanceStatus === 'under-maintenance' ? 'maintenance' : 'available',
        patient: null
      });
    }

    const newRoom = {
      id: Math.max(...rooms.map(r => r.id)) + 1,
      roomNumber: formData.roomNumber,
      type: formData.type,
      floor: formData.floor,
      department: formData.department,
      totalBeds: parseInt(formData.totalBeds),
      chargePerDay: parseInt(formData.chargePerDay),
      amenities: amenitiesArray,
      maintenanceStatus: formData.maintenanceStatus,
      occupiedBeds: 0,
      availableBeds: formData.maintenanceStatus === 'under-maintenance' ? 0 : parseInt(formData.totalBeds),
      status: formData.maintenanceStatus === 'under-maintenance' ? 'maintenance' : 'available',
      beds: beds
    };
    setRooms([...rooms, newRoom]);
    toast.success('Room added successfully');
  }
  setShowModal(false);
};

  const handleViewBeds = (room) => {
    setModalType('viewBeds');
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleAssignPatient = (room, bed) => {
    setModalType('assignPatient');
    setSelectedRoom(room);
    setSelectedBed(bed);
    setSelectedPatient('');
    setSelectedDoctor('');
    setShowModal(true);
  };

  const handleSubmitAssignment = () => {
  if (!selectedPatient || !selectedDoctor) {
    toast.error('Please select both patient and doctor');
    return;
  }

  const patient = availablePatients.find(p => p.id === selectedPatient);
  const doctor = availableDoctors.find(d => d.id === selectedDoctor);
  
  if (!patient || !doctor) {
    toast.error('Invalid patient or doctor selection');
    return;
  }

  setRooms(rooms.map(room => {
    if (room.id === selectedRoom.id) {
      // Create updated beds array - FIXED: Only update the specific bed
      const updatedBeds = room.beds.map(bed => {
        // Check if this is the exact bed we want to update
        if (bed.bedNumber === selectedBed.bedNumber && bed.status === 'available') {
          return {
            ...bed,
            status: 'occupied',
            patient: {
              id: patient.id,
              name: patient.name,
              admissionDate: new Date().toISOString().split('T')[0],
              assignedDoctor: doctor.id,
              doctorName: doctor.name
            }
          };
        }
        return bed; // Return unchanged bed
      });

      // Recalculate room statistics
      const occupiedBedsCount = updatedBeds.filter(bed => bed.status === 'occupied').length;
      const availableBedsCount = updatedBeds.filter(bed => bed.status === 'available').length;
      
      // Determine room status
      let newRoomStatus;
      if (room.maintenanceStatus === 'under-maintenance') {
        newRoomStatus = 'maintenance';
      } else {
        newRoomStatus = occupiedBedsCount === 0 ? 'available' : 
                       occupiedBedsCount === room.totalBeds ? 'occupied' : 'available';
      }

      const updatedRoom = {
        ...room,
        beds: updatedBeds,
        occupiedBeds: occupiedBedsCount,
        availableBeds: availableBedsCount,
        status: newRoomStatus
      };

      // Update detailed view if currently viewing this room
      if (detailedView && detailedView.id === selectedRoom.id) {
        setDetailedView(updatedRoom);
      }

      return updatedRoom;
    }
    return room;
  }));

  toast.success(`Patient ${patient.name} assigned to ${selectedRoom.roomNumber} - ${selectedBed.bedNumber} with Dr. ${doctor.name}`);
  setShowModal(false);
  setSelectedBed(null);
};
  const handleDischargeBed = (roomId, bedNumber) => {
    if (window.confirm('Discharge patient from this bed?')) {
      const updatedRooms = rooms.map(r => {
        if (r.id === roomId) {
          const updatedBeds = r.beds.map(b => 
            b.bedNumber === bedNumber ? { ...b, status: 'available', patient: null } : b
          );
          const occupied = updatedBeds.filter(b => b.status === 'occupied').length;
          const updatedRoom = {
            ...r,
            beds: updatedBeds,
            occupiedBeds: occupied,
            availableBeds: r.totalBeds - occupied,
            status: occupied === 0 ? 'available' : r.status === 'maintenance' ? 'maintenance' : 'available'
          };

          // Update selectedRoom if it's currently being viewed in modal
          if (selectedRoom && selectedRoom.id === roomId) {
            setSelectedRoom(updatedRoom);
          }

          // Update detailed view if it's currently viewing this room
          if (detailedView && detailedView.id === roomId) {
            setDetailedView(updatedRoom);
          }

          return updatedRoom;
        }
        return r;
      });
      
      setRooms(updatedRooms);
      toast.success('Patient discharged successfully');
    }
  };

  const handleToggleMaintenance = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (room.occupiedBeds > 0 && room.maintenanceStatus === 'operational') {
      toast.error('Cannot set room to maintenance with occupied beds');
      return;
    }

    const newStatus = room.maintenanceStatus === 'operational' ? 'under-maintenance' : 'operational';
    
    setRooms(rooms.map(r => {
      if (r.id === roomId) {
        const updatedRoom = { 
          ...r, 
          maintenanceStatus: newStatus,
          status: newStatus === 'under-maintenance' ? 'maintenance' : (r.occupiedBeds === 0 ? 'available' : 'occupied'),
          beds: r.beds.map(b => ({ ...b, status: newStatus === 'under-maintenance' ? 'maintenance' : (b.patient ? 'occupied' : 'available') }))
        };

        // Update detailed view if it's currently viewing this room
        if (detailedView && detailedView.id === roomId) {
          setDetailedView(updatedRoom);
        }

        return updatedRoom;
      }
      return r;
    }));
    toast.success(`Room ${newStatus === 'under-maintenance' ? 'set to' : 'removed from'} maintenance`);
  };

  // Handle card click to show detailed view
  const handleCardClick = (room) => {
    setDetailedView(room);
  };

  // Handle back from detailed view
  const handleBackToList = () => {
    setDetailedView(null);
  };

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || room.type === filterType;
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Helper functions
  const getStatusBadge = (status) => {
    const styles = {
      available: 'bg-green-100 text-green-800',
      occupied: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800'
    };
    const icons = {
      available: <CheckCircle className="w-3 h-3" />,
      occupied: <XCircle className="w-3 h-3" />,
      maintenance: <Wrench className="w-3 h-3" />
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        {status}
      </span>
    );
  };

  // Helper to get room type badge color
  const getRoomTypeBadge = (type) => {
    const styles = {
      'Operation Theatre': 'bg-purple-100 text-purple-800 border border-purple-200',
      'ICU': 'bg-red-100 text-red-800',
      'Private': 'bg-blue-100 text-blue-800',
      'Semi-Private': 'bg-indigo-100 text-indigo-800',
      'General Ward': 'bg-green-100 text-green-800'
    };
    return styles[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Room & Bed Management</h1>
          <p className="text-gray-600 mt-1">Manage rooms, beds, patient assignments and doctor allocation</p>
        </div>
        <button
          onClick={handleAddRoom}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Room
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Rooms</p>
              <p className="text-3xl font-bold mt-2">{stats.totalRooms}</p>
              <p className="text-blue-100 text-xs mt-2">OTs: {stats.operationTheatres}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Bed className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Available</p>
              <p className="text-3xl font-bold mt-2">{stats.available}</p>
              <p className="text-green-100 text-xs mt-2">OTs Available: {stats.availableOTs}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Occupied</p>
              <p className="text-3xl font-bold mt-2">{stats.occupied}</p>
              <p className="text-red-100 text-xs mt-2">Beds: {stats.occupiedBeds}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Occupancy Rate</p>
              <p className="text-3xl font-bold mt-2">{stats.occupancyRate}%</p>
              <p className="text-orange-100 text-xs mt-2">Maintenance: {stats.maintenance}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="ICU">ICU</option>
            <option value="Private">Private</option>
            <option value="Semi-Private">Semi-Private</option>
            <option value="General Ward">General Ward</option>
            <option value="Operation Theatre">Operation Theatre</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Detailed Room View */}
      {detailedView && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          {/* Back Button */}
          <button 
            onClick={handleBackToList}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Rooms</span>
          </button>

          {/* Room Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${
                detailedView.type === 'Operation Theatre' ? 'bg-purple-100' : 'bg-blue-100'
              }`}>
                <Bed className={`h-8 w-8 ${
                  detailedView.type === 'Operation Theatre' ? 'text-purple-600' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{detailedView.roomNumber}</h2>
                <p className="text-gray-500">{detailedView.floor} • {detailedView.type}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEditRoom(detailedView)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit Room</span>
              </button>
              <button
                onClick={() => handleToggleMaintenance(detailedView.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  detailedView.maintenanceStatus === 'operational' 
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Wrench className="h-4 w-4" />
                <span>{detailedView.maintenanceStatus === 'operational' ? 'Set Maintenance' : 'Remove Maintenance'}</span>
              </button>
            </div>
          </div>

          {/* OT-specific info */}
          {detailedView.type === 'Operation Theatre' && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 border-b border-purple-300 pb-2 mb-3">
                🏥 Operation Theatre Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-sm">⚕️</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Surgical Use</p>
                    <p className="font-medium text-gray-900">Procedure Room</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-sm">⏱️</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Priority</p>
                    <p className="font-medium text-gray-900">High</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Room Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Room Information</h3>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bed className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium text-gray-900">{detailedView.department}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Charge Per Day</p>
                  <p className="font-medium text-gray-900">₹{detailedView.chargePerDay}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Wrench className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Maintenance Status</p>
                  <p className="font-medium text-gray-900 capitalize">{detailedView.maintenanceStatus}</p>
                </div>
              </div>
            </div>

            {/* Bed Statistics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Bed Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-md">
                  <p className="text-sm opacity-90">Total Beds</p>
                  <p className="text-2xl font-bold">{detailedView.totalBeds}</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-lg shadow-md">
                  <p className="text-sm opacity-90">Occupied</p>
                  <p className="text-2xl font-bold">{detailedView.occupiedBeds}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg shadow-md">
                  <p className="text-sm opacity-90">Available</p>
                  <p className="text-2xl font-bold">{detailedView.availableBeds}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-md">
                  <p className="text-sm opacity-90">Occupancy Rate</p>
                  <p className="text-2xl font-bold">
                    {Math.round((detailedView.occupiedBeds / detailedView.totalBeds) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {detailedView.amenities.map((amenity, idx) => (
                <span key={idx} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Bed Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Bed Management</h3>
              <button
                onClick={() => handleViewBeds(detailedView)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Manage Beds</span>
              </button>
            </div>
            
            {/* Bed Visual Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {detailedView.beds.map((bed) => (
                <div
                  key={bed.bedNumber}
                  className={`p-4 rounded-lg text-center cursor-pointer transition-all ${
                    bed.status === 'available' ? (
                      detailedView.type === 'Operation Theatre' ? 'bg-purple-100 hover:bg-purple-200' : 'bg-green-100 hover:bg-green-200'
                    ) : bed.status === 'occupied' ? 'bg-red-100 hover:bg-red-200' :
                    'bg-yellow-100 hover:bg-yellow-200'
                  }`}
                  onClick={() => bed.status === 'available' && handleAssignPatient(detailedView, bed)}
                >
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                    bed.status === 'available' ? (
                      detailedView.type === 'Operation Theatre' ? 'bg-purple-500' : 'bg-green-500'
                    ) : bed.status === 'occupied' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}>
                    {detailedView.type === 'Operation Theatre' ? 'OT' : bed.bedNumber.replace('B', '')}
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {detailedView.type === 'Operation Theatre' ? 'Operation Theatre' : `Bed ${bed.bedNumber}`}
                  </p>
                  <p className={`text-xs ${
                    bed.status === 'available' ? (
                      detailedView.type === 'Operation Theatre' ? 'text-purple-700' : 'text-green-700'
                    ) : bed.status === 'occupied' ? 'text-red-700' :
                    'text-yellow-700'
                  }`}>
                    {bed.status}
                  </p>
                  {bed.patient && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-600 truncate" title={bed.patient.name}>
                        {bed.patient.name}
                      </p>
                      <p className="text-xs text-blue-600 truncate" title={bed.patient.doctorName}>
                        {bed.patient.doctorName}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Room Cards Grid (only show when not in detailed view) */}
      {!detailedView && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => handleCardClick(room)}
              className={`bg-white rounded-xl shadow-sm border p-4 hover:shadow-lg transition-shadow cursor-pointer group ${
                room.type === 'Operation Theatre' 
                  ? 'border-purple-300 bg-purple-50' 
                  : 'border-gray-200'
              }`}
            >
              {/* Room Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{room.roomNumber}</h3>
                  <p className="text-sm text-gray-500">{room.floor}</p>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEditRoom(room); }}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit Room"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room.id); }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete Room"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Type & Status */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomTypeBadge(room.type)}`}>
                  {room.type}
                </span>
                {getStatusBadge(room.status)}
              </div>

              {/* OT-specific info */}
              {room.type === 'Operation Theatre' && (
                <div className="mb-2 p-2 bg-purple-100 border border-purple-200 rounded-lg">
                  <p className="text-xs text-purple-700 font-medium">🔄 Surgical Procedure Room</p>
                  <p className="text-xs text-purple-600">High Priority Use</p>
                </div>
              )}

              {/* Department */}
              <div className="mb-3">
                <p className="text-xs text-gray-600">Department</p>
                <p className="text-sm font-semibold text-gray-900">{room.department}</p>
              </div>

              {/* Bed Status */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Beds</span>
                  <span className="font-semibold text-gray-900">
                    {room.occupiedBeds}/{room.totalBeds}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      room.occupiedBeds === room.totalBeds ? 'bg-red-500' : 
                      room.occupiedBeds > 0 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(room.occupiedBeds / room.totalBeds) * 100}%` }}
                  />
                </div>
              </div>

              {/* Charge */}
              <div className="mb-3">
                <p className="text-xs text-gray-600">Charge/Day</p>
                <p className="text-sm font-bold text-green-600">₹{room.chargePerDay}</p>
              </div>

              {/* Quick Bed Visual */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  {room.beds.slice(0, 4).map((bed, index) => (
                    <div
                      key={bed.bedNumber}
                      className={`w-4 h-4 rounded ${
                        bed.status === 'available' ? (
                          room.type === 'Operation Theatre' ? 'bg-purple-500' : 'bg-green-500'
                        ) : bed.status === 'occupied' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      title={`${room.type === 'Operation Theatre' ? 'OT' : 'Bed'} ${bed.bedNumber}: ${bed.status}`}
                    />
                  ))}
                  {room.beds.length > 4 && (
                    <div className="w-4 h-4 rounded bg-gray-300 flex items-center justify-center text-xs">
                      +{room.beds.length - 4}
                    </div>
                  )}
                </div>
                <div className="text-center text-xs text-blue-600 font-medium">
                  Click to view details
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Add/Edit Room Modal */}
            {(modalType === 'add' || modalType === 'edit') && (
              <>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {modalType === 'add' ? 'Add New Room' : 'Edit Room'}
                  </h2>
                </div>
                <form onSubmit={handleSubmitRoom} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Room Number *</label>
                      <input
                        type="text"
                        required
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., ICU-101"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Type</option>
                        <option value="ICU">ICU</option>
                        <option value="Private">Private</option>
                        <option value="Semi-Private">Semi-Private</option>
                        <option value="General Ward">General Ward</option>
                        <option value="Operation Theatre">Operation Theatre</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Floor *</label>
                      <input
                        type="text"
                        required
                        value={formData.floor}
                        onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 3rd Floor"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                      <select
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Department</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Emergency">Emergency</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Beds *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.totalBeds}
                        onChange={(e) => setFormData({ ...formData, totalBeds: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Charge Per Day (₹) *</label>
                      <input
                        type="number"
                        required
                        value={formData.chargePerDay}
                        onChange={(e) => setFormData({ ...formData, chargePerDay: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amenities (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.amenities}
                      onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., AC, TV, WiFi, Oxygen"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Status *</label>
                    <select
                      required
                      value={formData.maintenanceStatus}
                      onChange={(e) => setFormData({ ...formData, maintenanceStatus: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="operational">Operational</option>
                      <option value="under-maintenance">Under Maintenance</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {modalType === 'add' ? 'Add Room' : 'Update Room'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* View Beds Modal */}
            {modalType === 'viewBeds' && selectedRoom && (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedRoom.roomNumber} - Bed Details
                    </h2>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedRoom.type} | {selectedRoom.department}
                  </p>
                </div>
                <div className="p-6">
                  {/* Room Info */}
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Total Beds</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedRoom.totalBeds}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Occupied</p>
                      <p className="text-2xl font-bold text-red-600">{selectedRoom.occupiedBeds}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Available</p>
                      <p className="text-2xl font-bold text-green-600">{selectedRoom.availableBeds}</p>
                    </div>
                  </div>

                  {/* Bed List */}
                  <div className="space-y-3">
                    {selectedRoom.beds.map((bed) => (
                      <div key={bed.bedNumber} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${
                              bed.status === 'available' ? (
                                selectedRoom.type === 'Operation Theatre' ? 'bg-purple-500' : 'bg-green-500'
                              ) : bed.status === 'occupied' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}>
                              {selectedRoom.type === 'Operation Theatre' ? 'OT' : bed.bedNumber.replace('B', '')}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {selectedRoom.type === 'Operation Theatre' ? 'Operation Theatre' : `Bed ${bed.bedNumber}`}
                              </p>
                              {bed.patient ? (
                                <div>
                                  <p className="text-sm text-gray-900">{bed.patient.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <User className="w-3 h-3 text-blue-500" />
                                    <p className="text-xs text-blue-600">
                                      {bed.patient.doctorName}
                                    </p>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Patient ID: {bed.patient.id} | Admitted: {bed.patient.admissionDate}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 capitalize">{bed.status}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {bed.status === 'available' && (
                              <button
                                onClick={() => handleAssignPatient(selectedRoom, bed)}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                              >
                                Assign Patient
                              </button>
                            )}
                            {bed.status === 'occupied' && (
                              <button
                                onClick={() => handleDischargeBed(selectedRoom.id, bed.bedNumber)}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                              >
                                Discharge
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => setShowModal(false)}
                      className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Assign Patient Modal */}
            {modalType === 'assignPatient' && selectedRoom && selectedBed && (
              <>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedRoom.type === 'Operation Theatre' ? 'Schedule Procedure' : 'Assign Patient to Bed'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedRoom.roomNumber} - {selectedRoom.type === 'Operation Theatre' ? 'Operation Theatre' : `Bed ${selectedBed.bedNumber}`}
                  </p>
                </div>
                <div className="p-6">
                  {/* OT-specific info in assignment modal */}
                  {selectedRoom.type === 'Operation Theatre' && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-4">
                      <p className="text-sm font-semibold text-purple-900 mb-2">
                        🏥 Operation Theatre Assignment
                      </p>
                      <p className="text-sm text-purple-700">
                        This is a surgical procedure room. Please ensure proper scheduling for surgical procedures.
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-purple-700 mb-1">Procedure Type</label>
                          <select className="w-full px-3 py-1 border border-purple-300 rounded text-sm">
                            <option>Emergency Surgery</option>
                            <option>Scheduled Surgery</option>
                            <option>Minor Procedure</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-purple-700 mb-1">Duration (hrs)</label>
                          <input 
                            type="number" 
                            className="w-full px-3 py-1 border border-purple-300 rounded text-sm" 
                            placeholder="2" 
                            min="1"
                            max="8"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient *</label>
                      <select
                        value={selectedPatient}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Choose a patient</option>
                        {availablePatients.map((patient) => (
                          <option key={patient.id} value={patient.id}>
                            {patient.name} - {patient.age}y, {patient.gender} - {patient.condition}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assigning Doctor *</label>
                      <select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Doctor</option>
                        {availableDoctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialization} ({doctor.department})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {(selectedPatient || selectedDoctor) && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                      <p className="text-sm font-semibold text-gray-900 mb-3">Assignment Details:</p>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedPatient && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Patient Information:</p>
                            {(() => {
                              const patient = availablePatients.find(p => p.id === selectedPatient);
                              return (
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-700">Name: {patient.name}</p>
                                  <p className="text-sm text-gray-700">Age: {patient.age} years</p>
                                  <p className="text-sm text-gray-700">Gender: {patient.gender}</p>
                                  <p className="text-sm text-gray-700">
                                    Condition: <span className={`font-semibold ${patient.condition === 'Critical' ? 'text-red-600' : 'text-green-600'}`}>
                                      {patient.condition}
                                    </span>
                                  </p>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                        {selectedDoctor && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Doctor Information:</p>
                            {(() => {
                              const doctor = availableDoctors.find(d => d.id === selectedDoctor);
                              return (
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-700">Name: {doctor.name}</p>
                                  <p className="text-sm text-gray-700">Specialization: {doctor.specialization}</p>
                                  <p className="text-sm text-gray-700">Department: {doctor.department}</p>
                                  <p className="text-sm text-blue-600 font-medium">
                                    Room Department: {selectedRoom.department}
                                  </p>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmitAssignment}
                      disabled={!selectedPatient || !selectedDoctor}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {selectedRoom.type === 'Operation Theatre' ? 'Schedule Procedure' : 'Assign Patient & Doctor'}
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;