import React, { useState } from 'react';
import { 
  Search, Plus, Edit2, Trash2, Eye, X, Calendar, Clock,
  User, Phone, Mail, Stethoscope, Users, CheckCircle, XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const DoctorManagement = () => {
  const [activeTab, setActiveTab] = useState('all'); // all, active, inactive
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // add, edit, view, schedule, patients
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Mock data - Doctors
  const [doctors, setDoctors] = useState([
    { 
      id: 'D001',
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'sarah.smith@hospital.com',
      phone: '+91 9876543210',
      gender: 'female',
      dateOfBirth: '1980-05-15',
      specialization: 'Cardiology',
      licenseNumber: 'MED-2020-001',
      education: 'MBBS, MD (Cardiology)',
      experience: 15,
      department: 'Cardiology',
      status: 'active',
      consultationFee: 1500,
      joiningDate: '2010-03-15',
      totalPatients: 145,
      availability: {
        monday: { start: '09:00', end: '17:00', available: true },
        tuesday: { start: '09:00', end: '17:00', available: true },
        wednesday: { start: '09:00', end: '17:00', available: true },
        thursday: { start: '09:00', end: '17:00', available: true },
        friday: { start: '09:00', end: '17:00', available: true },
        saturday: { start: '09:00', end: '13:00', available: true },
        sunday: { start: '', end: '', available: false }
      },
      patients: [
        { id: 'P001', name: 'John Doe', lastVisit: '2024-10-15', condition: 'Stable' },
        { id: 'P002', name: 'Jane Smith', lastVisit: '2024-10-14', condition: 'Critical' }
      ]
    },
    { 
      id: 'D002',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@hospital.com',
      phone: '+91 9876543220',
      gender: 'male',
      dateOfBirth: '1975-08-22',
      specialization: 'Neurology',
      licenseNumber: 'MED-2018-045',
      education: 'MBBS, MD (Neurology)',
      experience: 20,
      department: 'Neurology',
      status: 'active',
      consultationFee: 2000,
      joiningDate: '2008-06-20',
      totalPatients: 198,
      availability: {
        monday: { start: '10:00', end: '18:00', available: true },
        tuesday: { start: '10:00', end: '18:00', available: true },
        wednesday: { start: '10:00', end: '18:00', available: true },
        thursday: { start: '10:00', end: '18:00', available: true },
        friday: { start: '10:00', end: '18:00', available: true },
        saturday: { start: '', end: '', available: false },
        sunday: { start: '', end: '', available: false }
      },
      patients: [
        { id: 'P003', name: 'Bob Wilson', lastVisit: '2024-10-13', condition: 'Stable' }
      ]
    },
    { 
      id: 'D003',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@hospital.com',
      phone: '+91 9876543230',
      gender: 'female',
      dateOfBirth: '1985-11-10',
      specialization: 'General Surgery',
      licenseNumber: 'MED-2022-089',
      education: 'MBBS, MS (General Surgery)',
      experience: 10,
      department: 'Surgery',
      status: 'active',
      consultationFee: 1200,
      joiningDate: '2014-01-10',
      totalPatients: 87,
      availability: {
        monday: { start: '08:00', end: '16:00', available: true },
        tuesday: { start: '08:00', end: '16:00', available: true },
        wednesday: { start: '', end: '', available: false },
        thursday: { start: '08:00', end: '16:00', available: true },
        friday: { start: '08:00', end: '16:00', available: true },
        saturday: { start: '08:00', end: '12:00', available: true },
        sunday: { start: '', end: '', available: false }
      },
      patients: []
    },
    { 
      id: 'D004',
      firstName: 'John',
      lastName: 'Williams',
      email: 'john.williams@hospital.com',
      phone: '+91 9876543240',
      gender: 'male',
      dateOfBirth: '1978-03-25',
      specialization: 'Orthopedics',
      licenseNumber: 'MED-2019-123',
      education: 'MBBS, MS (Orthopedics)',
      experience: 18,
      department: 'Orthopedics',
      status: 'inactive',
      consultationFee: 1800,
      joiningDate: '2009-09-01',
      totalPatients: 165,
      availability: {
        monday: { start: '', end: '', available: false },
        tuesday: { start: '', end: '', available: false },
        wednesday: { start: '', end: '', available: false },
        thursday: { start: '', end: '', available: false },
        friday: { start: '', end: '', available: false },
        saturday: { start: '', end: '', available: false },
        sunday: { start: '', end: '', available: false }
      },
      patients: []
    }
  ]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    specialization: '',
    licenseNumber: '',
    education: '',
    experience: '',
    department: '',
    consultationFee: '',
    joiningDate: '',
    status: 'active'
  });

  const [scheduleData, setScheduleData] = useState({
    monday: { start: '09:00', end: '17:00', available: true },
    tuesday: { start: '09:00', end: '17:00', available: true },
    wednesday: { start: '09:00', end: '17:00', available: true },
    thursday: { start: '09:00', end: '17:00', available: true },
    friday: { start: '09:00', end: '17:00', available: true },
    saturday: { start: '09:00', end: '13:00', available: true },
    sunday: { start: '', end: '', available: false }
  });

  // Specializations list
  const specializations = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology',
    'General Surgery', 'Gynecology', 'Psychiatry', 'Radiology', 'Anesthesiology',
    'Oncology', 'Gastroenterology', 'ENT', 'Ophthalmology', 'Urology'
  ];

  // Departments list
  const departments = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Surgery',
    'Gynecology', 'Emergency', 'ICU', 'General Medicine'
  ];

  // Stats calculation
  const stats = {
    total: doctors.length,
    active: doctors.filter(d => d.status === 'active').length,
    inactive: doctors.filter(d => d.status === 'inactive').length,
    totalPatients: doctors.reduce((sum, d) => sum + d.totalPatients, 0),
    avgExperience: Math.round(doctors.reduce((sum, d) => sum + d.experience, 0) / doctors.length)
  };

  // Handlers
  const handleAddDoctor = () => {
    setModalType('add');
    setSelectedDoctor(null);
    setFormData({
      firstName: '', lastName: '', email: '', phone: '', gender: '',
      dateOfBirth: '', specialization: '', licenseNumber: '', education: '',
      experience: '', department: '', consultationFee: '', joiningDate: '', status: 'active'
    });
    setShowModal(true);
  };

  const handleEditDoctor = (doctor) => {
    setModalType('edit');
    setSelectedDoctor(doctor);
    setFormData({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      phone: doctor.phone,
      gender: doctor.gender,
      dateOfBirth: doctor.dateOfBirth,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      education: doctor.education,
      experience: doctor.experience,
      department: doctor.department,
      consultationFee: doctor.consultationFee,
      joiningDate: doctor.joiningDate,
      status: doctor.status
    });
    setShowModal(true);
  };

  const handleViewDoctor = (doctor) => {
    setModalType('view');
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleSchedule = (doctor) => {
    setModalType('schedule');
    setSelectedDoctor(doctor);
    setScheduleData(doctor.availability);
    setShowModal(true);
  };

  const handleViewPatients = (doctor) => {
    setModalType('patients');
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleDeleteDoctor = (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      setDoctors(doctors.filter(d => d.id !== doctorId));
      toast.success('Doctor deleted successfully');
    }
  };

  const handleToggleStatus = (doctorId) => {
    setDoctors(doctors.map(d => 
      d.id === doctorId 
        ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' }
        : d
    ));
    toast.success('Doctor status updated');
  };

  const handleSubmitDoctor = (e) => {
    e.preventDefault();
    if (selectedDoctor) {
      setDoctors(doctors.map(d => 
        d.id === selectedDoctor.id ? { ...d, ...formData } : d
      ));
      toast.success('Doctor updated successfully');
    } else {
      const newDoctor = { 
        id: `D${String(doctors.length + 1).padStart(3, '0')}`,
        ...formData,
        totalPatients: 0,
        availability: scheduleData,
        patients: []
      };
      setDoctors([...doctors, newDoctor]);
      toast.success('Doctor added successfully');
    }
    setShowModal(false);
  };

  const handleSubmitSchedule = (e) => {
    e.preventDefault();
    setDoctors(doctors.map(d => 
      d.id === selectedDoctor.id ? { ...d, availability: scheduleData } : d
    ));
    toast.success('Schedule updated successfully');
    setShowModal(false);
  };

  // Filter functions
  const filteredDoctors = doctors.filter(doctor => {
    const fullName = `Dr. ${doctor.firstName} ${doctor.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'active' && doctor.status === 'active') ||
      (activeTab === 'inactive' && doctor.status === 'inactive');

    return matchesSearch && matchesTab;
  });

  // Helper functions
  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3" />
        Inactive
      </span>
    );
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
          <p className="text-gray-600 mt-1">Manage doctors, schedules, and assignments</p>
        </div>
        <button
          onClick={handleAddDoctor}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Doctor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Doctors</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Active</p>
              <p className="text-3xl font-bold mt-2">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Inactive</p>
              <p className="text-3xl font-bold mt-2">{stats.inactive}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Patients</p>
              <p className="text-3xl font-bold mt-2">{stats.totalPatients}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Avg Experience</p>
              <p className="text-3xl font-bold mt-2">{stats.avgExperience} yrs</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-6">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Doctors ({doctors.length})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active ({stats.active})
              </button>
              <button
                onClick={() => setActiveTab('inactive')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'inactive'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Inactive ({stats.inactive})
              </button>
            </nav>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, ID, specialization, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Doctors Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patients</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{doctor.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">
                            {doctor.firstName[0]}{doctor.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            Dr. {doctor.firstName} {doctor.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{doctor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {doctor.specialization}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.experience} years</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewPatients(doctor)}
                        className="text-sm text-blue-600 hover:text-blue-900 font-medium"
                      >
                        {doctor.totalPatients} patients
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">₹{doctor.consultationFee}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(doctor.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDoctor(doctor)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEditDoctor(doctor)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleSchedule(doctor)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Set Schedule"
                        >
                          <Calendar className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(doctor.id)}
                          className={`${doctor.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                          title={doctor.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {doctor.status === 'active' ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => handleDeleteDoctor(doctor.id)}
                          className="text-red-600 hover:text-red-900"
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
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Add/Edit Doctor Modal */}
            {(modalType === 'add' || modalType === 'edit') && (
              <>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {modalType === 'add' ? 'Add New Doctor' : 'Edit Doctor'}
                  </h2>
                </div>
                <form onSubmit={handleSubmitDoctor} className="p-6 space-y-4">
                  {/* Personal Information Section */}
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="doctor@hospital.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                        <input
                          type="date"
                          required
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                        <select
                          required
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information Section */}
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
                        <select
                          required
                          value={formData.specialization}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Specialization</option>
                          {specializations.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                          ))}
                        </select>
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
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">License Number *</label>
                        <input
                          type="text"
                          required
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="MED-2024-XXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years) *</label>
                        <input
                          type="number"
                          required
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Education *</label>
                      <input
                        type="text"
                        required
                        value={formData.education}
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="MBBS, MD (Specialization)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (₹) *</label>
                        <input
                          type="number"
                          required
                          value={formData.consultationFee}
                          onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date *</label>
                        <input
                          type="date"
                          required
                          value={formData.joiningDate}
                          onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {modalType === 'add' ? 'Add Doctor' : 'Update Doctor'}
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

            {/* View Doctor Modal */}
            {modalType === 'view' && selectedDoctor && (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Doctor Details</h2>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Doctor Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-blue-600">
                            {selectedDoctor.firstName[0]}{selectedDoctor.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{selectedDoctor.id}</p>
                        </div>
                      </div>
                      {getStatusBadge(selectedDoctor.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-600">Age</p>
                        <p className="text-sm font-semibold text-gray-900">{calculateAge(selectedDoctor.dateOfBirth)} years</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Gender</p>
                        <p className="text-sm font-semibold text-gray-900 capitalize">{selectedDoctor.gender}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Experience</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedDoctor.experience} years</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total Patients</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedDoctor.totalPatients}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-blue-600" />
                      Contact Information
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-600">Email</p>
                          <p className="text-sm font-medium text-gray-900">{selectedDoctor.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-600">Phone</p>
                          <p className="text-sm font-medium text-gray-900">{selectedDoctor.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-green-600" />
                      Professional Details
                    </h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">Specialization</p>
                          <p className="text-sm font-semibold text-gray-900">{selectedDoctor.specialization}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Department</p>
                          <p className="text-sm font-semibold text-gray-900">{selectedDoctor.department}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">License Number</p>
                          <p className="text-sm font-semibold text-gray-900">{selectedDoctor.licenseNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Education</p>
                          <p className="text-sm font-semibold text-gray-900">{selectedDoctor.education}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Consultation Fee</p>
                          <p className="text-sm font-semibold text-green-600">₹{selectedDoctor.consultationFee}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Joining Date</p>
                          <p className="text-sm font-semibold text-gray-900">{selectedDoctor.joiningDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Schedule */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      Weekly Schedule
                    </h4>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="space-y-2">
                        {Object.entries(selectedDoctor.availability).map(([day, schedule]) => (
                          <div key={day} className="flex items-center justify-between p-2 bg-white rounded">
                            <span className="text-sm font-medium text-gray-900 capitalize">{day}</span>
                            {schedule.available ? (
                              <span className="text-sm text-green-600 font-medium">
                                {schedule.start} - {schedule.end}
                              </span>
                            ) : (
                              <span className="text-sm text-red-600 font-medium">Not Available</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowModal(false);
                        handleEditDoctor(selectedDoctor);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit Doctor
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Schedule Modal */}
            {modalType === 'schedule' && selectedDoctor && (
              <>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Set Doctor Schedule</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                  </p>
                </div>
                <form onSubmit={handleSubmitSchedule} className="p-6 space-y-4">
                  {Object.entries(scheduleData).map(([day, schedule]) => (
                    <div key={day} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-gray-900 capitalize">{day}</label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={schedule.available}
                            onChange={(e) => setScheduleData({
                              ...scheduleData,
                              [day]: { ...schedule, available: e.target.checked }
                            })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">Available</span>
                        </label>
                      </div>
                      {schedule.available && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                            <input
                              type="time"
                              value={schedule.start}
                              onChange={(e) => setScheduleData({
                                ...scheduleData,
                                [day]: { ...schedule, start: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">End Time</label>
                            <input
                              type="time"
                              value={schedule.end}
                              onChange={(e) => setScheduleData({
                                ...scheduleData,
                                [day]: { ...schedule, end: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Schedule
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

            {/* Patients List Modal */}
            {modalType === 'patients' && selectedDoctor && (
              <>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Patient List</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Dr. {selectedDoctor.firstName} {selectedDoctor.lastName} - {selectedDoctor.totalPatients} Total Patients
                  </p>
                </div>
                <div className="p-6">
                  {selectedDoctor.patients && selectedDoctor.patients.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDoctor.patients.map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{patient.name}</p>
                              <p className="text-xs text-gray-500">ID: {patient.id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">Last Visit</p>
                            <p className="text-sm font-medium text-gray-900">{patient.lastVisit}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              patient.condition === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {patient.condition}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No patients assigned yet</p>
                    </div>
                  )}

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
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;