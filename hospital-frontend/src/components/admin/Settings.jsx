import React, { useState } from 'react';
import { 
  Building2, Bell, Lock, Database, Save 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  // --- State for General Settings ---
  const [generalSettings, setGeneralSettings] = useState({
    hospitalName: 'HealthCare Hospital',
    email: 'admin@healthcare.com',
    phone: '+91 98765 43210',
    address: '123 Medical Street, Mumbai, Maharashtra 400001',
    website: 'www.healthcare.com',
    timezone: 'Asia/Kolkata',
  });

  // --- State for Notification Settings ---
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    billingAlerts: true,
    systemUpdates: false,
  });

  // --- State for System Settings ---
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: 'daily',
    sessionTimeout: '30',
  });

  // --- State for Security Settings ---
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  // --- Handlers ---
  const handleSaveGeneral = () => {
    toast.success('General settings saved successfully!');
  };
  
  const handleSaveNotifications = () => {
    toast.success('Notification settings saved successfully!');
  };
  
  const handleSaveSystem = () => {
    toast.success('System settings saved successfully!');
  };

  const handleSaveSecurity = () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    if (securitySettings.newPassword && securitySettings.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }
    toast.success('Security settings updated successfully!');
    setSecuritySettings({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: securitySettings.twoFactorEnabled
    });
  };

  const handleEnable2FA = () => {
    setSecuritySettings({
      ...securitySettings,
      twoFactorEnabled: true
    });
    toast.success('Two-Factor Authentication enabled!');
  };

  const handleChangePassword = () => {
    toast.success('Password change initiated!');
  };

  const handleViewLoginHistory = () => {
    toast.success('Opening login history...');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'system', label: 'System', icon: Database },
  ];

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your hospital system configuration</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          
          {/* ---------------------------------- */}
          {/* 1. General Settings Tab Content    */}
          {/* ---------------------------------- */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2 dark:border-gray-600">Hospital Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Hospital Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hospital Name *
                    </label>
                    <input
                      type="text"
                      value={generalSettings.hospitalName}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, hospitalName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                  
                  {/* Email Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={generalSettings.email}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                  
                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={generalSettings.phone}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                  
                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="text"
                      value={generalSettings.website}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, website: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                  
                  {/* Address (Full Width) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address *
                    </label>
                    <textarea
                      value={generalSettings.address}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, address: e.target.value })
                      }
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                  
                  {/* Timezone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timezone
                    </label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, timezone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Asia/Kolkata">India Standard Time (IST)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSaveGeneral}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                <Save className="h-5 w-5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
          
          {/* ---------------------------------- */}
          {/* 2. Notification Settings Tab Content */}
          {/* ---------------------------------- */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2 dark:border-gray-600">Notification Preferences</h3>
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Enable or disable this notification type
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              [key]: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleSaveNotifications}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                <Save className="h-5 w-5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
          
          {/* ---------------------------------- */}
          {/* 3. Security Settings Tab Content   */}
          {/* ---------------------------------- */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2 dark:border-gray-600 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Security Settings
                </h3>
                
                {/* Password Change Section */}
                <div className="space-y-4 mb-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Change Password</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={securitySettings.currentPassword}
                        onChange={(e) => setSecuritySettings({...securitySettings, currentPassword: e.target.value})}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={securitySettings.newPassword}
                        onChange={(e) => setSecuritySettings({...securitySettings, newPassword: e.target.value})}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={securitySettings.confirmPassword}
                        onChange={(e) => setSecuritySettings({...securitySettings, confirmPassword: e.target.value})}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Options */}
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
                      <p className="font-medium text-gray-900 dark:text-white">Password Requirements</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">View and update password policies</p>
                    </div>
                    <button 
                      onClick={handleChangePassword}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-md dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                      Manage
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Login History</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">View recent login activity and sessions</p>
                    </div>
                    <button 
                      onClick={handleViewLoginHistory}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm shadow-md dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      View History
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSaveSecurity}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                <Save className="h-5 w-5" />
                <span>Update Security Settings</span>
              </button>
            </div>
          )}
          
          {/* ---------------------------------- */}
          {/* 4. System Settings Tab Content     */}
          {/* ---------------------------------- */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2 dark:border-gray-600">System Configuration</h3>
                <div className="space-y-4">
                  {Object.entries(systemSettings).map(([key, value]) => {
                    if (typeof value === 'boolean') {
                      return (
                        <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {key === 'maintenanceMode' && 'Temporarily disable user access for updates.'}
                              {key === 'autoBackup' && 'Automatically backup data to cloud storage.'}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) =>
                                setSystemSettings({
                                  ...systemSettings,
                                  [key]: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                          </label>
                        </div>
                      );
                    } else if (key === 'backupFrequency') {
                      return (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Backup Frequency
                          </label>
                          <select
                            value={value}
                            onChange={(e) =>
                              setSystemSettings({ ...systemSettings, backupFrequency: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                          </select>
                        </div>
                      );
                    } else if (key === 'sessionTimeout') {
                      return (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Session Timeout (minutes)
                          </label>
                          <input
                            type="number"
                            value={value}
                            onChange={(e) =>
                              setSystemSettings({ ...systemSettings, sessionTimeout: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
                
                {/* Database Status Info Box */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-3">
                    <Database className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Database Status</h4>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Last successful backup: Today at 3:00 AM (Daily schedule)
                      </p>
                      <button className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                        Run Backup Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSaveSystem}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                <Save className="h-5 w-5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;