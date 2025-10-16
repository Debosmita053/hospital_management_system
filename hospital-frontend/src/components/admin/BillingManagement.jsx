import React, { useState } from 'react';
import { DollarSign, Receipt, CreditCard, Search, Download, Eye, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const BillingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  // New state for viewing bill details
  const [selectedBill, setSelectedBill] = useState(null);

  // Mock billing data - No change in amount values, just currency symbol in display
  const [bills, setBills] = useState([
    {
      id: 1,
      billNumber: 'BILL202401',
      patientName: 'John Doe',
      patientNumber: 'PAT001',
      admissionNumber: 'ADM001',
      billDate: '2024-12-15',
      totalAmount: 5500,
      paidAmount: 5500,
      dueAmount: 0,
      status: 'paid',
      items: ['Room Charges (5 days)', 'Lab Tests (CBC, Urine)', 'Medicines (Paracetamol, Antibiotics)'],
    },
    {
      id: 2,
      billNumber: 'BILL202402',
      patientName: 'Jane Wilson',
      patientNumber: 'PAT002',
      admissionNumber: 'ADM002',
      billDate: '2024-12-18',
      totalAmount: 8200,
      paidAmount: 4000,
      dueAmount: 4200,
      status: 'partially_paid',
      items: ['Room Charges (3 days)', 'Surgery (Minor Procedure)', 'Consultation (2 sessions)'],
    },
    {
      id: 3,
      billNumber: 'BILL202403',
      patientName: 'Bob Johnson',
      patientNumber: 'PAT003',
      admissionNumber: 'ADM003',
      billDate: '2024-12-19',
      totalAmount: 3200,
      paidAmount: 0,
      dueAmount: 3200,
      status: 'unpaid',
      items: ['Consultation (1 session)', 'Lab Tests (MRI Scan)'],
    },
    {
      id: 4,
      billNumber: 'BILL202404',
      patientName: 'Alice Cooper',
      patientNumber: 'PAT004',
      admissionNumber: 'ADM004',
      billDate: '2024-12-20',
      totalAmount: 12500,
      paidAmount: 0,
      dueAmount: 12500,
      status: 'insurance_pending',
      items: ['Room Charges (2 days)', 'ICU (1 day)', 'Surgery (Major Procedure)', 'Medicines (Specialist Drugs)'],
    },
  ]);

  // Filter bills
  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bill.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      partially_paid: 'bg-yellow-100 text-yellow-800',
      unpaid: 'bg-red-100 text-red-800',
      insurance_pending: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleMarkPaid = (id) => {
    setBills(
      bills.map((bill) =>
        bill.id === id
          ? { ...bill, status: 'paid', paidAmount: bill.totalAmount, dueAmount: 0 }
          : bill
      )
    );
    toast.success('Bill marked as paid!');
  };

  // Function to view details (now functional with a simple modal below)
  const handleViewDetails = (bill) => {
    setSelectedBill(bill);
  };

  // Calculate stats
  const totalRevenue = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const totalPaid = bills.reduce((sum, bill) => sum + bill.paidAmount, 0);
  const totalDue = bills.reduce((sum, bill) => sum + bill.dueAmount, 0);
  const paidBills = bills.filter(b => b.status === 'paid').length;

  // Bill Detail Modal Component
  const BillDetailModal = ({ bill, onClose, getStatusColor }) => {
    if (!bill) return null;

    const StatusPill = ({ status }) => (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
        {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg m-4">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-bold text-gray-900">
              Bill Details: {bill.billNumber}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-4 text-sm text-gray-700">
            <div className="grid grid-cols-2 gap-y-3">
              <p className="font-semibold text-gray-900">Patient:</p>
              <p>{bill.patientName} ({bill.patientNumber})</p>

              <p className="font-semibold text-gray-900">Admission No:</p>
              <p>{bill.admissionNumber}</p>

              <p className="font-semibold text-gray-900">Bill Date:</p>
              <p>{bill.billDate}</p>

              <p className="font-semibold text-gray-900">Total Amount:</p>
              <p className="font-bold text-gray-900">₹{bill.totalAmount.toLocaleString('en-IN')}</p>

              <p className="font-semibold text-gray-900">Status:</p>
              <StatusPill status={bill.status} />
            </div>

            <div className='pt-4 border-t mt-4'>
              <p className="font-semibold text-gray-900 mb-2">Billed Items:</p>
              <ul className='list-disc list-inside bg-gray-50 p-3 rounded-lg border space-y-1'>
                {bill.items.map((item, index) => (
                  <li key={index} className='text-xs'>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 border-t flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing Management</h1>
        <p className="text-gray-600 mt-1">Manage patient bills and payments</p>
      </div>

      {/* Stats Cards - CURRENCY UPDATED HERE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-3xl font-bold text-green-600 mt-1">₹{totalPaid.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Due</p>
              <p className="text-3xl font-bold text-red-600 mt-1">₹{totalDue.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Receipt className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid Bills</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{paidBills}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters - No change */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient or bill number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="insurance_pending">Insurance Pending</option>
          </select>
        </div>
      </div>

      {/* Bills Table - CURRENCY AND ACTIONS UPDATED HERE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bill Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bill Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Amount (₹)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Paid (₹)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Due (₹)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{bill.billNumber}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{bill.patientName}</p>
                      <p className="text-xs text-gray-500">{bill.patientNumber}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {bill.billDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{bill.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ₹{bill.paidAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                    ₹{bill.dueAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(bill.status)}`}>
                      {bill.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(bill)} // Added onClick for details
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                        title="Download Invoice"
                        onClick={() => toast.success(`Downloading Bill ${bill.billNumber}`)} // Added toast for feedback
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      {bill.status !== 'paid' && (
                        <button
                          onClick={() => handleMarkPaid(bill.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Mark as Paid"
                        >
                          <CheckCircle className="h-4 w-4" />
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

      {/* Render the Bill Detail Modal */}
      <BillDetailModal
        bill={selectedBill}
        onClose={() => setSelectedBill(null)}
        getStatusColor={getStatusColor}
      />
    </div>
  );
};

export default BillingManagement;