import React, { useState } from 'react';
import { 
  Building2, Bell, Lock, Database, Save // Removed unused imports: Globe, Mail, CheckCircle, Smartphone
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  // --- State for General Settings ---
  const [generalSettings, setGeneralSettings] = useState({
    hospitalName: 'HealthCare Hospital',
    email: 'admin@healthcare.com',
    phone: '+1 (555) 123-4567',
    address: '123 Medical Street, NY 10001',
    website: 'www.healthcare.com',
    timezone: 'America/New_York',
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

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'system', label: 'System', icon: Database },
  ];

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your hospital system configuration</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  // Note: primary-50 and primary-700 are placeholders for your custom Tailwind theme color
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
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
                <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Hospital Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Hospital Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital Name *
                    </label>
                    <input
                      type="text"
                      value={generalSettings.hospitalName}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, hospitalName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Email Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={generalSettings.email}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={generalSettings.phone}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="text"
                      value={generalSettings.website}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, website: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Address (Full Width) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      value={generalSettings.address}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, address: e.target.value })
                      }
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Timezone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, timezone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSaveGeneral}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
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
                <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Notification Preferences</h3>
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        {/* Format key name for display */}
                        <h4 className="text-sm font-medium text-gray-900">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleSaveNotifications}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
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
                <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Security Settings</h3>
                <div className="space-y-6">
                  
                  {/* Password Change */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Change Password
                    </label>
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Two-Factor Authentication */}
                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <p className="text-sm text-gray-700 font-medium">2FA Status: <span className="text-red-500 font-normal">Disabled</span></p>
                        <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account.</p>
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
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
                <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">System Configuration</h3>
                <div className="space-y-4">
                  {Object.entries(systemSettings).map(([key, value]) => {
                    // Logic for Boolean Toggles (maintenanceMode, autoBackup)
                    if (typeof value === 'boolean') {
                      return (
                        <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
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
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      );
                    } 
                    // Logic for Backup Frequency Select
                    else if (key === 'backupFrequency') {
                      return (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Backup Frequency
                          </label>
                          <select
                            value={value}
                            onChange={(e) =>
                              setSystemSettings({ ...systemSettings, backupFrequency: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                          </select>
                        </div>
                      );
                    } 
                    // Logic for Session Timeout Input
                    else if (key === 'sessionTimeout') {
                      return (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Session Timeout (minutes)
                          </label>
                          <input
                            type="number"
                            value={value}
                            onChange={(e) =>
                              setSystemSettings({ ...systemSettings, sessionTimeout: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
                
                {/* Database Status Info Box */}
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-start space-x-3">
                    <Database className="h-5 w-5 text-indigo-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-indigo-900">Database Status</h4>
                      <p className="text-xs text-indigo-700 mt-1">
                        Last successful backup: Today at 3:00 AM (Daily schedule)
                      </p>
                      <button className="mt-2 text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                        Run Backup Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSaveSystem}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
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
