import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Phone, 
  Mail, 
  FileText, 
  Plus, 
  ClipboardList,
  User,
  Calendar,
  Activity,
  Edit3,
  CheckCircle,
  X,
  Stethoscope,
  Pill
} from 'lucide-react';
import toast from 'react-hot-toast';

const MyPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showLabTestModal, setShowLabTestModal] = useState(false);
  const [showProgressNotesModal, setShowProgressNotesModal] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [patients, setPatients] = useState([
    { 
      id: 'P001', 
      name: 'John Smith', 
      age: 45, 
      gender: 'Male', 
      bloodGroup: 'A+', 
      phone: '+91 98765 43210', 
      email: 'john@email.com', 
      diagnosis: 'Hypertension', 
      condition: 'Stable', 
      lastVisit: '2025-10-15', 
      totalVisits: 12, 
      status: 'active', 
      avatar: 'JS',
      room: 'Room 101',
      admissionDate: '2025-10-10',
      address: '123 MG Road, Bangalore',
      insurance: 'Star Health Insurance',
      emergencyContact: '+91 98765 43211',
      allergies: 'None',
      currentMedication: 'Amlodipine 5mg daily',
      medicalHistory: ['Hypertension (2018)', 'High Cholesterol (2020)'],
      labReports: [
        { id: 'LAB001', name: 'Blood Pressure', date: '2025-10-15', result: '150/95', status: 'completed' },
        { id: 'LAB002', name: 'Lipid Profile', date: '2025-10-14', result: 'Cholesterol: 220', status: 'completed' }
      ],
      prescriptions: [
        { id: 'RX001', date: '2025-10-15', medication: 'Amlodipine 5mg', dosage: 'Once daily', duration: '30 days', status: 'active' },
        { id: 'RX002', date: '2025-10-10', medication: 'Atorvastatin 20mg', dosage: 'Once daily at bedtime', duration: '30 days', status: 'completed' }
      ],
      progressNotes: [
        { date: '2025-10-15', note: 'BP stabilized, patient responding well to medication', doctor: 'Dr. Smith' },
        { date: '2025-10-14', note: 'Mild headache reported, advised to monitor BP', doctor: 'Dr. Smith' }
      ]
    },
    { 
      id: 'P002', 
      name: 'Sarah Johnson', 
      age: 32, 
      gender: 'Female', 
      bloodGroup: 'O+', 
      phone: '+91 87654 32109', 
      email: 'sarah@email.com', 
      diagnosis: 'Diabetes Type 2', 
      condition: 'Under Observation', 
      lastVisit: '2025-10-18', 
      totalVisits: 8, 
      status: 'active', 
      avatar: 'SJ',
      room: 'Room 102',
      admissionDate: '2025-10-12',
      address: '456 Koramangala, Bangalore',
      insurance: 'Apollo Munich',
      emergencyContact: '+91 87654 32110',
      allergies: 'Penicillin',
      currentMedication: 'Metformin 500mg twice daily',
      medicalHistory: ['Diabetes Type 2 (2021)', 'Thyroid (2019)'],
      labReports: [
        { id: 'LAB003', name: 'HbA1c Test', date: '2025-10-18', result: '7.2%', status: 'completed' },
        { id: 'LAB004', name: 'Blood Glucose', date: '2025-10-17', result: 'Fasting: 130 mg/dL', status: 'completed' }
      ],
      prescriptions: [
        { id: 'RX002', date: '2025-10-18', medication: 'Metformin 500mg', dosage: 'Twice daily', duration: '30 days', status: 'active' }
      ],
      progressNotes: [
        { date: '2025-10-18', note: 'Blood sugar levels improving with new diet plan', doctor: 'Dr. Smith' }
      ]
    },
    { 
      id: 'P003', 
      name: 'Mike Wilson', 
      age: 58, 
      gender: 'Male', 
      bloodGroup: 'B+', 
      phone: '+91 76543 21098', 
      email: 'mike@email.com', 
      diagnosis: 'Post-Surgery Recovery', 
      condition: 'Improving', 
      lastVisit: '2025-10-17', 
      totalVisits: 15, 
      status: 'active', 
      avatar: 'MW',
      room: 'Room 103',
      admissionDate: '2025-10-05',
      address: '789 Indiranagar, Bangalore',
      insurance: 'Max Bupa',
      emergencyContact: '+91 76543 21099',
      allergies: 'Dust, Pollen',
      currentMedication: 'Pain management medication',
      medicalHistory: ['Appendectomy (2025)', 'Hypertension (2015)'],
      labReports: [
        { id: 'LAB005', name: 'CBC', date: '2025-10-16', result: 'Normal', status: 'completed' },
        { id: 'LAB006', name: 'Wound Culture', date: '2025-10-15', result: 'No infection', status: 'completed' }
      ],
      prescriptions: [
        { id: 'RX003', date: '2025-10-17', medication: 'Ibuprofen 400mg', dosage: 'As needed for pain', duration: '7 days', status: 'active' }
      ],
      progressNotes: [
        { date: '2025-10-17', note: 'Incision healing well, minimal pain reported', doctor: 'Dr. Smith' },
        { date: '2025-10-16', note: 'Patient able to walk short distances', doctor: 'Dr. Smith' }
      ]
    }
  ]);

  // Form states
  const [labTestForm, setLabTestForm] = useState({
    testType: '',
    specificTest: '',
    priority: 'normal',
    notes: ''
  });

  const [progressNote, setProgressNote] = useState('');
  const [dischargeReason, setDischargeReason] = useState('');
  const [prescriptionForm, setPrescriptionForm] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  // Colorful Stats Cards
  const stats = [
    { 
      label: 'Total Patients', 
      value: patients.length, 
      icon: User, 
      gradient: 'from-blue-500 to-blue-600',
      change: '+2 this month'
    },
    { 
      label: 'Active Patients', 
      value: patients.filter(p => p.status === 'active').length, 
      icon: Activity, 
      gradient: 'from-green-500 to-green-600',
      change: 'All stable'
    },
    { 
      label: 'This Month', 
      value: patients.filter(p => new Date(p.lastVisit).getMonth() === 9).length, 
      icon: Calendar, 
      gradient: 'from-purple-500 to-purple-600',
      change: '5 visits'
    },
    { 
      label: 'Total Visits', 
      value: patients.reduce((sum, p) => sum + p.totalVisits, 0), 
      icon: FileText, 
      gradient: 'from-orange-500 to-orange-600',
      change: 'This year'
    }
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getConditionColor = (condition) => {
    const colors = {
      'Stable': 'bg-green-100 text-green-800',
      'Improving': 'bg-blue-100 text-blue-800',
      'Under Observation': 'bg-yellow-100 text-yellow-800',
      'Managed': 'bg-purple-100 text-purple-800'
    };
    return colors[condition] || 'bg-gray-100 text-gray-800';
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
    setActiveTab('overview');
  };

  const handleRequestLabTest = (patient) => {
    setSelectedPatient(patient);
    setLabTestForm({
      testType: '',
      specificTest: '',
      priority: 'normal',
      notes: ''
    });
    setShowLabTestModal(true);
  };

  const handleAddProgressNote = (patient) => {
    setSelectedPatient(patient);
    setProgressNote('');
    setShowProgressNotesModal(true);
  };

  const handleRecommendDischarge = (patient) => {
    setSelectedPatient(patient);
    setDischargeReason('');
    setShowDischargeModal(true);
  };

  const handleAddPrescription = (patient) => {
    setSelectedPatient(patient);
    setPrescriptionForm({
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    });
    setShowPrescriptionModal(true);
  };

  const handleUpdateDiagnosis = (patientId, newDiagnosis) => {
    setPatients(prev => prev.map(p => 
      p.id === patientId ? { ...p, diagnosis: newDiagnosis } : p
    ));
    toast.success('Diagnosis updated successfully!');
  };

  const handleSubmitLabTest = (e) => {
    e.preventDefault();
    toast.success(`Lab test requested for ${selectedPatient.name}`);
    setShowLabTestModal(false);
  };

  const handleSubmitProgressNote = (e) => {
    e.preventDefault();
    if (!progressNote.trim()) {
      toast.error('Please enter a progress note');
      return;
    }

    const newNote = {
      date: new Date().toISOString().split('T')[0],
      note: progressNote,
      doctor: 'Dr. Smith'
    };

    setPatients(prev => prev.map(p => 
      p.id === selectedPatient.id 
        ? { 
            ...p, 
            progressNotes: [newNote, ...p.progressNotes],
            lastVisit: new Date().toISOString().split('T')[0]
          } 
        : p
    ));

    toast.success('Progress note added successfully!');
    setShowProgressNotesModal(false);
    setProgressNote('');
  };

  const handleSubmitDischarge = (e) => {
    e.preventDefault();
    if (!dischargeReason.trim()) {
      toast.error('Please provide discharge reason');
      return;
    }

    toast.success('Discharge recommendation sent for admin approval');
    setShowDischargeModal(false);
    setDischargeReason('');
  };

  const handleSubmitPrescription = (e) => {
    e.preventDefault();
    if (!prescriptionForm.medication.trim() || !prescriptionForm.dosage.trim()) {
      toast.error('Please fill in medication and dosage');
      return;
    }

    const newPrescription = {
      id: `RX${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      medication: prescriptionForm.medication,
      dosage: prescriptionForm.dosage,
      frequency: prescriptionForm.frequency,
      duration: prescriptionForm.duration,
      instructions: prescriptionForm.instructions,
      status: 'active'
    };

    setPatients(prev => prev.map(p => 
      p.id === selectedPatient.id 
        ? { 
            ...p, 
            prescriptions: [newPrescription, ...p.prescriptions],
            currentMedication: prescriptionForm.medication + ' ' + prescriptionForm.dosage,
            lastVisit: new Date().toISOString().split('T')[0]
          } 
        : p
    ));

    toast.success('Prescription added successfully!');
    setShowPrescriptionModal(false);
    setPrescriptionForm({
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    });
  };

  const handleCall = (phone, name) => {
    toast.success(`Calling ${name} at ${phone}`);
  };

  const handleEmail = (email, name) => {
    toast.success(`Sending email to ${name}`);
  };

  // Quick Actions Component
  const QuickActions = ({ patient }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
      <div className="space-y-3">
        <button
          onClick={() => handleRequestLabTest(patient)}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <ClipboardList className="w-4 h-4" />
          <span>Request Lab Test</span>
        </button>
        <button
          onClick={() => handleAddPrescription(patient)}
          className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Pill className="w-4 h-4" />
          <span>Add Prescription</span>
        </button>
        <button
          onClick={() => handleAddProgressNote(patient)}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Progress Note</span>
        </button>
        <button
          onClick={() => handleRecommendDischarge(patient)}
          className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Recommend Discharge</span>
        </button>
      </div>
    </div>
  );

  // Prescriptions Tab Component
  const PrescriptionsTab = ({ patient }) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-900">Prescriptions</h4>
        <button
          onClick={() => handleAddPrescription(patient)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Prescription</span>
        </button>
      </div>
      
      <div className="grid gap-4">
        {patient.prescriptions.map((prescription) => (
          <div key={prescription.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h5 className="font-semibold text-lg text-gray-900">{prescription.medication}</h5>
                <p className="text-sm text-gray-600">{prescription.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                prescription.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {prescription.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Dosage</p>
                <p className="font-medium">{prescription.dosage}</p>
              </div>
              <div>
                <p className="text-gray-600">Frequency</p>
                <p className="font-medium">{prescription.frequency}</p>
              </div>
              <div>
                <p className="text-gray-600">Duration</p>
                <p className="font-medium">{prescription.duration}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-medium capitalize">{prescription.status}</p>
              </div>
            </div>
            
            {prescription.instructions && (
              <div className="mt-4">
                <p className="text-gray-600 text-sm mb-1">Instructions</p>
                <p className="text-sm">{prescription.instructions}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render Tab Content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Patient Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Patient ID</p>
                    <p className="font-medium">{selectedPatient.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Room</p>
                    <p className="font-medium">{selectedPatient.room}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age & Gender</p>
                    <p className="font-medium">{selectedPatient.age}y / {selectedPatient.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Blood Group</p>
                    <p className="font-medium">{selectedPatient.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Admission Date</p>
                    <p className="font-medium">{selectedPatient.admissionDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Insurance</p>
                    <p className="font-medium">{selectedPatient.insurance}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Current Status</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Diagnosis</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="font-medium">{selectedPatient.diagnosis}</p>
                      <button 
                        onClick={() => {
                          const newDiagnosis = prompt('Enter new diagnosis:', selectedPatient.diagnosis);
                          if (newDiagnosis) {
                            handleUpdateDiagnosis(selectedPatient.id, newDiagnosis);
                            setSelectedPatient({...selectedPatient, diagnosis: newDiagnosis});
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Medication</p>
                    <p className="font-medium">{selectedPatient.currentMedication}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Allergies</p>
                    <p className="font-medium">{selectedPatient.allergies}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <QuickActions patient={selectedPatient} />
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Phone:</strong> {selectedPatient.phone}</p>
                  <p className="text-sm"><strong>Email:</strong> {selectedPatient.email}</p>
                  <p className="text-sm"><strong>Emergency:</strong> {selectedPatient.emergencyContact}</p>
                  <p className="text-sm"><strong>Address:</strong> {selectedPatient.address}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'medical':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Medical History</h4>
            <div className="space-y-3">
              {selectedPatient.medicalHistory.map((history, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Stethoscope className="w-4 h-4 text-gray-400" />
                  <span>{history}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'lab':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Lab Reports</h4>
            <div className="space-y-3">
              {selectedPatient.labReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-gray-600">{report.date} • {report.result}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'prescriptions':
        return <PrescriptionsTab patient={selectedPatient} />;

      case 'progress':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Progress Notes</h4>
            <div className="space-y-4">
              {selectedPatient.progressNotes.map((note, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="text-sm text-gray-600">{note.date} • {note.doctor}</p>
                  <p className="mt-1">{note.note}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
        <p className="text-gray-600 mt-1">View and manage your patient records</p>
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by patient name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <option value="all">All Patients</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                  {patient.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-600">{patient.id} • {patient.room}</p>
                </div>
              </div>
              {patient.status === 'active' && (
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Age / Gender</span>
                <span className="font-medium text-gray-900">{patient.age}y / {patient.gender}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Blood Group</span>
                <span className="font-medium text-gray-900">{patient.bloodGroup}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Room</span>
                <span className="font-medium text-gray-900">{patient.room}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Visits</span>
                <span className="font-medium text-gray-900">{patient.totalVisits}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Current Diagnosis</p>
                <p className="text-sm font-medium text-gray-900">{patient.diagnosis}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConditionColor(patient.condition)}`}>
                {patient.condition}
              </span>
              <span className="text-xs text-gray-500">Last: {patient.lastVisit}</span>
            </div>

            <div className="flex space-x-2">
              <button 
                onClick={() => handleViewPatient(patient)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button 
                onClick={() => handleCall(patient.phone, patient.name)}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleEmail(patient.email, patient.name)}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Profile Modal */}
      {selectedPatient && showPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Patient Profile - {selectedPatient.name}</h3>
              <button
                onClick={() => setShowPatientModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="px-6 flex space-x-8">
                {['overview', 'medical', 'lab', 'prescriptions', 'progress'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'medical' ? 'Medical History' : 
                     tab === 'lab' ? 'Lab Reports' : tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      )}

      {/* Lab Test Modal */}
      {showLabTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Request Lab Test</h3>
              <button
                onClick={() => setShowLabTestModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitLabTest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient
                </label>
                <p className="font-medium">{selectedPatient?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Type
                </label>
                <select 
                  name="testType"
                  value={labTestForm.testType}
                  onChange={(e) => setLabTestForm(prev => ({...prev, testType: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Test Type</option>
                  <option value="blood">Blood Test</option>
                  <option value="urine">Urine Analysis</option>
                  <option value="imaging">Imaging</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specific Test
                </label>
                <input 
                  type="text" 
                  name="specificTest"
                  value={labTestForm.specificTest}
                  onChange={(e) => setLabTestForm(prev => ({...prev, specificTest: e.target.value}))}
                  placeholder="e.g., Complete Blood Count, Lipid Profile..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select 
                  name="priority"
                  value={labTestForm.priority}
                  onChange={(e) => setLabTestForm(prev => ({...prev, priority: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="stat">STAT</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea 
                  name="notes"
                  value={labTestForm.notes}
                  onChange={(e) => setLabTestForm(prev => ({...prev, notes: e.target.value}))}
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
                  onClick={() => setShowLabTestModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Progress Notes Modal */}
      {showProgressNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Add Progress Note</h3>
              <button
                onClick={() => setShowProgressNotesModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitProgressNote} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient
                </label>
                <p className="font-medium">{selectedPatient?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progress Note
                </label>
                <textarea 
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                  placeholder="Enter your observations and progress notes..."
                  className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Save Note
                </button>
                <button
                  type="button"
                  onClick={() => setShowProgressNotesModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discharge Recommendation Modal */}
      {showDischargeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Recommend Discharge</h3>
              <button
                onClick={() => setShowDischargeModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitDischarge} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient
                </label>
                <p className="font-medium">{selectedPatient?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discharge Reason
                </label>
                <textarea 
                  value={dischargeReason}
                  onChange={(e) => setDischargeReason(e.target.value)}
                  placeholder="Provide detailed reason for discharge recommendation..."
                  className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> This discharge recommendation will be sent to administration for approval.
                  Patient cannot be discharged until approved.
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Recommend Discharge
                </button>
                <button
                  type="button"
                  onClick={() => setShowDischargeModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Add Prescription</h3>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitPrescription} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient
                </label>
                <p className="font-medium">{selectedPatient?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medication *
                </label>
                <input 
                  type="text" 
                  value={prescriptionForm.medication}
                  onChange={(e) => setPrescriptionForm(prev => ({...prev, medication: e.target.value}))}
                  placeholder="e.g., Amlodipine 5mg"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage *
                </label>
                <input 
                  type="text" 
                  value={prescriptionForm.dosage}
                  onChange={(e) => setPrescriptionForm(prev => ({...prev, dosage: e.target.value}))}
                  placeholder="e.g., 5mg"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select 
                  value={prescriptionForm.frequency}
                  onChange={(e) => setPrescriptionForm(prev => ({...prev, frequency: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Frequency</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Four times daily">Four times daily</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input 
                  type="text" 
                  value={prescriptionForm.duration}
                  onChange={(e) => setPrescriptionForm(prev => ({...prev, duration: e.target.value}))}
                  placeholder="e.g., 30 days"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea 
                  value={prescriptionForm.instructions}
                  onChange={(e) => setPrescriptionForm(prev => ({...prev, instructions: e.target.value}))}
                  placeholder="Additional instructions for the patient..."
                  className="w-full h-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Add Prescription
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrescriptionModal(false)}
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

export default MyPatients;