// ============================================
// FILE: src/components/admin/DepartmentManagement.jsx (COMPLETE WITH ASSIGNMENT)
// ============================================
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Users, Building2, X, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const DepartmentManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headDoctor: '',
    contactNumber: '',
  });

  // Available staff (mock data - in real app, fetch from API)
  const availableStaff = [
    { id: 'staff1', name: 'Dr. John Smith', role: 'doctor', specialization: 'Cardiology' },
    { id: 'staff2', name: 'Dr. Emily Johnson', role: 'doctor', specialization: 'Neurology' },
    { id: 'staff3', name: 'Nurse Sarah Wilson', role: 'nurse', specialization: 'General' },
    { id: 'staff4', name: 'Nurse Mike Brown', role: 'nurse', specialization: 'ICU' },
    { id: 'staff5', name: 'Dr. Lisa Davis', role: 'doctor', specialization: 'Pediatrics' },
    { id: 'staff6', name: 'Nurse Amy Chen', role: 'nurse', specialization: 'Cardiology' },
    { id: 'staff7', name: 'Dr. Robert Wilson', role: 'doctor', specialization: 'Emergency' },
  ];

  // Mock departments data
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: 'Cardiology',
      description: 'Heart and cardiovascular system care',
      headDoctor: 'Dr. Sarah Smith',
      contactNumber: '555-1001',
      doctorCount: 3,
      patientCount: 145,
      assignedStaff: [
        { id: 's1', name: 'Dr. Sarah Smith', role: 'doctor' },
        { id: 's2', name: 'Nurse Jane Wilson', role: 'nurse' },
      ],
    },
    {
      id: 2,
      name: 'Neurology',
      description: 'Brain and nervous system disorders',
      headDoctor: 'Dr. Mike Davis',
      contactNumber: '555-1002',
      doctorCount: 2,
      patientCount: 98,
      assignedStaff: [
        { id: 's3', name: 'Dr. Mike Davis', role: 'doctor' },
      ],
    },
    {
      id: 3,
      name: 'Orthopedics',
      description: 'Bone, joint, and muscle treatment',
      headDoctor: 'Dr. John Lee',
      contactNumber: '555-1003',
      doctorCount: 4,
      patientCount: 234,
      assignedStaff: [
        { id: 's4', name: 'Dr. John Lee', role: 'doctor' },
        { id: 's5', name: 'Nurse Emily Brown', role: 'nurse' },
        { id: 's6', name: 'Nurse Tom Green', role: 'nurse' },
      ],
    },
    {
      id: 4,
      name: 'Pediatrics',
      description: 'Children and adolescent healthcare',
      headDoctor: 'Dr. Emily Brown',
      contactNumber: '555-1004',
      doctorCount: 3,
      patientCount: 189,
      assignedStaff: [],
    },
    {
      id: 5,
      name: 'Emergency',
      description: '24/7 emergency medical services',
      headDoctor: 'Dr. Robert Wilson',
      contactNumber: '555-1005',
      doctorCount: 5,
      patientCount: 456,
      assignedStaff: [
        { id: 's7', name: 'Dr. Robert Wilson', role: 'doctor' },
        { id: 's8', name: 'Nurse Lisa White', role: 'nurse' },
      ],
    },
  ]);

  const handleOpenModal = (department = null) => {
    if (department) {
      setSelectedDepartment(department);
      setFormData({
        name: department.name,
        description: department.description,
        headDoctor: department.headDoctor,
        contactNumber: department.contactNumber,
      });
    } else {
      setSelectedDepartment(null);
      setFormData({
        name: '',
        description: '',
        headDoctor: '',
        contactNumber: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDepartment(null);
    setFormData({
      name: '',
      description: '',
      headDoctor: '',
      contactNumber: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedDepartment) {
      // Update existing department
      setDepartments(
        departments.map((dept) =>
          dept.id === selectedDepartment.id
            ? { ...dept, ...formData }
            : dept
        )
      );
      toast.success('Department updated successfully!');
    } else {
      // Add new department
      const newDepartment = {
        id: departments.length + 1,
        ...formData,
        doctorCount: 0,
        patientCount: 0,
        assignedStaff: [],
      };
      setDepartments([...departments, newDepartment]);
      toast.success('Department created successfully!');
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter((dept) => dept.id !== id));
      toast.success('Department deleted successfully!');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Staff Assignment Functions
  const handleOpenAssignModal = (department) => {
    setSelectedDepartment(department);
    setSelectedStaff([]);
    setShowAssignModal(true);
  };

  const handleToggleStaff = (staffId) => {
    if (selectedStaff.includes(staffId)) {
      setSelectedStaff(selectedStaff.filter(id => id !== staffId));
    } else {
      setSelectedStaff([...selectedStaff, staffId]);
    }
  };

  const handleAssignStaff = () => {
    const staffToAdd = availableStaff.filter(staff => 
      selectedStaff.includes(staff.id)
    );

    setDepartments(departments.map(dept => 
      dept.id === selectedDepartment.id
        ? {
            ...dept,
            assignedStaff: [...dept.assignedStaff, ...staffToAdd.map(s => ({
              id: s.id,
              name: s.name,
              role: s.role,
            }))],
            doctorCount: dept.doctorCount + staffToAdd.filter(s => s.role === 'doctor').length,
          }
        : dept
    ));

    toast.success(`${staffToAdd.length} staff member(s) assigned successfully!`);
    setShowAssignModal(false);
    setSelectedStaff([]);
  };

  const handleRemoveStaff = (deptId, staffId) => {
    if (window.confirm('Remove this staff member from the department?')) {
      setDepartments(departments.map(dept => 
        dept.id === deptId
          ? {
              ...dept,
              assignedStaff: dept.assignedStaff.filter(s => s.id !== staffId),
              doctorCount: dept.assignedStaff.find(s => s.id === staffId)?.role === 'doctor' 
                ? dept.doctorCount - 1 
                : dept.doctorCount,
            }
          : dept
      ));
      toast.success('Staff member removed from department');
    }
  };

  // Calculate totals
  const totalDoctors = departments.reduce((sum, dept) => sum + dept.doctorCount, 0);
  const totalPatients = departments.reduce((sum, dept) => sum + dept.patientCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600 mt-1">Manage hospital departments and assign staff</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Departments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{departments.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Doctors</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalDoctors}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalPatients}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Users className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <div
            key={department.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Department Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{department.name}</h3>
                  <p className="text-sm text-gray-500">Dept. #{department.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleOpenModal(department)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(department.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {department.description}
            </p>

            {/* Head Doctor */}
            <div className="mb-4 pb-4 border-b border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Head of Department</p>
              <p className="text-sm font-medium text-gray-900">{department.headDoctor}</p>
              <p className="text-xs text-gray-500 mt-1">{department.contactNumber}</p>
            </div>

            {/* Assigned Staff Section - NEW! */}
            <div className="mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-700">
                  Assigned Staff ({department.assignedStaff.length})
                </p>
                <button
                  onClick={() => handleOpenAssignModal(department)}
                  className="flex items-center space-x-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  <UserPlus className="h-3 w-3" />
                  <span>Assign</span>
                </button>
              </div>
              
              {department.assignedStaff.length > 0 ? (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {department.assignedStaff.slice(0, 3).map((staff) => (
                    <div 
                      key={staff.id} 
                      className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1.5"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-600 text-xs font-medium">
                            {staff.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-gray-700 truncate">{staff.name}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveStaff(department.id, staff.id)}
                        className="text-red-500 hover:text-red-700 flex-shrink-0"
                        title="Remove"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {department.assignedStaff.length > 3 && (
                    <p className="text-xs text-gray-500 text-center pt-1">
                      +{department.assignedStaff.length - 3} more staff
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-2">
                  No staff assigned yet
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Doctors</p>
                <p className="text-xl font-bold text-gray-900">{department.doctorCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Patients</p>
                <p className="text-xl font-bold text-gray-900">{department.patientCount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Department Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedDepartment ? 'Edit Department' : 'Add New Department'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Cardiology"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Brief description of the department"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Head of Department *
                </label>
                <input
                  type="text"
                  name="headDoctor"
                  required
                  value={formData.headDoctor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Dr. John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  required
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="555-1234"
                />
              </div>

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
                  {selectedDepartment ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Staff Modal - NEW! */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Assign Staff</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Add staff to {selectedDepartment?.name}
                </p>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {availableStaff.map((staff) => {
                  const isAlreadyAssigned = selectedDepartment?.assignedStaff.some(
                    s => s.id === staff.id
                  );
                  
                  return (
                    <div
                      key={staff.id}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                        isAlreadyAssigned
                          ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60'
                          : selectedStaff.includes(staff.id)
                          ? 'border-primary-500 bg-primary-50 cursor-pointer'
                          : 'border-gray-200 hover:bg-gray-50 cursor-pointer'
                      }`}
                      onClick={() => !isAlreadyAssigned && handleToggleStaff(staff.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {staff.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{staff.name}</p>
                          <p className="text-sm text-gray-500">
                            {staff.role === 'doctor' ? '👨‍⚕️ Doctor' : '👩‍⚕️ Nurse'} • {staff.specialization}
                          </p>
                          {isAlreadyAssigned && (
                            <p className="text-xs text-green-600 font-medium">Already assigned</p>
                          )}
                        </div>
                      </div>
                      {!isAlreadyAssigned && (
                        <input
                          type="checkbox"
                          checked={selectedStaff.includes(staff.id)}
                          onChange={() => {}}
                          className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600 font-medium">
                {selectedStaff.length} staff member{selectedStaff.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignStaff}
                  disabled={selectedStaff.length === 0}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Assign {selectedStaff.length > 0 && `(${selectedStaff.length})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;