import React, { useState } from 'react';
import { 
  Search, Edit2, Trash2, Eye, UserPlus, X,
   User, Phone, Mail, MapPin, Activity, 
  Stethoscope, Bed, CheckCircle, AlertCircle,
  FileText, Download
} from 'lucide-react';

const PatientManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [patients, setPatients] = useState([
    { 
      id: 'P001', 
      firstName: 'John', 
      lastName: 'Doe', 
      email: 'john.doe@email.com',
      phone: '+91 9876543210',
      dateOfBirth: '1985-06-15',
      gender: 'male',
      bloodGroup: 'O+',
      address: '123 Main St, Mumbai, Maharashtra',
      emergencyContact: '+91 9876543211',
      emergencyContactName: 'Jane Doe',
      status: 'admitted',
      admissionDate: '2024-10-10',
      roomNumber: 'ICU-101',
      assignedDoctor: 'Dr. Sarah Smith',
      condition: 'Stable',
      diagnosis: 'Pneumonia',
      documents: ['chest_xray.pdf', 'blood_test.pdf']
    },
    { 
      id: 'P002', 
      firstName: 'Jane', 
      lastName: 'Smith', 
      email: 'jane.smith@email.com',
      phone: '+91 9876543220',
      dateOfBirth: '1990-03-22',
      gender: 'female',
      bloodGroup: 'A+',
      address: '456 Oak Ave, Delhi',
      emergencyContact: '+91 9876543221',
      emergencyContactName: 'Mike Smith',
      status: 'outpatient',
      lastVisit: '2024-10-12',
      assignedDoctor: 'Dr. Mike Johnson',
      documents: ['prescription.pdf']
    },
    { 
      id: 'P003', 
      firstName: 'Bob', 
      lastName: 'Wilson', 
      email: 'bob.wilson@email.com',
      phone: '+91 9876543230',
      dateOfBirth: '1978-11-08',
      gender: 'male',
      bloodGroup: 'B+',
      address: '789 Pine Rd, Bangalore',
      emergencyContact: '+91 9876543231',
      emergencyContactName: 'Alice Wilson',
      status: 'discharged',
      admissionDate: '2024-09-20',
      dischargeDate: '2024-10-05',
      roomNumber: 'Ward-205',
      assignedDoctor: 'Dr. Sarah Smith',
      condition: 'Recovered',
      diagnosis: 'Appendicitis',
      documents: ['surgery_report.pdf', 'discharge_summary.pdf']
    },
    { 
      id: 'P004', 
      firstName: 'Alice', 
      lastName: 'Brown', 
      email: 'alice.brown@email.com',
      phone: '+91 9876543240',
      dateOfBirth: '1995-07-30',
      gender: 'female',
      bloodGroup: 'AB+',
      address: '321 Elm St, Pune',
      emergencyContact: '+91 9876543241',
      emergencyContactName: 'Charlie Brown',
      status: 'admitted',
      admissionDate: '2024-10-13',
      roomNumber: 'Private-301',
      assignedDoctor: 'Dr. Emily Davis',
      condition: 'Critical',
      diagnosis: 'Cardiac Arrest',
      documents: ['ecg_report.pdf', 'angiography.pdf']
    },
  ]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: '',
    emergencyContact: '',
    emergencyContactName: '',
    roomNumber: '',
    assignedDoctor: '',
    diagnosis: '',
    admissionDate: ''
  });

  const showToast = (message, type = 'success') => {
    const toastDiv = document.createElement('div');
    toastDiv.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toastDiv.textContent = message;
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
  };

  const stats = {
    total: patients.length,
    admitted: patients.filter(p => p.status === 'admitted').length,
    outpatient: patients.filter(p => p.status === 'outpatient').length,
    discharged: patients.filter(p => p.status === 'discharged').length,
    critical: patients.filter(p => p.condition === 'Critical').length
  };

  const handleAddPatient = () => {
    setModalType('add');
    setSelectedPatient(null);
    setFormData({
      firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
      gender: '', bloodGroup: '', address: '', emergencyContact: '', emergencyContactName: ''
    });
    setShowModal(true);
  };

  const handleEditPatient = (patient) => {
    setModalType('edit');
    setSelectedPatient(patient);
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      address: patient.address,
      emergencyContact: patient.emergencyContact,
      emergencyContactName: patient.emergencyContactName
    });
    setShowModal(true);
  };

  const handleViewPatient = (patient) => {
    setModalType('view');
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleAdmitPatient = (patient) => {
    setModalType('admit');
    setSelectedPatient(patient);
    setFormData({
      roomNumber: '',
      assignedDoctor: '',
      diagnosis: '',
      admissionDate: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleDocuments = (patient) => {
    setModalType('documents');
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleDownloadDocument = (doc) => {
    showToast(`Downloading ${doc}...`);
  };

  const handleDischargePatient = (patientId) => {
    if (window.confirm('Are you sure you want to discharge this patient?')) {
      setPatients(patients.map(p => 
        p.id === patientId 
          ? { ...p, status: 'discharged', dischargeDate: new Date().toISOString().split('T')[0] }
          : p
      ));
      showToast('Patient discharged successfully');
    }
  };

  const handleDeletePatient = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      setPatients(patients.filter(p => p.id !== patientId));
      showToast('Patient record deleted successfully');
    }
  };

  const handleSubmitPatient = (e) => {
    e.preventDefault();
    if (selectedPatient) {
      setPatients(patients.map(p => 
        p.id === selectedPatient.id ? { ...p, ...formData } : p
      ));
      showToast('Patient updated successfully');
    } else {
      const newPatient = { 
        id: `P${String(patients.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'outpatient',
        documents: []
      };
      setPatients([...patients, newPatient]);
      showToast('Patient added successfully');
    }
    setShowModal(false);
  };

  const handleSubmitAdmission = (e) => {
    e.preventDefault();
    setPatients(patients.map(p => 
      p.id === selectedPatient.id 
        ? { 
            ...p, 
            status: 'admitted',
            condition: 'Stable',
            roomNumber: formData.roomNumber,
            assignedDoctor: formData.assignedDoctor,
            diagnosis: formData.diagnosis,
            admissionDate: formData.admissionDate
          }
        : p
    ));
    showToast('Patient admitted successfully');
    setShowModal(false);
  };

 const filteredPatients = patients.filter(patient => {
  const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
  const matchesSearch = 
    fullName.includes(searchTerm.toLowerCase()) ||
    patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm);

  const matchesTab = 
    activeTab === 'all' ||
    (activeTab === 'admitted' && patient.status === 'admitted') ||
    (activeTab === 'discharged' && patient.status === 'discharged');

  return matchesSearch && matchesTab;
});

  const getStatusBadge = (status) => {
    const styles = {
      admitted: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      outpatient: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      discharged: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
    };
    const icons = {
      admitted: <Bed className="w-3 h-3" />,
      outpatient: <Activity className="w-3 h-3" />,
      discharged: <CheckCircle className="w-3 h-3" />
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        {status}
      </span>
    );
  };

  const getConditionBadge = (condition) => {
    const styles = {
      Critical: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      Stable: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      Recovered: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[condition] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'}`}>
        {condition}
      </span>
    );
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patient Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View, manage, and track patient records</p>
          </div>
          <button
            onClick={handleAddPatient}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            Add Patient
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Patients</p>
                <p className="text-3xl font-bold mt-2">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Admitted</p>
                <p className="text-3xl font-bold mt-2">{stats.admitted}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Bed className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Outpatient</p>
                <p className="text-3xl font-bold mt-2">{stats.outpatient}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100 text-sm font-medium">Discharged</p>
                <p className="text-3xl font-bold mt-2">{stats.discharged}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Critical</p>
                <p className="text-3xl font-bold mt-2">{stats.critical}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-6">
              <nav className="flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'all'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  All Patients ({patients.length})
                </button>
                <button
                  onClick={() => setActiveTab('admitted')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'admitted'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  Admitted ({stats.admitted})
                </button>
                <button
                  onClick={() => setActiveTab('discharged')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'discharged'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  Discharged ({stats.discharged})
                </button>
              </nav>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, ID, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Patient ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Age / Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Blood Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Assigned Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{patient.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                              {patient.firstName[0]}{patient.lastName[0]}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {patient.firstName} {patient.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{patient.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{patient.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {calculateAge(patient.dateOfBirth)} years / {patient.gender}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-xs font-medium">
                          {patient.bloodGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(patient.status)}
                        {patient.status === 'admitted' && patient.condition && (
                          <div className="mt-1">{getConditionBadge(patient.condition)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {patient.assignedDoctor || '-'}
                        </div>
                        {patient.status === 'admitted' && patient.roomNumber && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">{patient.roomNumber}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewPatient(patient)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEditPatient(patient)}
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDocuments(patient)}
                            className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300"
                            title="Documents"
                          >
                            <FileText className="w-5 h-5" />
                          </button>
                          {patient.status === 'outpatient' && (
                            <button
                              onClick={() => handleAdmitPatient(patient)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                              title="Admit Patient"
                            >
                              <Bed className="w-5 h-5" />
                            </button>
                          )}
                          {patient.status === 'admitted' && (
                            <button
                              onClick={() => handleDischargePatient(patient.id)}
                              className="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300"
                              title="Discharge"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePatient(patient.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {(modalType === 'add' || modalType === 'edit') && (
                <>
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {modalType === 'add' ? 'Add New Patient' : 'Edit Patient'}
                    </h2>
                  </div>
                  <form onSubmit={handleSubmitPatient} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth *</label>
                        <input
                          type="date"
                          required
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender *</label>
                        <select
                          required
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Blood Group *</label>
                        <select
                          required
                          value={formData.bloodGroup}
                          onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Select</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address *</label>
                      <textarea
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Emergency Contact Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.emergencyContactName}
                          onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Emergency Contact Phone *</label>
                        <input
                          type="tel"
                          required
                          value={formData.emergencyContact}
                          onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {modalType === 'add' ? 'Add Patient' : 'Update Patient'}
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

              {modalType === 'view' && selectedPatient && (
                <>
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Patient Details</h2>
                      <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-blue-200 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {selectedPatient.firstName} {selectedPatient.lastName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPatient.id}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {getStatusBadge(selectedPatient.status)}
                          {selectedPatient.condition && getConditionBadge(selectedPatient.condition)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Age</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{calculateAge(selectedPatient.dateOfBirth)} years</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Gender</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{selectedPatient.gender}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Blood Group</p>
                          <span className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded text-xs font-semibold">
                            {selectedPatient.bloodGroup}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Date of Birth</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedPatient.dateOfBirth}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Contact Information
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedPatient.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Phone</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedPatient.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Address</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedPatient.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        Emergency Contact
                      </h4>
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedPatient.emergencyContactName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPatient.emergencyContact}</p>
                      </div>
                    </div>

                    {selectedPatient.status === 'admitted' && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Stethoscope className="w-5 h-5 text-green-600 dark:text-green-400" />
                          Medical Information
                        </h4>
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Assigned Doctor</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedPatient.assignedDoctor}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Room Number</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedPatient.roomNumber}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Admission Date</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedPatient.admissionDate}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Diagnosis</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedPatient.diagnosis}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedPatient.documents && selectedPatient.documents.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          Documents ({selectedPatient.documents.length})
                        </h4>
                        <div className="space-y-2">
                          {selectedPatient.documents.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{doc}</span>
                              </div>
                              <button
                                onClick={() => handleDownloadDocument(doc)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setTimeout(() => handleEditPatient(selectedPatient), 100);
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Edit Patient
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

              {modalType === 'admit' && selectedPatient && (
                <>
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Admit Patient</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedPatient.firstName} {selectedPatient.lastName} ({selectedPatient.id})
                    </p>
                  </div>
                  <form onSubmit={handleSubmitAdmission} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Room Number *</label>
                        <select
                          required
                          value={formData.roomNumber}
                          onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Select Room</option>
                          <option value="ICU-101">ICU-101</option>
                          <option value="ICU-102">ICU-102</option>
                          <option value="Private-301">Private-301</option>
                          <option value="Private-302">Private-302</option>
                          <option value="Ward-201">Ward-201</option>
                          <option value="Ward-202">Ward-202</option>
                          <option value="OT-1">OT-1</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assign Doctor *</label>
                        <select
                          required
                          value={formData.assignedDoctor}
                          onChange={(e) => setFormData({ ...formData, assignedDoctor: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Select Doctor</option>
                          <option value="Dr. Sarah Smith">Dr. Sarah Smith - Cardiology</option>
                          <option value="Dr. Mike Johnson">Dr. Mike Johnson - Neurology</option>
                          <option value="Dr. Emily Davis">Dr. Emily Davis - General Surgery</option>
                          <option value="Dr. John Williams">Dr. John Williams - Orthopedics</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Admission Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.admissionDate}
                        onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Diagnosis / Reason for Admission *</label>
                      <textarea
                        required
                        value={formData.diagnosis}
                        onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter diagnosis or reason for admission..."
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Admit Patient
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

              {modalType === 'documents' && selectedPatient && (
                <>
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Patient Documents</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {selectedPatient.firstName} {selectedPatient.lastName} ({selectedPatient.id})
                        </p>
                      </div>
                      <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {selectedPatient.documents && selectedPatient.documents.length > 0 ? (
                      <div className="space-y-3">
                        {selectedPatient.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{doc}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PDF Document</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownloadDocument(doc)}
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No documents available</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Upload patient documents to view them here</p>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => setShowModal(false)}
                        className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
    </div>
  );
};

export default PatientManagement;