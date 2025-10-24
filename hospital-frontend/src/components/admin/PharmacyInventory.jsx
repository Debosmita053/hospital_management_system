import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, AlertTriangle, Package, TrendingDown, DollarSign, Calendar, Download, CheckCircle, XCircle, Clock } from 'lucide-react';

const PharmacyInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('medicines');
  const [modalType, setModalType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Medicines data
  const [medicines, setMedicines] = useState([
    {
      id: 'MED001',
      name: 'Paracetamol 500mg',
      category: 'Analgesics',
      manufacturer: 'PharmaCorp',
      supplier: 'MediSupply Ltd',
      batchNumber: 'BATCH-2024-001',
      quantity: 500,
      unitPrice: 2.50,
      expiryDate: '2025-12-31',
      reorderLevel: 100,
      location: 'Shelf A-12',
      description: 'Pain reliever and fever reducer'
    },
    {
      id: 'MED002',
      name: 'Amoxicillin 250mg',
      category: 'Antibiotics',
      manufacturer: 'BioPharm',
      supplier: 'Global Meds Inc',
      batchNumber: 'BATCH-2024-045',
      quantity: 45,
      unitPrice: 5.75,
      expiryDate: '2024-11-30',
      reorderLevel: 50,
      location: 'Shelf B-08',
      description: 'Antibiotic for bacterial infections'
    },
    {
      id: 'MED003',
      name: 'Insulin Glargine 100 units/ml',
      category: 'Diabetes',
      manufacturer: 'DiabetesCare',
      supplier: 'MediSupply Ltd',
      batchNumber: 'BATCH-2024-089',
      quantity: 150,
      unitPrice: 45.00,
      expiryDate: '2026-03-15',
      reorderLevel: 30,
      location: 'Refrigerator R-01',
      description: 'Long-acting insulin'
    },
    {
      id: 'MED004',
      name: 'Omeprazole 20mg',
      category: 'Gastrointestinal',
      manufacturer: 'GastroPharma',
      supplier: 'HealthDist Co',
      batchNumber: 'BATCH-2024-112',
      quantity: 280,
      unitPrice: 3.25,
      expiryDate: '2025-08-20',
      reorderLevel: 80,
      location: 'Shelf C-15',
      description: 'Proton pump inhibitor'
    }
  ]);

  // Prescriptions data
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'RX001',
      patientName: 'John Doe',
      patientId: 'P001',
      doctorName: 'Dr. Sarah Smith',
      date: '2024-10-15',
      medicines: [
        { name: 'Paracetamol 500mg', quantity: 20, dosage: '1 tablet twice daily' },
        { name: 'Amoxicillin 250mg', quantity: 15, dosage: '1 tablet three times daily' }
      ],
      status: 'Pending',
      priority: 'Normal'
    },
    {
      id: 'RX002',
      patientName: 'Jane Smith',
      patientId: 'P002',
      doctorName: 'Dr. Michael Brown',
      date: '2024-10-16',
      medicines: [
        { name: 'Insulin Glargine 100 units/ml', quantity: 3, dosage: 'As directed' }
      ],
      status: 'Dispensed',
      priority: 'Urgent'
    },
    {
      id: 'RX003',
      patientName: 'Robert Johnson',
      patientId: 'P003',
      doctorName: 'Dr. Sarah Smith',
      date: '2024-10-17',
      medicines: [
        { name: 'Omeprazole 20mg', quantity: 30, dosage: '1 tablet daily before breakfast' }
      ],
      status: 'Pending',
      priority: 'Normal'
    }
  ]);

  // Restock requests data
  const [restockRequests, setRestockRequests] = useState([
    {
      id: 'REQ001',
      medicineName: 'Amoxicillin 250mg',
      medicineId: 'MED002',
      currentStock: 45,
      requestedQuantity: 200,
      supplier: 'Global Meds Inc',
      estimatedCost: 1150.00,
      requestDate: '2024-10-18',
      requestedBy: 'Pharmacist John',
      urgency: 'High',
      status: 'Pending',
      reason: 'Stock below reorder level'
    },
    {
      id: 'REQ002',
      medicineName: 'Paracetamol 500mg',
      medicineId: 'MED001',
      currentStock: 500,
      requestedQuantity: 500,
      supplier: 'MediSupply Ltd',
      estimatedCost: 1250.00,
      requestDate: '2024-10-17',
      requestedBy: 'Pharmacist Sarah',
      urgency: 'Medium',
      status: 'Pending',
      reason: 'Regular restocking'
    },
    {
      id: 'REQ003',
      medicineName: 'Insulin Glargine 100 units/ml',
      medicineId: 'MED003',
      currentStock: 150,
      requestedQuantity: 100,
      supplier: 'MediSupply Ltd',
      estimatedCost: 4500.00,
      requestDate: '2024-10-16',
      requestedBy: 'Pharmacist John',
      urgency: 'Low',
      status: 'Approved',
      reason: 'Anticipating increased demand'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    manufacturer: '',
    supplier: '',
    batchNumber: '',
    quantity: '',
    unitPrice: '',
    expiryDate: '',
    reorderLevel: '',
    location: '',
    description: ''
  });

  const categories = ['Analgesics', 'Antibiotics', 'Diabetes', 'Gastrointestinal', 'Cardiovascular', 'Respiratory', 'Dermatology', 'Vitamins', 'Other'];

  // Calculate stats
  const totalMedicines = medicines.length;
  const lowStockItems = medicines.filter(m => m.quantity <= m.reorderLevel).length;
  const expiringItems = medicines.filter(m => {
    const daysToExpiry = Math.floor((new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysToExpiry <= 90 && daysToExpiry > 0;
  }).length;
  const totalInventoryValue = medicines.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0);
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pending').length;
  const pendingRestocks = restockRequests.filter(r => r.status === 'Pending').length;

  // Filter medicines
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || medicine.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Check stock status
  const getStockStatus = (medicine) => {
    const daysToExpiry = Math.floor((new Date(medicine.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysToExpiry <= 30 && daysToExpiry > 0) return { status: 'Expiring Soon', color: 'red' };
    if (daysToExpiry <= 0) return { status: 'Expired', color: 'red' };
    if (medicine.quantity === 0) return { status: 'Out of Stock', color: 'red' };
    if (medicine.quantity <= medicine.reorderLevel) return { status: 'Low Stock', color: 'yellow' };
    return { status: 'In Stock', color: 'green' };
  };

  const handleAddMedicine = () => {
    setFormData({
      name: '',
      category: '',
      manufacturer: '',
      supplier: '',
      batchNumber: '',
      quantity: '',
      unitPrice: '',
      expiryDate: '',
      reorderLevel: '',
      location: '',
      description: ''
    });
    setModalType('add');
  };

  const handleEditMedicine = (medicine) => {
    setSelectedItem(medicine);
    setFormData({
      name: medicine.name,
      category: medicine.category,
      manufacturer: medicine.manufacturer,
      supplier: medicine.supplier,
      batchNumber: medicine.batchNumber,
      quantity: medicine.quantity,
      unitPrice: medicine.unitPrice,
      expiryDate: medicine.expiryDate,
      reorderLevel: medicine.reorderLevel,
      location: medicine.location,
      description: medicine.description
    });
    setModalType('edit');
  };

  const handleViewMedicine = (medicine) => {
    setSelectedItem(medicine);
    setModalType('view');
  };

  const handleViewPrescription = (prescription) => {
    setSelectedItem(prescription);
    setModalType('viewPrescription');
  };

  const handleViewRestockRequest = (request) => {
    setSelectedItem(request);
    setModalType('viewRestock');
  };

  const handleSubmitMedicine = (e) => {
    e.preventDefault();
    
    if (modalType === 'add') {
      const newMedicine = {
        ...formData,
        id: `MED${String(medicines.length + 1).padStart(3, '0')}`,
        quantity: parseInt(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        reorderLevel: parseInt(formData.reorderLevel)
      };
      setMedicines([...medicines, newMedicine]);
      alert('Medicine added successfully!');
    } else {
      setMedicines(medicines.map(m => 
        m.id === selectedItem.id 
          ? { 
              ...m, 
              ...formData,
              quantity: parseInt(formData.quantity),
              unitPrice: parseFloat(formData.unitPrice),
              reorderLevel: parseInt(formData.reorderLevel)
            }
          : m
      ));
      alert('Medicine updated successfully!');
    }
    
    setModalType(null);
  };

  const handleDeleteMedicine = (medicine) => {
    if (window.confirm(`Are you sure you want to delete ${medicine.name}?`)) {
      setMedicines(medicines.filter(m => m.id !== medicine.id));
      alert('Medicine deleted successfully!');
    }
  };

  const handleDispensePrescription = (prescription) => {
    setPrescriptions(prescriptions.map(p =>
      p.id === prescription.id ? { ...p, status: 'Dispensed' } : p
    ));
    alert('Prescription dispensed successfully!');
  };

  const handleApproveRestock = (request) => {
    setRestockRequests(restockRequests.map(r =>
      r.id === request.id ? { ...r, status: 'Approved' } : r
    ));
    alert('Restock request approved!');
  };

  const handleRejectRestock = (request) => {
    setRestockRequests(restockRequests.map(r =>
      r.id === request.id ? { ...r, status: 'Rejected' } : r
    ));
    alert('Restock request rejected!');
  };

  const generateReport = () => {
    alert('Medicine usage report generated! (This would download a PDF/Excel file)');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Pharmacy & Inventory Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage medicines, prescriptions, and stock levels</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Medicines</p>
              <h3 className="text-3xl font-bold">{totalMedicines}</h3>
            </div>
            <Package className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium mb-1">Low Stock</p>
              <h3 className="text-3xl font-bold">{lowStockItems}</h3>
            </div>
            <TrendingDown className="w-12 h-12 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium mb-1">Expiring Soon</p>
              <h3 className="text-3xl font-bold">{expiringItems}</h3>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Inventory Value</p>
              <h3 className="text-2xl font-bold">₹{totalInventoryValue.toFixed(2)}</h3>
            </div>
            <DollarSign className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Pending Rx</p>
              <h3 className="text-3xl font-bold">{pendingPrescriptions}</h3>
            </div>
            <Clock className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-1">Restock Requests</p>
              <h3 className="text-3xl font-bold">{pendingRestocks}</h3>
            </div>
            <Package className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('medicines')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'medicines'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Medicines ({totalMedicines})
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'prescriptions'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Prescriptions ({prescriptions.length})
            </button>
            <button
              onClick={() => setActiveTab('restock')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'restock'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <TrendingDown className="w-4 h-4 inline mr-2" />
              Restock Requests ({restockRequests.length})
            </button>
          </div>
        </div>
      </div>

      {/* Medicines Tab */}
      {activeTab === 'medicines' && (
        <>
          {/* Filters & Search */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search medicines by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <button
                onClick={generateReport}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors dark:bg-green-700 dark:hover:bg-green-600"
              >
                <Download className="w-5 h-5" />
                Generate Report
              </button>

              <button
                onClick={handleAddMedicine}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                <Plus className="w-5 h-5" />
                Add Medicine
              </button>
            </div>
          </div>

          {/* Medicines Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Medicine ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredMedicines.map((medicine) => {
                    const stockStatus = getStockStatus(medicine);
                    return (
                      <tr key={medicine.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {medicine.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{medicine.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{medicine.manufacturer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                            {medicine.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {medicine.quantity} units
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ₹{medicine.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {new Date(medicine.expiryDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            stockStatus.color === 'green' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                            stockStatus.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                            'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}>
                            {stockStatus.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewMedicine(medicine)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleEditMedicine(medicine)}
                              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300"
                              title="Edit"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMedicine(medicine)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredMedicines.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  No medicines found
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Prescriptions Tab */}
      {activeTab === 'prescriptions' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rx ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Medicines
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {prescriptions.map((prescription) => (
                  <tr key={prescription.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {prescription.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{prescription.patientName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{prescription.patientId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {prescription.doctorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(prescription.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {prescription.medicines.length} item(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        prescription.priority === 'Urgent' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      }`}>
                        {prescription.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        prescription.status === 'Dispensed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {prescription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewPrescription(prescription)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {prescription.status === 'Pending' && (
                          <button
                            onClick={() => handleDispensePrescription(prescription)}
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                            title="Dispense"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {prescriptions.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No prescriptions found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Restock Requests Tab */}
      {activeTab === 'restock' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Requested Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Est. Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Urgency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {restockRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {request.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{request.medicineName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{request.supplier}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {request.currentStock} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {request.requestedQuantity} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ₹{request.estimatedCost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.urgency === 'High' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                        request.urgency === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                        'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      }`}>
                        {request.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'Approved' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                        request.status === 'Rejected' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                        'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewRestockRequest(request)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {request.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApproveRestock(request)}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRejectRestock(request)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {restockRequests.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No restock requests found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Medicine Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {modalType === 'add' ? 'Add New Medicine' : 'Edit Medicine'}
              </h2>
            </div>

            <form onSubmit={handleSubmitMedicine} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Manufacturer *
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Supplier *
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Batch Number *
                  </label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reorder Level *
                  </label>
                  <input
                    type="number"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Storage Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Shelf A-12"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  placeholder="Add medicine description..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  {modalType === 'add' ? 'Add Medicine' : 'Update Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Medicine Modal */}
      {modalType === 'view' && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Medicine Details</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Medicine ID</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manufacturer</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.manufacturer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Supplier</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Batch Number</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.batchNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Stock</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.quantity} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Unit Price</p>
                  <p className="text-gray-900 dark:text-white font-medium">₹{selectedItem.unitPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
                  <p className="text-gray-900 dark:text-white font-medium">₹{(selectedItem.quantity * selectedItem.unitPrice).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Expiry Date</p>
                  <p className="text-gray-900 dark:text-white font-medium">{new Date(selectedItem.expiryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reorder Level</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.reorderLevel} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Storage Location</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.location}</p>
                </div>
              </div>

              {selectedItem.description && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Description</p>
                  <p className="text-gray-900 dark:text-white">{selectedItem.description}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setModalType(null)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Prescription Modal */}
      {modalType === 'viewPrescription' && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Prescription Details</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Prescription ID</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                  <p className="text-gray-900 dark:text-white font-medium">{new Date(selectedItem.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Patient Name</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Patient ID</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.patientId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Doctor</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.doctorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedItem.priority === 'Urgent' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  }`}>
                    {selectedItem.priority}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Prescribed Medicines</h3>
                <div className="space-y-3">
                  {selectedItem.medicines.map((med, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{med.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{med.dosage}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded">
                          Qty: {med.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModalType(null)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Close
                </button>
                {selectedItem.status === 'Pending' && (
                  <button
                    onClick={() => {
                      handleDispensePrescription(selectedItem);
                      setModalType(null);
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  >
                    Dispense
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Restock Request Modal */}
      {modalType === 'viewRestock' && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Restock Request Details</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Request ID</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Request Date</p>
                  <p className="text-gray-900 dark:text-white font-medium">{new Date(selectedItem.requestDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Medicine Name</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.medicineName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Medicine ID</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.medicineId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Stock</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.currentStock} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Requested Quantity</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.requestedQuantity} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Supplier</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Cost</p>
                  <p className="text-gray-900 dark:text-white font-medium">₹{selectedItem.estimatedCost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Requested By</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedItem.requestedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Urgency</p>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedItem.urgency === 'High' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                    selectedItem.urgency === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                    'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  }`}>
                    {selectedItem.urgency}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Reason</p>
                <p className="text-gray-900 dark:text-white">{selectedItem.reason}</p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModalType(null)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Close
                </button>
                {selectedItem.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleRejectRestock(selectedItem);
                        setModalType(null);
                      }}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        handleApproveRestock(selectedItem);
                        setModalType(null);
                      }}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                    >
                      Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyInventory;