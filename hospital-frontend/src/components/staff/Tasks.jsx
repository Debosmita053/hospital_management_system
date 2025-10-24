import React, { useState, useContext } from 'react';
import { 
  Search, CheckCircle, Clock, AlertCircle, Plus,
  Activity, Syringe, Pill, TestTube, FileText, 
  Upload, Download, TrendingDown, BarChart3,
  User, Filter, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../contexts/AuthContext';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [vitalsData, setVitalsData] = useState({});
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);

  // Enhanced tasks with more realistic data
  const getRoleTasks = () => {
    const baseTasks = {
      nurse: [
        { 
          id: 1, 
          title: 'Administer medication', 
          patient: 'John Smith', 
          room: '101', 
          time: '09:00 AM', 
          priority: 'high', 
          status: 'pending', 
          notes: 'Amlodipine 5mg, Metformin 500mg - Monitor BP after administration',
          medications: [
            { name: 'Amlodipine 5mg', dosage: '1 tablet', time: '09:00 AM', route: 'Oral' },
            { name: 'Metformin 500mg', dosage: '1 tablet', time: '09:00 AM', route: 'Oral' }
          ],
          canRecordVitals: true,
          patientInfo: {
            age: 65,
            condition: 'Hypertension, Diabetes',
            allergies: 'Penicillin'
          }
        },
        { 
          id: 2, 
          title: 'Check vital signs', 
          patient: 'Sarah Johnson', 
          room: '102', 
          time: '10:30 AM', 
          priority: 'medium', 
          status: 'pending', 
          notes: 'BP, Temp, Pulse, SpO2 - Post-surgery monitoring',
          canRecordVitals: true,
          vitals: {
            bloodPressure: '',
            temperature: '',
            pulse: '',
            spo2: '',
            respiratoryRate: ''
          },
          patientInfo: {
            age: 45,
            condition: 'Appendectomy',
            allergies: 'None'
          }
        },
        { 
          id: 3, 
          title: 'Change dressing', 
          patient: 'Mike Wilson', 
          room: '103', 
          time: '11:00 AM', 
          priority: 'high', 
          status: 'in-progress', 
          notes: 'Surgical wound care - sterile procedure required',
          supplies: ['Sterile gauze', 'Antiseptic solution', 'Medical tape'],
          patientInfo: {
            age: 58,
            condition: 'Post-operative care',
            allergies: 'Latex'
          }
        },
        { 
          id: 4, 
          title: 'IV line maintenance', 
          patient: 'Emma Davis', 
          room: '104', 
          time: '02:00 PM', 
          priority: 'medium', 
          status: 'pending', 
          notes: 'Check IV site for redness/swelling, change dressing',
          patientInfo: {
            age: 72,
            condition: 'Dehydration',
            allergies: 'None'
          }
        }
      ],
      lab_technician: [
        { 
          id: 1, 
          title: 'Blood Test - CBC', 
          patient: 'John Doe', 
          room: 'Lab-A', 
          time: '09:00 AM', 
          priority: 'high', 
          status: 'pending', 
          notes: 'Fasting sample - Process within 2 hours',
          canUploadReport: true,
          testType: 'Complete Blood Count',
          sampleType: 'Blood',
          report: null,
          turnaroundTime: '4 hours'
        },
        { 
          id: 2, 
          title: 'Urine Analysis', 
          patient: 'Jane Smith', 
          room: 'Lab-B', 
          time: '10:00 AM', 
          priority: 'medium', 
          status: 'in-progress', 
          notes: 'Morning sample - Check for UTI',
          canUploadReport: true,
          testType: 'Urinalysis',
          sampleType: 'Urine',
          report: null,
          turnaroundTime: '2 hours'
        },
        { 
          id: 3, 
          title: 'X-Ray - Chest', 
          patient: 'Bob Wilson', 
          room: 'Radiology', 
          time: '11:30 AM', 
          priority: 'urgent', 
          status: 'pending', 
          notes: 'Pre-surgery clearance required',
          canUploadReport: true,
          testType: 'X-Ray Chest',
          sampleType: 'Imaging',
          report: null,
          turnaroundTime: '1 hour'
        },
        { 
          id: 4, 
          title: 'Culture & Sensitivity', 
          patient: 'Alice Brown', 
          room: 'Microbiology', 
          time: '01:00 PM', 
          priority: 'medium', 
          status: 'pending', 
          notes: 'Sputum culture - Report preliminary in 24h',
          canUploadReport: true,
          testType: 'Culture',
          sampleType: 'Sputum',
          report: null,
          turnaroundTime: '48 hours'
        }
      ],
      pharmacist: [
        { 
          id: 1, 
          title: 'Dispense prescription', 
          patient: 'Alice Brown', 
          room: 'Pharmacy', 
          time: '09:15 AM', 
          priority: 'high', 
          status: 'pending', 
          notes: 'Check drug interactions - Patient has renal impairment',
          prescription: {
            medicines: [
              { 
                name: 'Paracetamol 500mg', 
                quantity: 20, 
                dosage: '1 tablet twice daily',
                warnings: ['Take with food'],
                interactions: []
              },
              { 
                name: 'Amoxicillin 250mg', 
                quantity: 15, 
                dosage: '1 tablet three times daily',
                warnings: ['Complete full course'],
                interactions: ['Oral contraceptives']
              }
            ],
            doctor: 'Dr. Sharma',
            date: '2024-01-15'
          }
        },
        { 
          id: 2, 
          title: 'Medication counseling', 
          patient: 'Charlie Green', 
          room: 'Pharmacy', 
          time: '10:00 AM', 
          priority: 'medium', 
          status: 'in-progress', 
          notes: 'New medication education - Warfarin therapy'
        },
        { 
          id: 3, 
          title: 'Stock inventory check', 
          patient: 'N/A', 
          room: 'Pharmacy', 
          time: '11:00 AM', 
          priority: 'low', 
          status: 'pending', 
          notes: 'Weekly check - focus on expiring medicines'
        },
        { 
          id: 4, 
          title: 'Prepare IV medications', 
          patient: 'ICU Patients', 
          room: 'Pharmacy', 
          time: '12:00 PM', 
          priority: 'urgent', 
          status: 'pending', 
          notes: 'Vancomycin and Meropenem for ICU'
        }
      ],
      ward_boy: [
        { 
          id: 1, 
          title: 'Clean Room 201', 
          patient: 'Room 201', 
          room: 'Ward-201', 
          time: '09:00 AM', 
          priority: 'high', 
          status: 'pending', 
          notes: 'Deep cleaning and disinfection - Terminal cleaning',
          supplies: ['Disinfectant', 'Gloves', 'Masks'],
          duration: '45 minutes'
        },
        { 
          id: 2, 
          title: 'Transfer patient to ICU', 
          patient: 'Robert Chen', 
          room: 'Ward-202 to ICU', 
          time: '10:00 AM', 
          priority: 'urgent', 
          status: 'in-progress', 
          notes: 'Critical patient transfer - Monitor during transport',
          equipment: ['Stretcher', 'Oxygen tank', 'Monitor']
        },
        { 
          id: 3, 
          title: 'Equipment sterilization', 
          patient: 'N/A', 
          room: 'Central Sterile', 
          time: '11:00 AM', 
          priority: 'medium', 
          status: 'pending', 
          notes: 'Autoclave surgical instruments'
        },
        { 
          id: 4, 
          title: 'Supply restocking', 
          patient: 'All Wards', 
          room: 'Storage to Wards', 
          time: '02:00 PM', 
          priority: 'low', 
          status: 'pending', 
          notes: 'Restock linens and basic supplies'
        }
      ]
    };
    return baseTasks[user?.role] || baseTasks.nurse;
  };

  // Enhanced low stock medicines
  const lowStockMedicines = [
    {
      id: 'MED001',
      name: 'Amoxicillin 250mg',
      currentStock: 15,
      reorderLevel: 50,
      expiryDate: '2024-12-31',
      supplier: 'PharmaCorp',
      urgency: 'high',
      category: 'Antibiotic'
    },
    {
      id: 'MED002',
      name: 'Paracetamol 500mg',
      currentStock: 45,
      reorderLevel: 100,
      expiryDate: '2025-06-30',
      supplier: 'MediSupply',
      urgency: 'medium',
      category: 'Analgesic'
    },
    {
      id: 'MED003',
      name: 'Insulin Glargine',
      currentStock: 8,
      reorderLevel: 20,
      expiryDate: '2024-11-15',
      supplier: 'DiabetesCare',
      urgency: 'critical',
      category: 'Hormone'
    }
  ];

  const [tasks, setTasks] = useState(getRoleTasks());

  // Enhanced stats with more role-specific metrics
  const getStats = () => {
    const baseStats = [
      { 
        label: 'Total Tasks', 
        value: tasks.length, 
        icon: FileText, 
        color: 'blue',
        gradient: 'from-blue-500 to-blue-600'
      },
      { 
        label: 'Pending', 
        value: tasks.filter(t => t.status === 'pending').length, 
        icon: Clock, 
        color: 'yellow',
        gradient: 'from-yellow-500 to-yellow-600'
      },
      { 
        label: 'In Progress', 
        value: tasks.filter(t => t.status === 'in-progress').length, 
        icon: Activity, 
        color: 'purple',
        gradient: 'from-purple-500 to-purple-600'
      },
      { 
        label: 'Completed', 
        value: tasks.filter(t => t.status === 'completed').length, 
        icon: CheckCircle, 
        color: 'green',
        gradient: 'from-green-500 to-green-600'
      }
    ];

    // Role-specific additional stats
    if (user?.role === 'pharmacist') {
      return [
        { 
          label: 'Prescriptions', 
          value: tasks.filter(t => t.prescription).length, 
          icon: Pill, 
          color: 'indigo',
          gradient: 'from-indigo-500 to-indigo-600'
        },
        ...baseStats,
        { 
          label: 'Low Stock', 
          value: lowStockMedicines.length, 
          icon: TrendingDown, 
          color: 'orange',
          gradient: 'from-orange-500 to-orange-600'
        }
      ];
    }

    if (user?.role === 'nurse') {
      return [
        { 
          label: 'Medications Due', 
          value: tasks.filter(t => t.medications).length, 
          icon: Syringe, 
          color: 'pink',
          gradient: 'from-pink-500 to-pink-600'
        },
        ...baseStats,
        { 
          label: 'Vitals Due', 
          value: tasks.filter(t => t.canRecordVitals).length, 
          icon: Activity, 
          color: 'red',
          gradient: 'from-red-500 to-red-600'
        }
      ];
    }

    if (user?.role === 'lab_technician') {
      return [
        { 
          label: 'Tests Today', 
          value: tasks.length, 
          icon: TestTube, 
          color: 'cyan',
          gradient: 'from-cyan-500 to-cyan-600'
        },
        ...baseStats,
        { 
          label: 'Reports Pending', 
          value: tasks.filter(t => t.canUploadReport && !t.report).length, 
          icon: FileText, 
          color: 'teal',
          gradient: 'from-teal-500 to-teal-600'
        }
      ];
    }

    return baseStats;
  };

  const stats = getStats();

  // Enhanced filtering
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.room.includes(searchTerm) ||
                         (task.notes && task.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700',
      high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-700',
      medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700',
      low: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700'
    };
    return colors[priority];
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700',
      'in-progress': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700',
      completed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700'
    };
    return colors[status];
  };

  // Enhanced task actions
  const handleCompleteTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: 'completed', completedAt: new Date().toLocaleTimeString() } : task
    ));
    toast.success('Task marked as completed!');
  };

  const handleStartTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: 'in-progress', startedAt: new Date().toLocaleTimeString() } : task
    ));
    toast.success('Task started!');
  };

  const handleViewDetails = (task) => {
    setSelectedTaskDetails(task);
    setViewDetailsModalOpen(true);
  };

  // Nurse: Record Vitals
  const handleOpenVitalsModal = (task) => {
    setSelectedTask(task);
    setVitalsData(task.vitals || {
      bloodPressure: '',
      temperature: '',
      pulse: '',
      spo2: '',
      respiratoryRate: '',
      notes: ''
    });
    setVitalsModalOpen(true);
  };

  const handleSubmitVitals = () => {
    setTasks(tasks.map(task =>
      task.id === selectedTask.id ? {
        ...task,
        status: 'completed',
        vitals: { ...vitalsData, recordedAt: new Date().toLocaleString() }
      } : task
    ));
    toast.success('Vitals recorded successfully!');
    setVitalsModalOpen(false);
  };

  // Lab Technician: Upload Report
  const handleOpenUploadModal = (task) => {
    setSelectedTask(task);
    setSelectedFile(null);
    setUploadModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmitReport = () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setTasks(tasks.map(task =>
      task.id === selectedTask.id ? {
        ...task,
        status: 'completed',
        report: {
          fileName: selectedFile.name,
          uploadedAt: new Date().toLocaleString(),
          fileType: selectedFile.type,
          size: (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB'
        }
      } : task
    ));
    toast.success('Lab report uploaded successfully!');
    setUploadModalOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {user?.role === 'nurse' ? 'Nursing Tasks' :
             user?.role === 'lab_technician' ? 'Laboratory Tasks' :
             user?.role === 'pharmacist' ? 'Pharmacy Tasks' : 
             user?.role === 'ward_boy' ? 'Support Tasks' : 'My Tasks'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {user?.role === 'nurse' ? 'Patient care and medication management' :
             user?.role === 'lab_technician' ? 'Test processing and report management' :
             user?.role === 'pharmacist' ? 'Medicine dispensing and inventory management' : 
             user?.role === 'ward_boy' ? 'Patient support and facility maintenance' :
             'Manage your daily tasks and assignments'}
          </p>
        </div>
        <div className="flex gap-3">
          {/* Role-specific action buttons */}
          {user?.role === 'pharmacist' && (
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              Stock Report
            </button>
          )}
          {user?.role === 'lab_technician' && (
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <BarChart3 className="w-4 h-4" />
              Test Analytics
            </button>
          )}
          {/* Add task button for appropriate roles */}
          {(user?.role === 'nurse' || user?.role === 'head_nurse') && (
            <button
              onClick={() => toast.success('Add task feature coming soon!')}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg p-4 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white text-opacity-90 text-xs font-medium mb-1">{stat.label}</p>
                  <p className="text-xl font-bold mb-1">{stat.value}</p>
                </div>
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pharmacy Inventory Alerts */}
      {user?.role === 'pharmacist' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-orange-200 dark:border-orange-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-orange-500" />
                Low Stock Alert
              </h2>
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
                {lowStockMedicines.length} items
              </span>
            </div>
            <div className="space-y-3">
              {lowStockMedicines.map((medicine) => (
                <div key={medicine.id} className="border border-orange-200 dark:border-orange-700 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{medicine.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{medicine.category}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      medicine.urgency === 'critical' ? 'bg-red-200 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                      medicine.urgency === 'high' ? 'bg-orange-200 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                      'bg-yellow-200 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                    }`}>
                      {medicine.urgency}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <p>Stock: {medicine.currentStock} / {medicine.reorderLevel} units</p>
                    <p>Expiry: {new Date(medicine.expiryDate).toLocaleDateString()}</p>
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Supplier: {medicine.supplier}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">
                <Pill className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Check Interactions</span>
              </button>
              <button className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">
                <FileText className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Inventory Report</span>
              </button>
              <button className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Expiry Alert</span>
              </button>
              <button className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">
                <Download className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Order Supplies</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={
                user?.role === 'nurse' ? "Search patients, medications, rooms..." :
                user?.role === 'lab_technician' ? "Search tests, patients, sample types..." :
                user?.role === 'pharmacist' ? "Search prescriptions, medicines, categories..." :
                "Search tasks..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterPriority('all');
                setFilterStatus('all');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ').charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {task.patient}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      Room: {task.room}
                    </span>
                    {task.testType && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                        {task.testType}
                      </span>
                    )}
                    {task.sampleType && (
                      <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">
                        {task.sampleType}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(task)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Enhanced task details */}
                  {task.medications && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-3 rounded-lg mb-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <Syringe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Medications to Administer:
                      </p>
                      {task.medications.map((med, index) => (
                        <div key={index} className="text-sm text-gray-600 dark:text-gray-300 flex justify-between items-center mb-1 last:mb-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{med.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">({med.dosage})</span>
                            {med.route && <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">{med.route}</span>}
                          </div>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                            {med.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {task.prescription && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 p-3 rounded-lg mb-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <Pill className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        Prescription Details:
                      </p>
                      {task.prescription.medicines.map((med, index) => (
                        <div key={index} className="text-sm text-gray-600 dark:text-gray-300 mb-2 last:mb-0">
                          <div className="flex justify-between items-start">
                            <span className="font-medium">{med.name}</span>
                            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded">Qty: {med.quantity}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{med.dosage}</p>
                          {med.warnings && med.warnings.length > 0 && (
                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">⚠️ {med.warnings.join(', ')}</p>
                          )}
                        </div>
                      ))}
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Prescribed by: {task.prescription.doctor} on {task.prescription.date}
                      </div>
                    </div>
                  )}

                  {task.supplies && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-3 rounded-lg mb-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Required Supplies:</p>
                      <div className="flex flex-wrap gap-1">
                        {task.supplies.map((supply, index) => (
                          <span key={index} className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                            {supply}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {task.notes && (
                    <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-3 rounded-lg mb-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">📋 {task.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Scheduled: {task.time}
                      </span>
                      {task.turnaroundTime && (
                        <span className="flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          TAT: {task.turnaroundTime}
                        </span>
                      )}
                    </div>
                    {task.completedAt && (
                      <span className="text-green-600 dark:text-green-400 text-xs">
                        Completed at: {task.completedAt}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4 min-w-[140px]">
                  {/* Nurse Specific Actions */}
                  {user?.role === 'nurse' && task.canRecordVitals && task.status !== 'completed' && (
                    <button
                      onClick={() => handleOpenVitalsModal(task)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                    >
                      <Activity className="w-4 h-4" />
                      <span>Record Vitals</span>
                    </button>
                  )}

                  {user?.role === 'nurse' && task.medications && task.status !== 'completed' && (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                    >
                      <Syringe className="w-4 h-4" />
                      <span>Administer</span>
                    </button>
                  )}

                  {/* Lab Technician Specific Actions */}
                  {user?.role === 'lab_technician' && task.canUploadReport && task.status !== 'completed' && (
                    <button
                      onClick={() => handleOpenUploadModal(task)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Report</span>
                    </button>
                  )}

                  {/* Pharmacist Specific Actions */}
                  {user?.role === 'pharmacist' && task.prescription && task.status !== 'completed' && (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                    >
                      <Pill className="w-4 h-4" />
                      <span>Dispense</span>
                    </button>
                  )}

                  {/* Ward Boy Specific Actions */}
                  {user?.role === 'ward_boy' && task.status !== 'completed' && (
                    <button
                      onClick={() => handleStartTask(task.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Start Task
                    </button>
                  )}

                  {/* Common Actions */}
                  {task.status === 'pending' && !task.canRecordVitals && !task.canUploadReport && !task.prescription && user?.role !== 'ward_boy' && (
                    <button
                      onClick={() => handleStartTask(task.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Start Task
                    </button>
                  )}

                  {task.status === 'in-progress' && (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Complete</span>
                    </button>
                  )}

                  {task.status === 'completed' && (
                    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium text-center flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Record Vitals Modal */}
      {vitalsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <Activity className="w-5 h-5 text-green-500" />
              Record Patient Vitals - {selectedTask?.patient}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    placeholder="120/80"
                    value={vitalsData.bloodPressure}
                    onChange={(e) => setVitalsData({...vitalsData, bloodPressure: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Temperature (°C)</label>
                  <input
                    type="text"
                    placeholder="98.6"
                    value={vitalsData.temperature}
                    onChange={(e) => setVitalsData({...vitalsData, temperature: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pulse (BPM)</label>
                  <input
                    type="text"
                    placeholder="72"
                    value={vitalsData.pulse}
                    onChange={(e) => setVitalsData({...vitalsData, pulse: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SpO2 (%)</label>
                  <input
                    type="text"
                    placeholder="98"
                    value={vitalsData.spo2}
                    onChange={(e) => setVitalsData({...vitalsData, spo2: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Respiratory Rate</label>
                <input
                  type="text"
                  placeholder="16"
                  value={vitalsData.respiratoryRate}
                  onChange={(e) => setVitalsData({...vitalsData, respiratoryRate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea
                  value={vitalsData.notes}
                  onChange={(e) => setVitalsData({...vitalsData, notes: e.target.value})}
                  rows="2"
                  placeholder="Additional observations..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setVitalsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitVitals}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Vitals
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Lab Report Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <Upload className="w-5 h-5 text-purple-500" />
              Upload Lab Report - {selectedTask?.testType}
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Patient:</strong> {selectedTask?.patient}<br/>
                  <strong>Test:</strong> {selectedTask?.testType}<br/>
                  <strong>Sample:</strong> {selectedTask?.sampleType}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Report</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Supported formats: PDF, JPG, PNG, DOC</p>
              </div>
              {selectedFile && (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700">
                  <p className="text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Selected: {selectedFile.name}
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReport}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Upload Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {viewDetailsModalOpen && selectedTaskDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <Eye className="w-5 h-5 text-blue-500" />
              Task Details
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Title</label>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedTaskDetails.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient</label>
                  <p className="text-gray-900 dark:text-white">{selectedTaskDetails.patient}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room</label>
                  <p className="text-gray-900 dark:text-white">{selectedTaskDetails.room}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scheduled Time</label>
                  <p className="text-gray-900 dark:text-white">{selectedTaskDetails.time}</p>
                </div>
              </div>

              {selectedTaskDetails.patientInfo && (
                <div className="border-t dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Patient Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Age:</span> {selectedTaskDetails.patientInfo.age}
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Condition:</span> {selectedTaskDetails.patientInfo.condition}
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600 dark:text-gray-400">Allergies:</span> {selectedTaskDetails.patientInfo.allergies}
                    </div>
                  </div>
                </div>
              )}

              {selectedTaskDetails.notes && (
                <div className="border-t dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTaskDetails.notes}</p>
                </div>
              )}

              <div className="border-t dark:border-gray-700 pt-4 flex gap-3">
                <button
                  onClick={() => setViewDetailsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;