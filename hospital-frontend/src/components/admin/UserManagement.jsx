import React, { useState, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Filter, UserPlus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const getRoleBadgeColor = (role) => {
  const colors = {
    admin: 'bg-purple-100 text-purple-800',
    doctor: 'bg-blue-100 text-blue-800',
    nurse: 'bg-green-100 text-green-800',
    patient: 'bg-yellow-100 text-yellow-800',
    ward_boy: 'bg-gray-100 text-gray-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

const getStatusColor = (status) => {
  return status === 'active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
};

const AddEditUserModal = ({ show, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'patient',
    status: user?.status || 'active',
  });

  if (!show) return null;

  const isEdit = !!user;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.role) {
      toast.error('Please fill out all required fields.');
      return;
    }

    onSave(formData, user ? user.id : null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl relative">
        <h3 className="text-2xl font-bold mb-6 text-gray-900">
          {isEdit ? 'Edit User' : 'Add New User'}
        </h3>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                required
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              {isEdit ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View User Modal
const ViewUserModal = ({ show, onClose, user }) => {
  if (!show || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl relative">
        <h3 className="text-2xl font-bold mb-6 text-gray-900">User Details</h3>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold text-2xl">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">First Name</p>
              <p className="text-base font-medium text-gray-900">{user.firstName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Name</p>
              <p className="text-base font-medium text-gray-900">{user.lastName}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-base font-medium text-gray-900">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-base font-medium text-gray-900">{user.phone || 'N/A'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Role</p>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Status</p>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@hospital.com', role: 'patient', status: 'active', phone: '555-0001' },
    { id: 2, firstName: 'Dr. Sarah', lastName: 'Smith', email: 'sarah@hospital.com', role: 'doctor', status: 'active', phone: '555-0002' },
    { id: 3, firstName: 'Jane', lastName: 'Wilson', email: 'jane@hospital.com', role: 'nurse', status: 'active', phone: '555-0003' },
    { id: 4, firstName: 'Bob', lastName: 'Johnson', email: 'bob@hospital.com', role: 'patient', status: 'inactive', phone: '555-0004' },
    { id: 5, firstName: 'Dr. Mike', lastName: 'Davis', email: 'mike@hospital.com', role: 'doctor', status: 'active', phone: '555-0005' },
  ]);

  const handleSaveUser = useCallback((formData, userId) => {
    if (userId) {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, ...formData } : user
        )
      );
      toast.success('User updated successfully! 📝');
    } else {
      const newUser = {
        ...formData,
        id: Date.now(),
        status: formData.status || 'active',
      };
      setUsers(prevUsers => [...prevUsers, newUser]);
      toast.success('New user added successfully! 🎉');
    }
  }, []);

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(u => u.id !== userId));
      toast.success('User deleted successfully');
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedUser(null);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedUser(null);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowAddModal(true);
  };
  
  const filteredUsers = users.filter((user) => {
    const term = searchTerm?.toLowerCase().trim() || '';
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    
    const matchesSearch =
      user.firstName?.toLowerCase().includes(term) ||
      user.lastName?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      fullName.includes(term); 
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all system users and their roles</p>
        </div>
        <button
          onClick={() => {
            setSelectedUser(null);
            setShowAddModal(true);
          }}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="patient">Patient</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Doctors</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {users.filter(u => u.role === 'doctor').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Nurses</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {users.filter(u => u.role === 'nurse').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Patients</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {users.filter(u => u.role === 'patient').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No users found</p>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredUsers.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{filteredUsers.length}</span> of{' '}
              <span className="font-medium">{users.length}</span> users
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <AddEditUserModal 
        show={showAddModal} 
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        user={selectedUser}
      />

      <ViewUserModal 
        show={showViewModal} 
        onClose={handleCloseViewModal}
        user={selectedUser}
      />
    </div>
  );
};

export default UserManagement;