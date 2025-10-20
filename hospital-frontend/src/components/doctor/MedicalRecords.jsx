import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Plus, 
  MessageSquare,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ClipboardList,
  X,
  BarChart3,
  PieChart
} from 'lucide-react';
import toast from 'react-hot-toast';

const MedicalReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [comment, setComment] = useState('');

  const [reports, setReports] = useState([
    {
      id: 'LAB001',
      patientId: 'P001',
      patient: 'Rajesh Kumar',
      testName: 'Complete Blood Count',
      testType: 'blood',
      date: '2025-10-18',
      status: 'completed',
      priority: 'normal',
      result: 'Normal',
      notes: 'All parameters within normal range',
      fileUrl: '/reports/cbc_001.pdf',
      lab: 'City Medical Lab',
      orderedBy: 'Dr. Smith',
      avatar: 'RK',
      doctorNotes: '',
      reviewed: false
    },
    {
      id: 'LAB002',
      patientId: 'P002',
      patient: 'Priya Sharma',
      testName: 'Thyroid Panel',
      testType: 'blood',
      date: '2025-10-19',
      status: 'completed',
      priority: 'normal',
      result: 'Abnormal',
      notes: 'Elevated TSH levels detected',
      fileUrl: '/reports/thyroid_002.pdf',
      lab: 'Metro Diagnostics',
      orderedBy: 'Dr. Smith',
      avatar: 'PS',
      doctorNotes: 'Patient needs thyroid medication adjustment',
      reviewed: true
    },
    {
      id: 'LAB003',
      patientId: 'P003',
      patient: 'Amit Patel',
      testName: 'Lipid Profile',
      testType: 'blood',
      date: '2025-10-20',
      status: 'pending',
      priority: 'urgent',
      result: 'Pending',
      notes: 'Fasting required',
      fileUrl: null,
      lab: 'City Medical Lab',
      orderedBy: 'Dr. Smith',
      avatar: 'AP',
      doctorNotes: '',
      reviewed: false
    }
  ]);

  // Form state for new test request
  const [testRequestForm, setTestRequestForm] = useState({
    patient: '',
    testType: '',
    specificTest: '',
    notes: ''
  });

  const patients = [...new Set(reports.map(report => report.patient))];

  // Analytics Data
  const analyticsData = {
    totalTests: reports.length,
    completedTests: reports.filter(r => r.status === 'completed').length,
    pendingTests: reports.filter(r => r.status === 'pending').length,
    abnormalResults: reports.filter(r => r.result === 'Abnormal' || r.result === 'Critical').length,
    
    testTypes: {
      blood: reports.filter(r => r.testType === 'blood').length,
      urine: reports.filter(r => r.testType === 'urine').length,
    },
    
    monthlyTrend: [
      { month: 'Aug', tests: 45, abnormal: 8 },
      { month: 'Sep', tests: 52, abnormal: 12 },
      { month: 'Oct', tests: 38, abnormal: 6 },
    ],
    
    topTests: [
      { name: 'Complete Blood Count', count: 23 },
      { name: 'Lipid Profile', count: 18 },
      { name: 'Thyroid Panel', count: 15 },
    ]
  };

  // Stats Cards
  const stats = [
    { 
      label: "Total Reports", 
      value: reports.length, 
      icon: FileText, 
      gradient: 'from-blue-500 to-blue-600',
      change: '+3 this week'
    },
    { 
      label: "Pending Results", 
      value: reports.filter(r => r.status === 'pending').length, 
      icon: Clock, 
      gradient: 'from-orange-500 to-orange-600',
      change: '2 urgent'
    },
    { 
      label: "Abnormal Findings", 
      value: reports.filter(r => r.result === 'Abnormal' || r.result === 'Critical').length, 
      icon: AlertCircle, 
      gradient: 'from-red-500 to-red-600',
      change: 'Requires review'
    },
    { 
      label: "Completed Today", 
      value: reports.filter(r => r.date === '2025-10-20' && r.status === 'completed').length, 
      icon: CheckCircle, 
      gradient: 'from-green-500 to-green-600',
      change: 'All processed'
    }
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.testName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesDate = !selectedDate || report.date === selectedDate;
    const matchesPatient = selectedPatient === 'all' || report.patient === selectedPatient;
    return matchesSearch && matchesStatus && matchesDate && matchesPatient;
  });

  const getStatusBadge = (status) => {
    const badges = {
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed', icon: CheckCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending', icon: Clock }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text} flex items-center space-x-1`}>
        <Icon className="w-3 h-3" />
        <span>{badge.label}</span>
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      normal: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Normal' },
      high: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'High' },
      urgent: { bg: 'bg-red-100', text: 'text-red-800', label: 'Urgent' }
    };
    const badge = badges[priority] || badges.normal;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getResultBadge = (result) => {
    const badges = {
      Normal: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      Abnormal: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle },
      Critical: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle },
      Pending: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock }
    };
    const badge = badges[result] || badges.Pending;
    const Icon = badge.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text} flex items-center space-x-1`}>
        <Icon className="w-3 h-3" />
        <span>{result}</span>
      </span>
    );
  };

  // Fixed functionality
  const handleViewAnalytics = () => {
    setShowAnalyticsModal(true);
    toast.success('Opening analytics dashboard...');
  };

  const handleGenerateReport = () => {
    setShowGenerateReportModal(true);
    toast.success('Preparing report generator...');
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setComment(report.doctorNotes || '');
  };

  const handleDownload = () => {
    toast.success('Report downloaded successfully!');
  };

  // FIXED: Doctor's notes are now properly saved
  const handleAddComment = () => {
    if (!comment.trim()) {
      toast.error('Please enter a note before saving.');
      return;
    }
    
    setReports(prevReports => 
      prevReports.map(report => 
        report.id === selectedReport.id 
          ? { 
              ...report, 
              doctorNotes: comment, 
              reviewed: true, 
              reviewedAt: new Date().toISOString().split('T')[0] 
            }
          : report
      )
    );
    
    toast.success('Doctor\'s note added successfully!');
    setSelectedReport(null);
    setComment('');
  };

  // FIXED: Handle form input changes for test request
  const handleTestRequestInputChange = (e) => {
    const { name, value } = e.target;
    setTestRequestForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // FIXED: Now properly adds new test request to the list
  const handleRequestTest = (e) => {
    e.preventDefault();
    
    if (!testRequestForm.patient || !testRequestForm.specificTest) {
      toast.error('Please select a patient and enter test name');
      return;
    }

    // Generate new test ID
    const newTestId = `LAB${String(reports.length + 1).padStart(3, '0')}`;
    
    // Create new test report
    const newTestReport = {
      id: newTestId,
      patientId: `P${String(reports.length + 1).padStart(3, '0')}`,
      patient: testRequestForm.patient,
      testName: testRequestForm.specificTest,
      testType: testRequestForm.testType.toLowerCase() || 'blood',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      priority: 'normal',
      result: 'Pending',
      notes: testRequestForm.notes || 'Test requested, awaiting sample collection',
      fileUrl: null,
      lab: 'Pending Assignment',
      orderedBy: 'Dr. Smith',
      avatar: testRequestForm.patient.split(' ').map(n => n[0]).join(''),
      doctorNotes: '',
      reviewed: false
    };

    // Add new test to reports
    setReports(prevReports => [newTestReport, ...prevReports]);
    
    // Reset form
    setTestRequestForm({
      patient: '',
      testType: '',
      specificTest: '',
      notes: ''
    });
    
    toast.success(`New test request for ${testRequestForm.patient} submitted successfully!`);
    setShowRequestModal(false);
  };

  const handleExportAnalytics = () => {
    toast.success('Analytics data exported successfully!');
    setShowAnalyticsModal(false);
  };

  const handleGenerateSummaryReport = () => {
    toast.success('Summary report generated and downloaded!');
    setShowGenerateReportModal(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Reports</h1>
          <p className="text-gray-600 mt-1">View and manage laboratory test results</p>
        </div>
        <button
          onClick={() => {
            setTestRequestForm({
              patient: '',
              testType: '',
              specificTest: '',
              notes: ''
            });
            setShowRequestModal(true);
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Request Test</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-200`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-xs font-semibold px-2 py-1 rounded-full bg-white bg-opacity-20">
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-white text-opacity-90 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-4xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => {
              setTestRequestForm({
                patient: '',
                testType: '',
                specificTest: '',
                notes: ''
              });
              setShowRequestModal(true);
            }}
            className="flex items-center gap-4 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-500 transition-colors">
              <Plus className="w-6 h-6 text-blue-600 group-hover:text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Request New Test</p>
              <p className="text-sm text-gray-500">Order lab tests for patient</p>
            </div>
          </button>

          <button 
            onClick={handleViewAnalytics}
            className="flex items-center gap-4 p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-500 transition-colors">
              <TrendingUp className="w-6 h-6 text-green-600 group-hover:text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-500">Test results trends</p>
            </div>
          </button>

          <button 
            onClick={handleGenerateReport}
            className="flex items-center gap-4 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
          >
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-500 transition-colors">
              <ClipboardList className="w-6 h-6 text-purple-600 group-hover:text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Generate Report</p>
              <p className="text-sm text-gray-500">Create summary report</p>
            </div>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by patient, test name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Patients</option>
              {patients.map(patient => (
                <option key={patient} value={patient}>{patient}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reports found</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold flex-shrink-0">
                    {report.avatar}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{report.patient}</h3>
                        <p className="text-sm text-gray-600">
                          Patient ID: {report.patientId} • {report.testName}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(report.status)}
                        {getPriorityBadge(report.priority)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{report.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700 capitalize">{report.testType}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700">{report.lab}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Report: {report.id}</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700">Test Results</p>
                        {getResultBadge(report.result)}
                      </div>
                      <p className="text-sm text-gray-900">{report.notes}</p>
                    </div>

                    {report.doctorNotes && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-xs text-green-700 mb-1 font-medium">Doctor's Notes</p>
                        <p className="text-sm text-green-800">{report.doctorNotes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => handleViewReport(report)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  {report.fileUrl && (
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleViewReport(report)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Add Note</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Lab Report Details</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Patient</p>
                  <p className="font-semibold text-gray-900">{selectedReport.patient}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Test Name</p>
                  <p className="font-semibold text-gray-900">{selectedReport.testName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold text-gray-900">{selectedReport.date}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Test Results</h4>
                  <div className={`p-4 rounded-lg ${
                    selectedReport.result === 'Normal' ? 'bg-green-50 border border-green-200' :
                    selectedReport.result === 'Critical' ? 'bg-red-50 border border-red-200' :
                    'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-lg">{selectedReport.result}</p>
                      {getResultBadge(selectedReport.result)}
                    </div>
                    <p className="text-gray-700">{selectedReport.notes}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Doctor's Notes</h4>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add your diagnosis notes or comments about this lab report..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Notes
              </button>
              {selectedReport.fileUrl && (
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Lab Reports Analytics</h3>
              <button
                onClick={() => setShowAnalyticsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Tests</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.totalTests}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.completedTests}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.pendingTests}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Abnormal</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.abnormalResults}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                    Test Types
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(analyticsData.testTypes).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">{type}</span>
                        <span className="font-semibold text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    Monthly Trend
                  </h4>
                  <div className="space-y-2">
                    {analyticsData.monthlyTrend.map((month, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{month.month}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-600">{month.tests} tests</span>
                          <span className="text-red-600">{month.abnormal} abnormal</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAnalyticsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleExportAnalytics}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Generate Summary Report</h3>
              <button
                onClick={() => setShowGenerateReportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Period
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Month</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Type
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Summary Report</option>
                  <option>Detailed Analysis</option>
                  <option>Abnormal Findings</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleGenerateSummaryReport}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Report</span>
                </button>
                <button
                  onClick={() => setShowGenerateReportModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FIXED: Request Test Modal - Now properly adds new tests */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Request New Lab Test</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleRequestTest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Patient
                </label>
                <select 
                  name="patient"
                  value={testRequestForm.patient}
                  onChange={handleTestRequestInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient} value={patient}>{patient}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Type
                </label>
                <select 
                  name="testType"
                  value={testRequestForm.testType}
                  onChange={handleTestRequestInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Test Type</option>
                  <option value="Blood">Blood Test</option>
                  <option value="Urine">Urine Analysis</option>
                  <option value="Imaging">Imaging</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specific Test
                </label>
                <input 
                  type="text" 
                  name="specificTest"
                  value={testRequestForm.specificTest}
                  onChange={handleTestRequestInputChange}
                  placeholder="e.g., Complete Blood Count, Lipid Profile..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea 
                  name="notes"
                  value={testRequestForm.notes}
                  onChange={handleTestRequestInputChange}
                  placeholder="Additional instructions for the lab..."
                  className="w-full h-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Request Test
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalReports;