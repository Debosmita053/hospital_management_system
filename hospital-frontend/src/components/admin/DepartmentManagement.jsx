// ============================================
// FILE 1: src/components/admin/DepartmentManagement.jsx
// ============================================
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Users, Building2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const DepartmentManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headDoctor: '',
    contactNumber: '',
  });

  // Mock departments data
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: 'Cardiology',
      description: 'Heart and cardiovascular system care',
      headDoctor: 'Dr. Sarah Smith',
      contactNumber: '555-1001',
      doctorCount: 8,
      patientCount: 145,
    },
    {
      id: 2,
      name: 'Neurology',
      description: 'Brain and nervous system disorders',
      headDoctor: 'Dr. Mike Davis',
      contactNumber: '555-1002',
      doctorCount: 6,
      patientCount: 98,
    },
    {
      id: 3,
      name: 'Orthopedics',
      description: 'Bone, joint, and muscle treatment',
      headDoctor: 'Dr. John Lee',
      contactNumber: '555-1003',
      doctorCount: 10,
      patientCount: 234,
    },
    {
      id: 4,
      name: 'Pediatrics',
      description: 'Children and adolescent healthcare',
      headDoctor: 'Dr. Emily Brown',
      contactNumber: '555-1004',
      doctorCount: 7,
      patientCount: 189,
    },
    {
      id: 5,
      name: 'Emergency',
      description: '24/7 emergency medical services',
      headDoctor: 'Dr. Robert Wilson',
      contactNumber: '555-1005',
      doctorCount: 15,
      patientCount: 456,
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

  // Calculate totals
  const totalDoctors = departments.reduce((sum, dept) => sum + dept.doctorCount, 0);
  const totalPatients = departments.reduce((sum, dept) => sum + dept.patientCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600 mt-1">Manage hospital departments and their staff</p>
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
            {/* Modal Header */}
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

            {/* Modal Body */}
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
                  {selectedDepartment ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;