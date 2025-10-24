import React, { useContext, useState, useRef } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Award, Edit2, Save, X, Camera, Shield } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: user?.email || 'admin@hospital.com',
    phone: '+91 98765 43210',
    dateOfBirth: '1985-03-20',
    address: '456 Admin Street, Mumbai, Maharashtra 400001',
    department: 'Administration',
    qualification: 'MBA in Healthcare Management',
    experience: '10 years',
    joiningDate: '2015-01-10',
    employeeId: 'ADM001'
  });

  // Profile image handler
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      toast.success('Profile picture updated!');
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    // TODO: API call to save profile
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: 'John',
      lastName: 'Doe',
      email: user?.email || 'admin@hospital.com',
      phone: '+91 98765 43210',
      dateOfBirth: '1985-03-20',
      address: '456 Admin Street, Mumbai, Maharashtra 400001',
      department: 'Administration',
      qualification: 'MBA in Healthcare Management',
      experience: '10 years',
      joiningDate: '2015-01-10',
      employeeId: 'ADM001'
    });
  };

  // Security button handlers
  const handleEnable2FA = () => {
    setSecuritySettings({
      ...securitySettings,
      twoFactorEnabled: true
    });
    toast.success('Two-Factor Authentication enabled!');
  };

  const handleChangePassword = () => {
    if (securitySettings.newPassword && securitySettings.newPassword !== securitySettings.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    if (securitySettings.newPassword && securitySettings.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }
    toast.success('Password changed successfully!');
    setSecuritySettings({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: securitySettings.twoFactorEnabled
    });
  };

  const handleViewLoginHistory = () => {
    toast.success('Opening login history...');
  };

  const handleSecurityInputChange = (field, value) => {
    setSecuritySettings({
      ...securitySettings,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 dark:bg-green-700 dark:hover:bg-green-600"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div 
              className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-3xl cursor-pointer hover:opacity-80 transition-opacity"
              onClick={isEditing ? handleImageClick : undefined}
            >
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                'JD'
              )}
            </div>
            {isEditing && (
              <>
                <div className="absolute bottom-0 right-0 p-1 bg-blue-600 text-white rounded-full dark:bg-blue-500">
                  <Camera className="w-4 h-4" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">System Administrator</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1 dark:bg-green-900 dark:text-green-200">
                <Shield className="w-3 h-3" />
                Admin Access
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Employee ID: {formData.employeeId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2 dark:border-gray-600">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              First Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-medium">{formData.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Last Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-medium">{formData.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-medium">{formData.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone (India)
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="+91 98765 43210"
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-medium">{formData.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date of Birth
            </label>
            {isEditing ? (
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-medium">
                {new Date(formData.dateOfBirth).toLocaleDateString('en-IN')}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Address
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-medium">{formData.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2 dark:border-gray-600">
          Professional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Briefcase className="w-4 h-4 inline mr-2" />
              Department
            </label>
            <p className="text-gray-900 dark:text-white font-medium">{formData.department}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Joining Date
            </label>
            <p className="text-gray-900 dark:text-white font-medium">
              {new Date(formData.joiningDate).toLocaleDateString('en-IN')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Award className="w-4 h-4 inline mr-2" />
              Qualification
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-medium">{formData.qualification}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Briefcase className="w-4 h-4 inline mr-2" />
              Experience
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-medium">{formData.experience}</p>
            )}
          </div>
        </div>
      </div>

      {/* Admin Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2 dark:border-gray-600">
          System Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">487</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Staff</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">342</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Departments</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">15</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">System Uptime</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">99.8%</p>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2 dark:border-gray-600 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Security Settings
        </h3>
        
        {/* Password Change Section */}
        <div className="space-y-4 mb-6">
          <h4 className="text-md font-medium text-gray-900 dark:text-white">Change Password</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={securitySettings.currentPassword}
                onChange={(e) => handleSecurityInputChange('currentPassword', e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={securitySettings.newPassword}
                onChange={(e) => handleSecurityInputChange('newPassword', e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={securitySettings.confirmPassword}
                onChange={(e) => handleSecurityInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>
          <button 
            onClick={handleChangePassword}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center space-x-2 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Save className="w-4 h-4" />
            <span>Update Password</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Status: <span className={securitySettings.twoFactorEnabled ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  {securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add an extra layer of security to your account</p>
            </div>
            <button 
              onClick={handleEnable2FA}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm shadow-md dark:bg-green-700 dark:hover:bg-green-600"
            >
              {securitySettings.twoFactorEnabled ? "Configure" : "Enable 2FA"}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Login History</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">View recent login activity and sessions</p>
            </div>
            <button 
              onClick={handleViewLoginHistory}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm shadow-md dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;