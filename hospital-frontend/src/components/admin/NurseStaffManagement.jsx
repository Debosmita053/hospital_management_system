import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Calendar, Clock, Users, UserCheck, UserX, Award, X } from 'lucide-react';

const NurseStaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [modalType, setModalType] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Staff data
  const [staffMembers, setStaffMembers] = useState([
    {
      id: 'S001',
      name: 'Emily Wilson',
      role: 'Nurse',
      email: 'emily.wilson@hospital.com',
      phone: '+1234567890',
      dateOfBirth: '1988-05-15',
      gender: 'Female',
      department: 'Cardiology',
      assignedRooms: ['ICU-101', 'ICU-102'],
      shift: 'Morning (6 AM - 2 PM)',
      joiningDate: '2020-03-15',
      qualification: 'BSc Nursing',
      experience: '8 years',
      status: 'Active',
      attendance: '95%',
      performanceNotes: 'Excellent patient care skills. Very punctual and dedicated.',
      schedule: {
        monday: { enabled: true, start: '06:00', end: '14:00' },
        tuesday: { enabled: true, start: '06:00', end: '14:00' },
        wednesday: { enabled: true, start: '06:00', end: '14:00' },
        thursday: { enabled: true, start: '06:00', end: '14:00' },
        friday: { enabled: true, start: '06:00', end: '14:00' },
        saturday: { enabled: false, start: '', end: '' },
        sunday: { enabled: false, start: '', end: '' }
      }
    },
    {
      id: 'S002',
      name: 'Michael Brown',
      role: 'Lab Technician',
      email: 'michael.brown@hospital.com',
      phone: '+1234567891',
      dateOfBirth: '1992-08-22',
      gender: 'Male',
      department: 'Laboratory',
      assignedRooms: ['Lab-A', 'Lab-B'],
      shift: 'Evening (2 PM - 10 PM)',
      joiningDate: '2021-06-10',
      qualification: 'Diploma in Medical Lab Technology',
      experience: '5 years',
      status: 'Active',
      attendance: '92%',
      performanceNotes: 'Accurate test results. Good at handling complex cases.',
      schedule: {
        monday: { enabled: true, start: '14:00', end: '22:00' },
        tuesday: { enabled: true, start: '14:00', end: '22:00' },
        wednesday: { enabled: true, start: '14:00', end: '22:00' },
        thursday: { enabled: true, start: '14:00', end: '22:00' },
        friday: { enabled: true, start: '14:00', end: '22:00' },
        saturday: { enabled: true, start: '14:00', end: '22:00' },
        sunday: { enabled: false, start: '', end: '' }
      }
    },
    {
      id: 'S003',
      name: 'Sarah Johnson',
      role: 'Receptionist',
      email: 'sarah.johnson@hospital.com',
      phone: '+1234567892',
      dateOfBirth: '1995-11-30',
      gender: 'Female',
      department: 'Front Desk',
      assignedRooms: ['Reception-1'],
      shift: 'Morning (8 AM - 4 PM)',
      joiningDate: '2022-01-20',
      qualification: 'Bachelor of Commerce',
      experience: '3 years',
      status: 'Active',
      attendance: '98%',
      performanceNotes: 'Excellent communication skills. Handles patient queries efficiently.',
      schedule: {
        monday: { enabled: true, start: '08:00', end: '16:00' },
        tuesday: { enabled: true, start: '08:00', end: '16:00' },
        wednesday: { enabled: true, start: '08:00', end: '16:00' },
        thursday: { enabled: true, start: '08:00', end: '16:00' },
        friday: { enabled: true, start: '08:00', end: '16:00' },
        saturday: { enabled: false, start: '', end: '' },
        sunday: { enabled: false, start: '', end: '' }
      }
    },
    {
      id: 'S004',
      name: 'David Martinez',
      role: 'Ward Boy',
      email: 'david.martinez@hospital.com',
      phone: '+1234567893',
      dateOfBirth: '1990-03-18',
      gender: 'Male',
      department: 'General Ward',
      assignedRooms: ['Ward-201', 'Ward-202'],
      shift: 'Night (10 PM - 6 AM)',
      joiningDate: '2019-09-05',
      qualification: '10+2',
      experience: '6 years',
      status: 'Active',
      attendance: '88%',
      performanceNotes: 'Hardworking and reliable. Needs improvement in punctuality.',
      schedule: {
        monday: { enabled: true, start: '22:00', end: '06:00' },
        tuesday: { enabled: true, start: '22:00', end: '06:00' },
        wednesday: { enabled: true, start: '22:00', end: '06:00' },
        thursday: { enabled: true, start: '22:00', end: '06:00' },
        friday: { enabled: true, start: '22:00', end: '06:00' },
        saturday: { enabled: true, start: '22:00', end: '06:00' },
        sunday: { enabled: true, start: '22:00', end: '06:00' }
      }
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    department: '',
    assignedRooms: '',
    shift: '',
    joiningDate: '',
    qualification: '',
    experience: '',
    status: 'Active',
    performanceNotes: ''
  });

  const [scheduleData, setScheduleData] = useState({
    monday: { enabled: false, start: '', end: '' },
    tuesday: { enabled: false, start: '', end: '' },
    wednesday: { enabled: false, start: '', end: '' },
    thursday: { enabled: false, start: '', end: '' },
    friday: { enabled: false, start: '', end: '' },
    saturday: { enabled: false, start: '', end: '' },
    sunday: { enabled: false, start: '', end: '' }
  });

  // Calculate stats
  const totalStaff = staffMembers.length;
  const activeStaff = staffMembers.filter(s => s.status === 'Active').length;
  const inactiveStaff = staffMembers.filter(s => s.status === 'Inactive').length;
  const nurses = staffMembers.filter(s => s.role === 'Nurse').length;
  const avgAttendance = (staffMembers.reduce((sum, s) => sum + parseFloat(s.attendance), 0) / staffMembers.length).toFixed(1);

  // Roles list
  const roles = ['Nurse', 'Lab Technician', 'Receptionist', 'Ward Boy', 'Pharmacist', 'Radiologist', 'Physiotherapist', 'Dietitian'];
  const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Surgery', 'Gynecology', 'Emergency', 'ICU', 'General Ward', 'Laboratory', 'Pharmacy', 'Radiology', 'Front Desk'];
  const shifts = ['Morning (6 AM - 2 PM)', 'Evening (2 PM - 10 PM)', 'Night (10 PM - 6 AM)', 'Full Day (9 AM - 5 PM)'];

  // Filter staff
  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || staff.role === filterRole;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && staff.status === 'Active') ||
                      (activeTab === 'inactive' && staff.status === 'Inactive');
    return matchesSearch && matchesRole && matchesTab;
  });

  const handleAddStaff = () => {
    setFormData({
      name: '',
      role: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      department: '',
      assignedRooms: '',
      shift: '',
      joiningDate: '',
      qualification: '',
      experience: '',
      status: 'Active',
      performanceNotes: ''
    });
    setModalType('add');
  };

  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    setFormData({
      name: staff.name,
      role: staff.role,
      email: staff.email,
      phone: staff.phone,
      dateOfBirth: staff.dateOfBirth,
      gender: staff.gender,
      department: staff.department,
      assignedRooms: staff.assignedRooms.join(', '),
      shift: staff.shift,
      joiningDate: staff.joiningDate,
      qualification: staff.qualification,
      experience: staff.experience,
      status: staff.status,
      performanceNotes: staff.performanceNotes
    });
    setModalType('edit');
  };

  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setModalType('view');
  };

  const handleSetSchedule = (staff) => {
    setSelectedStaff(staff);
    setScheduleData(staff.schedule);
    setModalType('schedule');
  };

  const handleSubmitStaff = (e) => {
    e.preventDefault();
    
    const roomsArray = formData.assignedRooms.split(',').map(r => r.trim()).filter(r => r);
    
    if (modalType === 'add') {
      const newStaff = {
        ...formData,
        id: `S${String(staffMembers.length + 1).padStart(3, '0')}`,
        assignedRooms: roomsArray,
        attendance: '100%',
        schedule: {
          monday: { enabled: false, start: '', end: '' },
          tuesday: { enabled: false, start: '', end: '' },
          wednesday: { enabled: false, start: '', end: '' },
          thursday: { enabled: false, start: '', end: '' },
          friday: { enabled: false, start: '', end: '' },
          saturday: { enabled: false, start: '', end: '' },
          sunday: { enabled: false, start: '', end: '' }
        }
      };
      setStaffMembers([...staffMembers, newStaff]);
      alert('Staff member added successfully!');
    } else {
      setStaffMembers(staffMembers.map(s => 
        s.id === selectedStaff.id 
          ? { ...s, ...formData, assignedRooms: roomsArray }
          : s
      ));
      alert('Staff member updated successfully!');
    }
    
    setModalType(null);
  };

  const handleSubmitSchedule = (e) => {
    e.preventDefault();
    setStaffMembers(staffMembers.map(s =>
      s.id === selectedStaff.id
        ? { ...s, schedule: scheduleData }
        : s
    ));
    alert('Schedule updated successfully!');
    setModalType(null);
  };

  const handleToggleStatus = (staff) => {
    const newStatus = staff.status === 'Active' ? 'Inactive' : 'Active';
    setStaffMembers(staffMembers.map(s =>
      s.id === staff.id ? { ...s, status: newStatus } : s
    ));
    alert(`Staff ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully!`);
  };

  const handleDeleteStaff = (staff) => {
    if (window.confirm(`Are you sure you want to delete ${staff.name}?`)) {
      setStaffMembers(staffMembers.filter(s => s.id !== staff.id));
      alert('Staff member deleted successfully!');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Nurse & Staff Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage hospital staff members, shifts, and duty rosters</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Staff</p>
              <h3 className="text-3xl font-bold">{totalStaff}</h3>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Active Staff</p>
              <h3 className="text-3xl font-bold">{activeStaff}</h3>
            </div>
            <UserCheck className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium mb-1">Inactive Staff</p>
              <h3 className="text-3xl font-bold">{inactiveStaff}</h3>
            </div>
            <UserX className="w-12 h-12 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Nurses</p>
              <h3 className="text-3xl font-bold">{nurses}</h3>
            </div>
            <Award className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-1">Avg Attendance</p>
              <h3 className="text-3xl font-bold">{avgAttendance}%</h3>
            </div>
            <Clock className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'all'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              All Staff ({totalStaff})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'active'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Active ({activeStaff})
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'inactive'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Inactive ({inactiveStaff})
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, ID, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <button
            onClick={handleAddStaff}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Plus className="w-5 h-5" />
            Add Staff
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Staff ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Shift
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {staff.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold mr-3">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{staff.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {staff.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {staff.shift}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      parseFloat(staff.attendance) >= 95 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      parseFloat(staff.attendance) >= 85 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                      'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {staff.attendance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      staff.status === 'Active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewStaff(staff)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEditStaff(staff)}
                        className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleSetSchedule(staff)}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300"
                        title="Set Schedule"
                      >
                        <Calendar className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(staff)}
                        className={staff.status === 'Active' ? 'text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300' : 'text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300'}
                        title={staff.status === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        {staff.status === 'Active' ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staff)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStaff.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No staff members found
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {modalType === 'add' ? 'Add New Staff Member' : 'Edit Staff Member'}
              </h2>
            </div>

            <form onSubmit={handleSubmitStaff} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assigned Rooms (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.assignedRooms}
                    onChange={(e) => setFormData({ ...formData, assignedRooms: e.target.value })}
                    placeholder="e.g., ICU-101, ICU-102"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Shift *
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Shift</option>
                    {shifts.map(shift => (
                      <option key={shift} value={shift}>{shift}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Joining Date *
                  </label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Qualification *
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g., BSc Nursing"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience *
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g., 5 years"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Performance Notes
                </label>
                <textarea
                  value={formData.performanceNotes}
                  onChange={(e) => setFormData({ ...formData, performanceNotes: e.target.value })}
                  rows="3"
                  placeholder="Add any performance feedback or notes..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  {modalType === 'add' ? 'Add Staff' : 'Update Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Staff Modal */}
      {modalType === 'view' && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Staff Details</h2>
                <button
                  onClick={() => setModalType(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                  {selectedStaff.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedStaff.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedStaff.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedStaff.status === 'Active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {selectedStaff.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Staff ID</p>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedStaff.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedStaff.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedStaff.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                    <p className="text-gray-900 dark:text-white font-medium">{new Date(selectedStaff.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedStaff.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Joining Date</p>
                    <p className="text-gray-900 dark:text-white font-medium">{new Date(selectedStaff.joiningDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Professional Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedStaff.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Qualification</p>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedStaff.qualification}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedStaff.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Shift</p>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedStaff.shift}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Attendance</p>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedStaff.attendance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Assigned Rooms</p>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedStaff.assignedRooms.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Weekly Schedule */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Weekly Schedule</h4>
                <div className="space-y-2">
                  {Object.entries(selectedStaff.schedule).map(([day, schedule]) => (
                    <div key={day} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{day}</span>
                      {schedule.enabled ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {schedule.start} - {schedule.end}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not Available</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Notes */}
              {selectedStaff.performanceNotes && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Performance Notes</h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300">{selectedStaff.performanceNotes}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setModalType(null)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {modalType === 'schedule' && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Set Schedule for {selectedStaff.name}
              </h2>
            </div>

            <form onSubmit={handleSubmitSchedule} className="p-6">
              <div className="space-y-4 mb-6">
                {Object.entries(scheduleData).map(([day, schedule]) => (
                  <div key={day} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <input
                        type="checkbox"
                        checked={schedule.enabled}
                        onChange={(e) => setScheduleData({
                          ...scheduleData,
                          [day]: { ...schedule, enabled: e.target.checked }
                        })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="font-medium text-gray-700 dark:text-gray-300 capitalize text-lg">
                        {day}
                      </span>
                    </div>
                    
                    {schedule.enabled && (
                      <div className="grid grid-cols-2 gap-4 ml-9">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={schedule.start}
                            onChange={(e) => setScheduleData({
                              ...scheduleData,
                              [day]: { ...schedule, start: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            End Time
                          </label>
                          <input
                            type="time"
                            value={schedule.end}
                            onChange={(e) => setScheduleData({
                              ...scheduleData,
                              [day]: { ...schedule, end: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseStaffManagement;