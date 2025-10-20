import React, { useState } from 'react';
import { Search, Plus, Download, Printer, Send, Pill, Calendar, User, X,  Clock, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';

const Prescriptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Enhanced prescriptions data with more comprehensive medical history
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'RX001',
      patientId: 'P001',
      patientName: 'John Smith',
      date: '2025-10-15',
      diagnosis: 'Hypertension Stage 1',
      medications: [
        { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the morning' },
        { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take with food' }
      ],
      notes: 'Monitor blood pressure daily. Follow up in 30 days.',
      avatar: 'JS',
      sentToPharmacy: false,
      pharmacyStatus: 'pending',
      doctor: 'Dr. Sarah Wilson',
      allergies: ['Penicillin', 'Sulfa'],
      conditions: ['Hypertension', 'High Cholesterol']
    },
    {
      id: 'RX002',
      patientId: 'P002',
      patientName: 'Sarah Johnson',
      date: '2025-10-18',
      diagnosis: 'Diabetes Type 2',
      medications: [
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '60 days', instructions: 'Take with meals' },
        { name: 'Glipizide', dosage: '5mg', frequency: 'Once daily', duration: '60 days', instructions: 'Take 30 min before breakfast' }
      ],
      notes: 'Follow diabetic diet plan. Regular blood sugar monitoring required.',
      avatar: 'SJ',
      sentToPharmacy: false,
      pharmacyStatus: 'pending',
      doctor: 'Dr. Michael Chen',
      allergies: ['None known'],
      conditions: ['Diabetes Type 2', 'Obesity']
    },
    {
      id: 'RX003',
      patientId: 'P003',
      patientName: 'Mike Wilson',
      date: '2025-10-17',
      diagnosis: 'Post-Surgery Recovery',
      medications: [
        { name: 'Ibuprofen', dosage: '400mg', frequency: 'Every 6 hours', duration: '7 days', instructions: 'Take as needed for pain' },
        { name: 'Acetaminophen', dosage: '500mg', frequency: 'Every 8 hours', duration: '7 days', instructions: 'Take with water' }
      ],
      notes: 'Complete the course. Report any unusual symptoms.',
      avatar: 'MW',
      sentToPharmacy: false,
      pharmacyStatus: 'pending',
      doctor: 'Dr. Emily Rodriguez',
      allergies: ['Codeine'],
      conditions: ['Post-operative Care']
    },
    // Previous prescriptions for medical history
    {
      id: 'RX000',
      patientId: 'P001',
      patientName: 'John Smith',
      date: '2025-08-20',
      diagnosis: 'Hypertension Initial Diagnosis',
      medications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the morning' }
      ],
      notes: 'Initial diagnosis. Start with low dose and monitor BP.',
      avatar: 'JS',
      sentToPharmacy: true,
      pharmacyStatus: 'dispensed',
      doctor: 'Dr. Sarah Wilson',
      allergies: ['Penicillin', 'Sulfa'],
      conditions: ['Hypertension']
    },
    {
      id: 'RX000',
      patientId: 'P002',
      patientName: 'Sarah Johnson',
      date: '2025-07-15',
      diagnosis: 'Diabetes Management',
      medications: [
        { name: 'Metformin', dosage: '500mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take with dinner' }
      ],
      notes: 'Initial diabetes management. Monitor HbA1c in 3 months.',
      avatar: 'SJ',
      sentToPharmacy: true,
      pharmacyStatus: 'dispensed',
      doctor: 'Dr. Michael Chen',
      allergies: ['None known'],
      conditions: ['Diabetes Type 2']
    }
  ]);

  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    notes: '',
    allergies: '',
    conditions: ''
  });

  const [printReportForm, setPrintReportForm] = useState({
    period: 'last_30_days',
    reportType: 'summary',
    includeDetails: true
  });

  // Get unique patients for history
  const patients = [...new Set(prescriptions.map(rx => rx.patientName))];

  // Stats data
  const stats = [
    { 
      label: "Total Prescriptions", 
      value: prescriptions.length, 
      icon: Pill, 
      gradient: 'from-blue-500 to-blue-600',
      change: '+3 this week'
    },
    { 
      label: "Sent to Pharmacy", 
      value: prescriptions.filter(rx => rx.sentToPharmacy).length, 
      icon: Send, 
      gradient: 'from-green-500 to-green-600',
      change: `${prescriptions.filter(rx => !rx.sentToPharmacy).length} pending`
    },
    { 
      label: "This Month", 
      value: prescriptions.filter(rx => new Date(rx.date).getMonth() === 9).length, 
      icon: Calendar, 
      gradient: 'from-purple-500 to-purple-600',
      change: 'October'
    },
    { 
      label: "Active Patients", 
      value: patients.length, 
      icon: User, 
      gradient: 'from-orange-500 to-orange-600',
      change: 'Under care'
    }
  ];

  // Get patient medical history (all prescriptions for a patient)
  const getPatientMedicalHistory = (patientName) => {
    return prescriptions.filter(rx => rx.patientName === patientName)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Get recent prescriptions (last 3 months) for the main view
  const getRecentPrescriptions = () => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    return prescriptions.filter(rx => new Date(rx.date) >= threeMonthsAgo)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const handleAddMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    }));
  };

  const handleRemoveMedication = (index) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newPrescription = {
      ...formData,
      id: `RX${String(prescriptions.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      avatar: formData.patientName.split(' ').map(n => n[0]).join(''),
      sentToPharmacy: false,
      pharmacyStatus: 'pending',
      doctor: 'Dr. Current User', // In real app, this would be the logged-in doctor
      allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : ['None reported'],
      conditions: formData.conditions ? formData.conditions.split(',').map(c => c.trim()) : []
    };
    
    setPrescriptions(prev => [newPrescription, ...prev]);
    toast.success('Prescription created successfully!');
    setShowModal(false);
    setFormData({
      patientId: '',
      patientName: '',
      diagnosis: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
      notes: '',
      allergies: '',
      conditions: ''
    });
  };

  const handleDownload = (rx) => {
    toast.success(`Downloading prescription ${rx.id} as PDF...`);
  };

  const handlePrint = (rx) => {
    toast.success(`Printing prescription ${rx.id}...`);
  };

  const handleSendToPharmacy = () => {
    const pendingPrescriptions = prescriptions.filter(rx => !rx.sentToPharmacy);
    
    if (pendingPrescriptions.length === 0) {
      toast.error('No pending prescriptions to send to pharmacy');
      return;
    }

    setPrescriptions(prev => prev.map(p => 
      !p.sentToPharmacy 
        ? { ...p, sentToPharmacy: true, pharmacyStatus: 'sent' }
        : p
    ));
    
    toast.success(`Sent ${pendingPrescriptions.length} prescription${pendingPrescriptions.length > 1 ? 's' : ''} to pharmacy!`);
  };

  const handleSendSingleToPharmacy = (rx) => {
    setPrescriptions(prev => prev.map(p => 
      p.id === rx.id 
        ? { ...p, sentToPharmacy: true, pharmacyStatus: 'sent' }
        : p
    ));
    toast.success(`Prescription ${rx.id} sent to pharmacy successfully!`);
  };

  // View patient medical history
  const handleViewPatientHistory = (patientName) => {
    setSelectedPatient(patientName);
    setShowHistoryModal(true);
  };

  const handlePrintReport = () => {
    setShowPrintModal(true);
  };

  const handleGeneratePrintReport = (e) => {
    e.preventDefault();
    toast.success(`Generating ${printReportForm.reportType} report for ${printReportForm.period}...`);
    setShowPrintModal(false);
  };

  const getPharmacyStatusBadge = (status) => {
    const badges = {
      'pending': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Not Sent' },
      'sent': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Sent' },
      'processing': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Processing' },
      'dispensed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Dispensed' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  // Calculate time since prescription
  const getTimeSince = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600 mt-1">Create and manage patient prescriptions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>New Prescription</span>
        </button>
      </div>

      {/* Colorful Stats Cards */}
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
            onClick={() => setShowModal(true)}
            className="flex items-center gap-4 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-500 transition-colors">
              <Plus className="w-6 h-6 text-blue-600 group-hover:text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Create Prescription</p>
              <p className="text-sm text-gray-500">Write new prescription</p>
            </div>
          </button>

          <button 
            onClick={handleSendToPharmacy}
            className="flex items-center gap-4 p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-500 transition-colors">
              <Send className="w-6 h-6 text-green-600 group-hover:text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Send to Pharmacy</p>
              <p className="text-sm text-gray-500">
                Send {prescriptions.filter(rx => !rx.sentToPharmacy).length} pending
              </p>
            </div>
          </button>

          <button 
            onClick={handlePrintReport}
            className="flex items-center gap-4 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
          >
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-500 transition-colors">
              <Printer className="w-6 h-6 text-purple-600 group-hover:text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Print Reports</p>
              <p className="text-sm text-gray-500">Monthly prescription report</p>
            </div>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by patient name, ID, or prescription number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Recent Prescriptions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Prescriptions</h2>
          <span className="text-sm text-gray-500">
            Last 3 months • {getRecentPrescriptions().length} prescriptions
          </span>
        </div>

        {getRecentPrescriptions().length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No recent prescriptions found</p>
            <p className="text-sm text-gray-500 mt-2">Try creating a new prescription or adjusting your search</p>
          </div>
        ) : (
          getRecentPrescriptions().map((rx) => (
            <div key={rx.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {rx.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{rx.patientName}</h3>
                    <p className="text-sm text-gray-600">
                      Patient ID: {rx.patientId} • Prescription: {rx.id}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {getTimeSince(rx.date)} • {rx.doctor}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{rx.date}</span>
                  {getPharmacyStatusBadge(rx.pharmacyStatus)}
                </div>
              </div>

              {/* Patient Medical Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1 font-medium">Diagnosis</p>
                  <p className="text-sm text-gray-900">{rx.diagnosis}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1 font-medium">Allergies</p>
                  <p className="text-sm text-gray-900">
                    {Array.isArray(rx.allergies) ? rx.allergies.join(', ') : 'None reported'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <p className="text-sm font-medium text-gray-700">Medications:</p>
                {rx.medications.map((med, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{med.name}</p>
                        <p className="text-sm text-gray-600">{med.dosage} • {med.frequency}</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {med.duration}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded">
                      📋 {med.instructions}
                    </p>
                  </div>
                ))}
              </div>

              {rx.notes && (
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <p className="text-xs text-gray-600 mb-1 font-medium">Additional Notes</p>
                  <p className="text-sm text-gray-900">{rx.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(rx)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => handlePrint(rx)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                {!rx.sentToPharmacy && (
                  <button
                    onClick={() => handleSendSingleToPharmacy(rx)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send to Pharmacy</span>
                  </button>
                )}
                <button
                  onClick={() => handleViewPatientHistory(rx.patientName)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Medical History</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE PRESCRIPTION MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">New Prescription</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({
                    patientId: '',
                    patientName: '',
                    diagnosis: '',
                    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
                    notes: '',
                    allergies: '',
                    conditions: ''
                  });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient ID *
                  </label>
                  <input
                    type="text"
                    value={formData.patientId}
                    onChange={(e) => handleInputChange('patientId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => handleInputChange('patientName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Medical Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Known Allergies
                  </label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Penicillin, Sulfa drugs"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple allergies with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Existing Conditions
                  </label>
                  <input
                    type="text"
                    value={formData.conditions}
                    onChange={(e) => handleInputChange('conditions', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Hypertension, Diabetes"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple conditions with commas</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis *
                </label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Hypertension, Diabetes Type 2"
                  required
                />
              </div>

              {/* Medications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Medications *
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Medication</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.medications.map((med, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Medication {index + 1}</h4>
                        {formData.medications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedication(index)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Medicine Name *
                          </label>
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Amlodipine"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Dosage *
                          </label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 5mg, 500mg"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Frequency *
                          </label>
                          <select
                            value={med.frequency}
                            onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="">Select frequency</option>
                            <option value="Once daily">Once daily</option>
                            <option value="Twice daily">Twice daily</option>
                            <option value="Three times daily">Three times daily</option>
                            <option value="Four times daily">Four times daily</option>
                            <option value="Every 4 hours">Every 4 hours</option>
                            <option value="Every 6 hours">Every 6 hours</option>
                            <option value="Every 8 hours">Every 8 hours</option>
                            <option value="As needed">As needed</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Duration *
                          </label>
                          <input
                            type="text"
                            value={med.duration}
                            onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 7 days, 30 days"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">
                            Instructions *
                          </label>
                          <input
                            type="text"
                            value={med.instructions}
                            onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Take with food, Take in the morning"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional instructions, precautions, or follow-up notes..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Prescription
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      patientId: '',
                      patientName: '',
                      diagnosis: '',
                      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
                      notes: '',
                      allergies: '',
                      conditions: ''
                    });
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PATIENT MEDICAL HISTORY MODAL */}
      {showHistoryModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Medical History - {selectedPatient}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Complete prescription and treatment history
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Patient Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Patient Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Total Prescriptions:</span>
                    <span className="ml-2 text-gray-900">
                      {getPatientMedicalHistory(selectedPatient).length}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">First Visit:</span>
                    <span className="ml-2 text-gray-900">
                      {getPatientMedicalHistory(selectedPatient).slice(-1)[0]?.date}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Latest Visit:</span>
                    <span className="ml-2 text-gray-900">
                      {getPatientMedicalHistory(selectedPatient)[0]?.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medical History Timeline */}
              <div className="space-y-6">
                <h3 className="font-semibold text-gray-900 mb-4">Prescription History</h3>
                {getPatientMedicalHistory(selectedPatient).map((rx, index) => (
                  <div key={rx.id} className="border-l-2 border-blue-200 pl-6 pb-6 relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full border-4 border-white"></div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">Prescription {rx.id}</h4>
                          <p className="text-sm text-gray-600">{rx.date}</p>
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <User className="w-3 h-3 mr-1" />
                            {rx.doctor}
                          </p>
                        </div>
                        <div className="text-right">
                          {getPharmacyStatusBadge(rx.pharmacyStatus)}
                          <p className="text-xs text-gray-500 mt-1">{getTimeSince(rx.date)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1 font-medium">Diagnosis</p>
                          <p className="text-sm text-gray-900">{rx.diagnosis}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1 font-medium">Allergies</p>
                          <p className="text-sm text-gray-900">
                            {Array.isArray(rx.allergies) ? rx.allergies.join(', ') : 'None reported'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <p className="text-sm font-medium text-gray-700">Medications Prescribed:</p>
                        {rx.medications.map((med, medIndex) => (
                          <div key={medIndex} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                            <span className="font-medium">{med.name}</span>
                            <span className="text-gray-600">{med.dosage} • {med.frequency}</span>
                          </div>
                        ))}
                      </div>

                      {rx.notes && (
                        <div className="bg-yellow-50 p-3 rounded">
                          <p className="text-xs text-gray-600 mb-1 font-medium">Clinical Notes</p>
                          <p className="text-sm text-gray-900">{rx.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close Medical History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Report Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Generate Report</h2>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleGeneratePrintReport} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Period
                </label>
                <select 
                  value={printReportForm.period}
                  onChange={(e) => setPrintReportForm(prev => ({...prev, period: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="last_7_days">Last 7 Days</option>
                  <option value="last_30_days">Last 30 Days</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select 
                  value={printReportForm.reportType}
                  onChange={(e) => setPrintReportForm(prev => ({...prev, reportType: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="summary">Summary Report</option>
                  <option value="detailed">Detailed Report</option>
                  <option value="pharmacy">Pharmacy Status Report</option>
                  <option value="patient">Patient Medical History</option>
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={printReportForm.includeDetails}
                    onChange={(e) => setPrintReportForm(prev => ({...prev, includeDetails: e.target.checked}))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include medication details</span>
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Generate & Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
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

export default Prescriptions;