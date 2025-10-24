import React, { useState } from 'react';
import { 
  Search, Plus, Edit2, Trash2, Eye, Upload, Download, 
  FileText, CheckCircle, Clock, Beaker,
  TrendingUp, Activity, DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, lab-requests, test-types, results
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock data - Test Types
  const [testTypes, setTestTypes] = useState([
    { id: 1, name: 'Complete Blood Count (CBC)', category: 'Hematology', price: 500, turnaroundTime: '24 hours', description: 'Measures different components of blood' },
    { id: 2, name: 'Lipid Profile', category: 'Biochemistry', price: 800, turnaroundTime: '24 hours', description: 'Cholesterol and triglyceride levels' },
    { id: 3, name: 'Blood Sugar (Fasting)', category: 'Biochemistry', price: 200, turnaroundTime: '12 hours', description: 'Measures fasting blood glucose' },
    { id: 4, name: 'Liver Function Test (LFT)', category: 'Biochemistry', price: 1200, turnaroundTime: '48 hours', description: 'Evaluates liver health' },
    { id: 5, name: 'Thyroid Profile', category: 'Endocrinology', price: 1500, turnaroundTime: '48 hours', description: 'T3, T4, TSH levels' },
    { id: 6, name: 'X-Ray Chest', category: 'Radiology', price: 600, turnaroundTime: '2 hours', description: 'Chest radiography' },
    { id: 7, name: 'Urine Routine', category: 'Pathology', price: 300, turnaroundTime: '12 hours', description: 'Urine analysis' },
    { id: 8, name: 'ECG', category: 'Cardiology', price: 400, turnaroundTime: '1 hour', description: 'Electrocardiogram' },
  ]);

  // Mock data - Test Requests
  const [testRequests, setTestRequests] = useState([
    { id: 'TR001', patientName: 'John Doe', patientId: 'P001', doctorName: 'Dr. Sarah Smith', testName: 'Complete Blood Count (CBC)', requestDate: '2024-10-15', priority: 'urgent', status: 'pending', labAssigned: null },
    { id: 'TR002', patientName: 'Jane Smith', patientId: 'P002', doctorName: 'Dr. Mike Johnson', testName: 'Lipid Profile', requestDate: '2024-10-15', priority: 'routine', status: 'in-progress', labAssigned: 'Lab A' },
    { id: 'TR003', patientName: 'Bob Wilson', patientId: 'P003', doctorName: 'Dr. Sarah Smith', testName: 'Thyroid Profile', requestDate: '2024-10-14', priority: 'routine', status: 'completed', labAssigned: 'Lab B' },
    { id: 'TR004', patientName: 'Alice Brown', patientId: 'P004', doctorName: 'Dr. Emily Davis', testName: 'X-Ray Chest', requestDate: '2024-10-15', priority: 'urgent', status: 'in-progress', labAssigned: 'Radiology Lab' },
    { id: 'TR005', patientName: 'Charlie Green', patientId: 'P005', doctorName: 'Dr. Mike Johnson', testName: 'Blood Sugar (Fasting)', requestDate: '2024-10-13', priority: 'routine', status: 'completed', labAssigned: 'Lab A' },
  ]);

  // Mock data - Test Results
  const [testResults, setTestResults] = useState([
    { id: 'TR003', patientName: 'Bob Wilson', testName: 'Thyroid Profile', completedDate: '2024-10-14', resultFile: 'thyroid_report.pdf', uploadedBy: 'Lab Technician A', notes: 'All values within normal range' },
    { id: 'TR005', patientName: 'Charlie Green', testName: 'Blood Sugar (Fasting)', completedDate: '2024-10-13', resultFile: 'blood_sugar.pdf', uploadedBy: 'Lab Technician B', notes: 'Slightly elevated, follow-up recommended' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    turnaroundTime: '',
    description: '',
    labAssigned: '',
    resultFile: null,
    notes: ''
  });

  // Stats calculation
  const stats = {
    totalRequests: testRequests.length,
    pending: testRequests.filter(t => t.status === 'pending').length,
    inProgress: testRequests.filter(t => t.status === 'in-progress').length,
    completed: testRequests.filter(t => t.status === 'completed').length,
    totalTestTypes: testTypes.length,
    urgentRequests: testRequests.filter(t => t.priority === 'urgent').length,
    totalRevenue: testResults.length * 850,
    avgTurnaround: '28 hours'
  };

  // Handlers
  const handleAddTestType = () => {
    setModalType('addTest');
    setSelectedItem(null);
    setFormData({ name: '', category: '', price: '', turnaroundTime: '', description: '' });
    setShowModal(true);
  };

  const handleEditTestType = (test) => {
    setModalType('addTest');
    setSelectedItem(test);
    setFormData({
      name: test.name,
      category: test.category,
      price: test.price,
      turnaroundTime: test.turnaroundTime,
      description: test.description
    });
    setShowModal(true);
  };

  const handleDeleteTestType = (testId) => {
    if (window.confirm('Are you sure you want to delete this test type?')) {
      setTestTypes(testTypes.filter(t => t.id !== testId));
      toast.success('Test type deleted successfully');
    }
  };

  const handleSubmitTestType = (e) => {
    e.preventDefault();
    if (selectedItem) {
      setTestTypes(testTypes.map(t => t.id === selectedItem.id ? { ...t, ...formData } : t));
      toast.success('Test type updated successfully');
    } else {
      const newTest = { id: testTypes.length + 1, ...formData };
      setTestTypes([...testTypes, newTest]);
      toast.success('Test type added successfully');
    }
    setShowModal(false);
  };

  const handleAssignLab = (requestId, lab) => {
    setTestRequests(testRequests.map(r => 
      r.id === requestId ? { ...r, labAssigned: lab, status: 'in-progress' } : r
    ));
    toast.success(`Test assigned to ${lab}`);
  };

  
  const handleSubmitResult = (e) => {
    e.preventDefault();
    const newResult = {
      id: selectedItem.id,
      patientName: selectedItem.patientName,
      testName: selectedItem.testName,
      completedDate: new Date().toISOString().split('T')[0],
      resultFile: formData.resultFile ? formData.resultFile.name : 'result.pdf',
      uploadedBy: 'Current Admin',
      notes: formData.notes
    };
    setTestResults([...testResults, newResult]);
    setTestRequests(testRequests.map(r => 
      r.id === selectedItem.id ? { ...r, status: 'completed' } : r
    ));
    toast.success('Test result uploaded successfully');
    setShowModal(false);
  };

  const handleViewResult = (result) => {
    setModalType('viewResult');
    setSelectedItem(result);
    setShowModal(true);
  };

  const handleDownloadReport = (result) => {
    toast.success(`Downloading ${result.resultFile}...`);
  };

  // Filter functions
  const filteredRequests = testRequests.filter(request => {
    const matchesSearch = request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.testName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredTests = testTypes.filter(test =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResults = testResults.filter(result =>
    result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.testName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper functions
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      'in-progress': <Beaker className="w-3 h-3" />,
      completed: <CheckCircle className="w-3 h-3" />
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        {status.replace('-', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      routine: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Lab Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Analytics, lab tests, and report generation</p>
        </div>
      </div>

      {/* Overview Stats - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Lab Requests</p>
              <p className="text-3xl font-bold mt-2">{stats.totalRequests}</p>
              <p className="text-blue-100 text-xs mt-2">↑ 12% from last month</p>
            </div>
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Completed Tests</p>
              <p className="text-3xl font-bold mt-2">{stats.completed}</p>
              <p className="text-green-100 text-xs mt-2">{((stats.completed/stats.totalRequests)*100).toFixed(0)}% completion rate</p>
            </div>
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pending Tests</p>
              <p className="text-3xl font-bold mt-2">{stats.pending}</p>
              <p className="text-yellow-100 text-xs mt-2">{stats.urgentRequests} urgent</p>
            </div>
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Test Revenue</p>
              <p className="text-3xl font-bold mt-2">₹{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-purple-100 text-xs mt-2">This month</p>
            </div>
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Overview & Analytics
              </div>
            </button>
            <button
              onClick={() => setActiveTab('lab-requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'lab-requests'
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Lab Requests ({testRequests.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('test-types')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'test-types'
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <Beaker className="w-4 h-4" />
                Test Types ({testTypes.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'results'
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Test Results ({testResults.length})
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Test Categories</h3>
                    <Beaker className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-3">
                    {['Hematology', 'Biochemistry', 'Radiology', 'Pathology'].map((cat, idx) => (
                      <div key={cat} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{cat}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{testTypes.filter(t => t.category === cat).length}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Status Breakdown</h3>
                    <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">{stats.completed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{stats.inProgress}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                      <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">{stats.pending}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Urgent</span>
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400">{stats.urgentRequests}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance</h3>
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Avg Turnaround</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{stats.avgTurnaround}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Tests</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{stats.totalTestTypes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">98.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</span>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">₹{stats.totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Test Activity</h3>
                <div className="space-y-3">
                  {testRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <Beaker className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{request.testName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{request.patientName} • {request.requestDate}</p>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Lab Requests Tab */}
          {activeTab === 'lab-requests' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by patient, test, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Requests Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Request ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Test Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Lab</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{request.id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{request.patientName}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{request.patientId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">{request.testName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{request.doctorName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{request.requestDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPriorityBadge(request.priority)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {request.status === 'pending' ? (
                            <select
                              onChange={(e) => handleAssignLab(request.id, e.target.value)}
                              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                              defaultValue=""
                            >
                              <option value="" disabled>Assign Lab</option>
                              <option value="Lab A">Lab A</option>
                              <option value="Lab B">Lab B</option>
                              <option value="Radiology Lab">Radiology Lab</option>
                              <option value="Pathology Lab">Pathology Lab</option>
                            </select>
                          ) : (
                            <span className="text-sm text-gray-900 dark:text-white">{request.labAssigned}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            {request.status === 'in-progress' && (
                              <span className="text-sm text-gray-500 dark:text-gray-400 italic">Awaiting lab results</span>
                            )}
                            {request.status === 'completed' && (
                              <button
                                onClick={() => handleViewResult(testResults.find(r => r.id === request.id))}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                title="View Result"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Test Types Tab */}
          {activeTab === 'test-types' && (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search test types..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full max-w-md pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddTestType}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  <Plus className="w-5 h-5" />
                  Add Test Type
                </button>
              </div>

              {/* Test Types Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTests.map((test) => (
                  <div key={test.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Beaker className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTestType(test)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTestType(test.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{test.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{test.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Category:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{test.category}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Price:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">₹{test.price}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Turnaround:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{test.turnaroundTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Results Tab */}
          {activeTab === 'results' && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              {/* Results Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Request ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Test Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Completed Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Uploaded By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Notes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredResults.map((result) => (
                      <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{result.id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{result.patientName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">{result.testName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{result.completedDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{result.uploadedBy}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">{result.notes}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewResult(result)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="View Result"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDownloadReport(result)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Download Report"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Add/Edit Test Type Modal */}
            {modalType === 'addTest' && (
              <>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedItem ? 'Edit Test Type' : 'Add New Test Type'}
                  </h2>
                </div>
                <form onSubmit={handleSubmitTestType} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Test Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      placeholder="e.g., Complete Blood Count"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select Category</option>
                        <option value="Hematology">Hematology</option>
                        <option value="Biochemistry">Biochemistry</option>
                        <option value="Microbiology">Microbiology</option>
                        <option value="Pathology">Pathology</option>
                        <option value="Radiology">Radiology</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Endocrinology">Endocrinology</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Turnaround Time *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.turnaroundTime}
                      onChange={(e) => setFormData({ ...formData, turnaroundTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., 24 hours, 2 days"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      placeholder="Brief description of the test..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                      {selectedItem ? 'Update Test Type' : 'Add Test Type'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Upload Result Modal */}
            {modalType === 'uploadResult' && (
              <>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Test Result</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Patient: {selectedItem?.patientName} | Test: {selectedItem?.testName}
                  </p>
                </div>
                <form onSubmit={handleSubmitResult} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload Result File (PDF) *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setFormData({ ...formData, resultFile: e.target.files[0] })}
                        className="hidden"
                        id="file-upload"
                        required
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formData.resultFile ? formData.resultFile.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">PDF files only</p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      placeholder="Add any important notes about the test results..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors dark:bg-green-700 dark:hover:bg-green-600"
                    >
                      Upload Result
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* View Result Modal */}
            {modalType === 'viewResult' && selectedItem && (
              <>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Test Result Details</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Request ID</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">{selectedItem.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Patient Name</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">{selectedItem.patientName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Test Name</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">{selectedItem.testName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Completed Date</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">{selectedItem.completedDate}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Uploaded By</p>
                    <p className="text-gray-900 dark:text-white">{selectedItem.uploadedBy}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Result File</p>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="text-sm text-gray-900 dark:text-white flex-1">{selectedItem.resultFile}</span>
                      <button
                        onClick={() => handleDownloadReport(selectedItem)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>

                  {selectedItem.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</p>
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{selectedItem.notes}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => handleDownloadReport(selectedItem)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                      <Download className="w-5 h-5" />
                      Download Report
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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

export default Reports;