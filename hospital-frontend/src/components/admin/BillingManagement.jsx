import React, { useState, useCallback, memo } from 'react';
import { 
   Receipt, Search, Download, Eye, 
  CheckCircle, X, Plus, FileText, Shield, TrendingUp,
  Clock, AlertCircle, ThumbsUp, ThumbsDown, Mail
} from 'lucide-react';
import toast from 'react-hot-toast';

// Insurance Approval Workflow Component
const InsuranceApprovalWorkflow = memo(({ bill, onStatusUpdate, onClose }) => {
  const [currentStep, setCurrentStep] = useState(bill.claimStatus || 'submitted');
  const [notes, setNotes] = useState('');
  const [approvedAmount, setApprovedAmount] = useState(bill.claimAmount || bill.totalAmount);

  const workflowSteps = [
    { 
      key: 'submitted', 
      label: 'Claim Submitted', 
      description: 'Initial claim submitted to insurance',
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400'
    },
    { 
      key: 'under_review', 
      label: 'Under Review', 
      description: 'Insurance company reviewing documents',
      icon: Search,
      color: 'text-yellow-600 dark:text-yellow-400'
    },
    { 
      key: 'additional_info', 
      label: 'Additional Info Required', 
      description: 'Need more medical documentation',
      icon: AlertCircle,
      color: 'text-orange-600 dark:text-orange-400'
    },
    { 
      key: 'approved', 
      label: 'Approved', 
      description: 'Claim approved for payment',
      icon: ThumbsUp,
      color: 'text-green-600 dark:text-green-400'
    },
    { 
      key: 'rejected', 
      label: 'Rejected', 
      description: 'Claim denied by insurance',
      icon: ThumbsDown,
      color: 'text-red-600 dark:text-red-400'
    },
    { 
      key: 'paid', 
      label: 'Payment Processed', 
      description: 'Insurance payment received',
      icon: CheckCircle,
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  const handleStatusUpdate = (newStatus) => {
    const updateData = {
      claimStatus: newStatus,
      approvedAmount: newStatus === 'approved' ? approvedAmount : 0,
      reviewNotes: notes
    };
    
    onStatusUpdate(bill.id, updateData);
    setCurrentStep(newStatus);
    toast.success(`Claim status updated to ${workflowSteps.find(s => s.key === newStatus)?.label}`);
  };

  const getCurrentStepIndex = () => workflowSteps.findIndex(step => step.key === currentStep);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Insurance Claim Approval Workflow
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {bill.billNumber} - {bill.patientName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Claim Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total Bill Amount</p>
                <p className="font-semibold dark:text-white">₹{bill.totalAmount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Claim Amount</p>
                <p className="font-semibold dark:text-white">₹{bill.claimAmount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Insurance Provider</p>
                <p className="font-semibold dark:text-white">{bill.insuranceProvider}</p>
              </div>
            </div>
          </div>

          {/* Workflow Steps */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Approval Process</h3>
            <div className="space-y-4">
              {workflowSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index < getCurrentStepIndex();
                const isCurrent = step.key === currentStep;

                return (
                  <div
                    key={step.key}
                    className={`flex items-center space-x-4 p-4 rounded-lg border-2 ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                        : isCompleted
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400'
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isCurrent
                        ? 'bg-blue-500 text-white'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}>
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${
                        isCurrent ? 'text-blue-900 dark:text-blue-100' : 
                        isCompleted ? 'text-green-900 dark:text-green-100' : 
                        'text-gray-600 dark:text-gray-400'
                      }`}>
                        {step.label}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                      {isCurrent && step.key === 'approved' && (
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Approved Amount (₹)
                          </label>
                          <input
                            type="number"
                            value={approvedAmount}
                            onChange={(e) => setApprovedAmount(parseFloat(e.target.value))}
                            max={bill.claimAmount}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {isCompleted && (
                        <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes and Actions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Review Notes & Comments
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Add notes about this claim review..."
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Current Status: <span className="font-semibold capitalize dark:text-white">{currentStep.replace('_', ' ')}</span>
              </div>
              
              <div className="flex space-x-3">
                {currentStep === 'submitted' && (
                  <button
                    onClick={() => handleStatusUpdate('under_review')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    Mark Under Review
                  </button>
                )}
                
                {currentStep === 'under_review' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate('additional_info')}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
                    >
                      Request More Info
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('approved')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                    >
                      Approve Claim
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                    >
                      Reject Claim
                    </button>
                  </>
                )}
                
                {currentStep === 'additional_info' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate('under_review')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                      Back to Review
                    </button>
                  </>
                )}
                
                {currentStep === 'approved' && (
                  <button
                    onClick={() => handleStatusUpdate('paid')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
                  >
                    Mark as Paid
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Enhanced Insurance Modal with Document Upload
const EnhancedInsuranceModal = memo(({ 
  selectedBillForInsurance, 
  insuranceForm, 
  onClose, 
  onSubmitInsurance, 
  onInsuranceFormChange 
}) => {
  const [documents, setDocuments] = useState([]);

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString()
    }));
    setDocuments(prev => [...prev, ...newDocuments]);
    toast.success(`${files.length} document(s) uploaded`);
  };

  const handleRemoveDocument = (docId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast.success('Document removed');
  };

  const requiredDocuments = [
    'Medical Records',
    'Doctor Prescription',
    'Lab Test Reports',
    'Hospitalization Certificate',
    'Insurance Claim Form',
    'ID Proof'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Submit Insurance Claim
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Bill Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Bill: {selectedBillForInsurance.billNumber}</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedBillForInsurance.patientName}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total Amount: ₹{selectedBillForInsurance.totalAmount.toLocaleString('en-IN')}
            </p>
          </div>

          {/* Insurance Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Insurance Provider *
              </label>
              <select
                required
                value={insuranceForm.provider}
                onChange={(e) => onInsuranceFormChange('provider', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Provider</option>
                <option value="HealthCare Inc.">HealthCare Inc.</option>
                <option value="MediSecure">MediSecure</option>
                <option value="Star Health">Star Health</option>
                <option value="Apollo Munich">Apollo Munich</option>
                <option value="Max Bupa">Max Bupa</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Policy Number *
              </label>
              <input
                type="text"
                required
                value={insuranceForm.policyNumber}
                onChange={(e) => onInsuranceFormChange('policyNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Enter policy number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Claim Amount (₹) *
              </label>
              <input
                type="number"
                required
                value={insuranceForm.claimAmount}
                onChange={(e) => onInsuranceFormChange('claimAmount', e.target.value)}
                max={selectedBillForInsurance.totalAmount}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter claim amount"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Max: ₹{selectedBillForInsurance.totalAmount.toLocaleString('en-IN')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Insurance Type
              </label>
              <select
                value={insuranceForm.insuranceType}
                onChange={(e) => onInsuranceFormChange('insuranceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="cashless">Cashless</option>
                <option value="reimbursement">Reimbursement</option>
              </select>
            </div>
          </div>

          {/* Document Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Required Documents
            </label>
            
            <div className="space-y-3">
              {requiredDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{doc}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    documents.some(d => d.name.includes(doc)) 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                  }`}>
                    {documents.some(d => d.name.includes(doc)) ? 'Uploaded' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Documents
              </label>
              <input
                type="file"
                multiple
                onChange={handleDocumentUpload}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Supported formats: PDF, JPG, PNG, DOC (Max 10MB per file)
              </p>
            </div>

            {/* Uploaded Documents List */}
            {documents.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Uploaded Files:</p>
                <div className="space-y-2">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm dark:text-white">{doc.name}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Notes
            </label>
            <textarea
              value={insuranceForm.notes}
              onChange={(e) => onInsuranceFormChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Any additional information for the insurance claim..."
            />
          </div>
        </div>

        <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onSubmitInsurance}
            disabled={documents.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Submit Claim
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
});

// Bill Detail Modal Component
const BillDetailModal = memo(({ bill, onClose, onAddInsurance, onDownloadInvoice }) => {
  if (!bill) return null;

  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      partially_paid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      unpaid: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      insurance_pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Bill Details: {bill.billNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient and Bill Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Patient:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{bill.patientName} ({bill.patientNumber})</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Admission No:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{bill.admissionNumber}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Bill Date:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{bill.billDate}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Status:</p>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(bill.status)}`}>
                {bill.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          </div>

          {/* Insurance Info */}
          {bill.insuranceClaim && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Insurance Claim</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700 dark:text-blue-300">Provider:</p>
                  <p className="font-medium dark:text-white">{bill.insuranceProvider}</p>
                </div>
                <div>
                  <p className="text-blue-700 dark:text-blue-300">Claim Amount:</p>
                  <p className="font-medium dark:text-white">₹{bill.claimAmount?.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-blue-700 dark:text-blue-300">Status:</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    bill.claimStatus === 'approved' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                    bill.claimStatus === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                    'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {bill.claimStatus}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bill Items */}
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Billed Items:</p>
            <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Description</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {bill.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{item.description}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white text-right">₹{item.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <td className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white">Total</td>
                    <td className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white text-right">
                      ₹{bill.totalAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">₹{bill.totalAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Paid Amount</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">₹{bill.paidAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Due Amount</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">₹{bill.dueAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={() => onDownloadInvoice(bill)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Download className="h-4 w-4" />
            Download Invoice
          </button>
          {!bill.insuranceClaim && bill.dueAmount > 0 && (
            <button
              onClick={() => {
                onClose();
                onAddInsurance(bill);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 dark:bg-indigo-700 dark:hover:bg-indigo-600"
            >
              <Shield className="h-4 w-4" />
              Add Insurance
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
});

// Generate Bill Modal Component
const GenerateBillModal = memo(({ 
  billForm, 
  onClose, 
  onGenerateBill, 
  onBillFormChange 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerateBill();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Generate New Bill
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Patient Name *
              </label>
              <input
                type="text"
                required
                value={billForm.patientName}
                onChange={(e) => onBillFormChange('patientName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Patient Number *
              </label>
              <input
                type="text"
                required
                value={billForm.patientNumber}
                onChange={(e) => onBillFormChange('patientNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="PAT001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Admission Number *
            </label>
            <input
              type="text"
              required
              value={billForm.admissionNumber}
              onChange={(e) => onBillFormChange('admissionNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="ADM001"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Room Charges (₹)
              </label>
              <input
                type="number"
                value={billForm.roomCharges}
                onChange={(e) => onBillFormChange('roomCharges', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Consultation Fee (₹)
              </label>
              <input
                type="number"
                value={billForm.consultationFee}
                onChange={(e) => onBillFormChange('consultationFee', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lab Tests (₹)
              </label>
              <input
                type="number"
                value={billForm.labTests}
                onChange={(e) => onBillFormChange('labTests', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Medicines (₹)
              </label>
              <input
                type="number"
                value={billForm.medicines}
                onChange={(e) => onBillFormChange('medicines', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Procedures (₹)
              </label>
              <input
                type="number"
                value={billForm.procedures}
                onChange={(e) => onBillFormChange('procedures', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Other Charges (₹)
              </label>
              <input
                type="number"
                value={billForm.otherCharges}
                onChange={(e) => onBillFormChange('otherCharges', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={billForm.insuranceClaim}
              onChange={(e) => onBillFormChange('insuranceClaim', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Insurance Claim
            </label>
          </div>

          {billForm.insuranceClaim && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Insurance Provider
                </label>
                <input
                  type="text"
                  value={billForm.insuranceProvider}
                  onChange={(e) => onBillFormChange('insuranceProvider', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  placeholder="Insurance company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Claim Amount (₹)
                </label>
                <input
                  type="number"
                  value={billForm.claimAmount}
                  onChange={(e) => onBillFormChange('claimAmount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              <FileText className="h-4 w-4" />
              Generate Bill
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

// Main BillingManagement Component
const BillingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBill, setSelectedBill] = useState(null);
  const [showGenerateBill, setShowGenerateBill] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showApprovalWorkflow, setShowApprovalWorkflow] = useState(false);
  const [selectedBillForInsurance, setSelectedBillForInsurance] = useState(null);
  const [selectedBillForApproval, setSelectedBillForApproval] = useState(null);

  // Mock billing data with insurance details
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
      insuranceClaim: false,
      items: [
        { description: 'Room Charges (ICU-101 - 5 days)', amount: 2500, type: 'room' },
        { description: 'Lab Tests (CBC, Urine Analysis)', amount: 1500, type: 'test' },
        { description: 'Medicines (Paracetamol, Antibiotics)', amount: 1200, type: 'medicine' },
        { description: 'Doctor Consultation', amount: 300, type: 'consultation' }
      ],
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
      insuranceClaim: true,
      insuranceProvider: 'HealthCare Inc.',
      claimAmount: 5000,
      claimStatus: 'approved',
      items: [
        { description: 'Room Charges (Private-301 - 3 days)', amount: 9000, type: 'room' },
        { description: 'Minor Surgery', amount: 4000, type: 'procedure' },
        { description: 'Anesthesia', amount: 1500, type: 'medicine' },
        { description: 'Post-op Care', amount: 1200, type: 'service' }
      ],
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
      insuranceClaim: false,
      items: [
        { description: 'Consultation (Dr. Sarah Smith)', amount: 1500, type: 'consultation' },
        { description: 'MRI Scan', amount: 1200, type: 'test' },
        { description: 'X-Ray', amount: 500, type: 'test' }
      ],
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
      insuranceClaim: true,
      insuranceProvider: 'MediSecure',
      claimAmount: 10000,
      claimStatus: 'pending',
      items: [
        { description: 'Room Charges (ICU-102 - 2 days)', amount: 10000, type: 'room' },
        { description: 'ICU Charges (1 day)', amount: 5000, type: 'room' },
        { description: 'Major Surgery', amount: 8000, type: 'procedure' },
        { description: 'Specialist Medicines', amount: 3000, type: 'medicine' }
      ],
    },
  ]);

  // Form state for generating bills
  const [billForm, setBillForm] = useState({
    patientName: '',
    patientNumber: '',
    admissionNumber: '',
    roomCharges: '',
    consultationFee: '',
    labTests: '',
    medicines: '',
    procedures: '',
    otherCharges: '',
    insuranceClaim: false,
    insuranceProvider: '',
    claimAmount: ''
  });

  // Insurance form state
  const [insuranceForm, setInsuranceForm] = useState({
    provider: '',
    policyNumber: '',
    claimAmount: '',
    approvalStatus: 'pending',
    insuranceType: 'cashless',
    notes: ''
  });

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
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      partially_paid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      unpaid: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      insurance_pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const handleMarkPaid = useCallback((id) => {
    setBills(
      bills.map((bill) =>
        bill.id === id
          ? { ...bill, status: 'paid', paidAmount: bill.totalAmount, dueAmount: 0 }
          : bill
      )
    );
    toast.success('Bill marked as paid!');
  }, [bills]);

  const handleViewDetails = useCallback((bill) => {
    setSelectedBill(bill);
  }, []);

  const handleAddInsurance = useCallback((bill) => {
    setSelectedBillForInsurance(bill);
    setInsuranceForm({
      provider: bill.insuranceProvider || '',
      policyNumber: '',
      claimAmount: bill.dueAmount.toString(),
      approvalStatus: 'pending',
      insuranceType: 'cashless',
      notes: ''
    });
    setShowInsuranceModal(true);
  }, []);

  const handleSubmitInsurance = useCallback(() => {
    if (!selectedBillForInsurance) return;

    setBills(bills.map(bill => {
      if (bill.id === selectedBillForInsurance.id) {
        return {
          ...bill,
          insuranceClaim: true,
          insuranceProvider: insuranceForm.provider,
          claimAmount: parseFloat(insuranceForm.claimAmount),
          claimStatus: 'submitted', // Start with submitted status
          submittedDate: new Date().toISOString().split('T')[0],
          insuranceType: insuranceForm.insuranceType || 'cashless',
          reviewNotes: insuranceForm.notes || '',
          status: 'insurance_pending'
        };
      }
      return bill;
    }));

    toast.success('Insurance claim submitted successfully! Awaiting approval.');
    setShowInsuranceModal(false);
    setSelectedBillForInsurance(null);
  }, [selectedBillForInsurance, bills, insuranceForm]);

  const handleInsuranceStatusUpdate = useCallback((billId, updateData) => {
    setBills(bills.map(bill => {
      if (bill.id === billId) {
        const updatedBill = {
          ...bill,
          ...updateData,
          lastUpdated: new Date().toISOString().split('T')[0]
        };

        // Auto-update payment status when insurance is paid
        if (updateData.claimStatus === 'paid' && updateData.approvedAmount) {
          const insurancePayment = updateData.approvedAmount;
          const remainingDue = bill.totalAmount - insurancePayment - bill.paidAmount;
          
          updatedBill.paidAmount += insurancePayment;
          updatedBill.dueAmount = Math.max(0, remainingDue);
          updatedBill.status = remainingDue <= 0 ? 'paid' : 'partially_paid';
        }

        return updatedBill;
      }
      return bill;
    }));
  }, [bills]);

  const handleOpenApprovalWorkflow = useCallback((bill) => {
    setSelectedBillForApproval(bill);
    setShowApprovalWorkflow(true);
  }, []);

  const handleGenerateBill = useCallback((e) => {
    if (e) e.preventDefault();
    
    const roomCharges = parseFloat(billForm.roomCharges) || 0;
    const consultationFee = parseFloat(billForm.consultationFee) || 0;
    const labTests = parseFloat(billForm.labTests) || 0;
    const medicines = parseFloat(billForm.medicines) || 0;
    const procedures = parseFloat(billForm.procedures) || 0;
    const otherCharges = parseFloat(billForm.otherCharges) || 0;

    const totalAmount = roomCharges + consultationFee + labTests + medicines + procedures + otherCharges;

    if (totalAmount <= 0) {
      toast.error('Please add at least one charge item');
      return;
    }

    const newBill = {
      id: bills.length + 1,
      billNumber: `BILL${202400 + bills.length + 1}`,
      patientName: billForm.patientName,
      patientNumber: billForm.patientNumber,
      admissionNumber: billForm.admissionNumber,
      billDate: new Date().toISOString().split('T')[0],
      totalAmount: totalAmount,
      paidAmount: 0,
      dueAmount: totalAmount,
      status: 'unpaid',
      insuranceClaim: billForm.insuranceClaim,
      insuranceProvider: billForm.insuranceProvider || '',
      claimAmount: parseFloat(billForm.claimAmount) || 0,
      claimStatus: 'pending',
      items: [
        ...(roomCharges > 0 ? [{ description: 'Room Charges', amount: roomCharges, type: 'room' }] : []),
        ...(consultationFee > 0 ? [{ description: 'Doctor Consultation', amount: consultationFee, type: 'consultation' }] : []),
        ...(labTests > 0 ? [{ description: 'Lab Tests', amount: labTests, type: 'test' }] : []),
        ...(medicines > 0 ? [{ description: 'Medicines', amount: medicines, type: 'medicine' }] : []),
        ...(procedures > 0 ? [{ description: 'Medical Procedures', amount: procedures, type: 'procedure' }] : []),
        ...(otherCharges > 0 ? [{ description: 'Other Charges', amount: otherCharges, type: 'other' }] : [])
      ]
    };

    setBills([...bills, newBill]);
    toast.success('Bill generated successfully!');
    setShowGenerateBill(false);
    setBillForm({
      patientName: '',
      patientNumber: '',
      admissionNumber: '',
      roomCharges: '',
      consultationFee: '',
      labTests: '',
      medicines: '',
      procedures: '',
      otherCharges: '',
      insuranceClaim: false,
      insuranceProvider: '',
      claimAmount: ''
    });
  }, [billForm, bills]);

  const handleDownloadInvoice = useCallback((bill) => {
    toast.success(`Downloading invoice for ${bill.billNumber}...`);
    setTimeout(() => {
      toast.success(`Invoice ${bill.billNumber}.pdf downloaded successfully!`);
    }, 1500);
  }, []);

  const handleBillFormChange = useCallback((field, value) => {
    setBillForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleInsuranceFormChange = useCallback((field, value) => {
    setInsuranceForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Calculate stats
  const totalRevenue = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const totalPaid = bills.reduce((sum, bill) => sum + bill.paidAmount, 0);
  const totalDue = bills.reduce((sum, bill) => sum + bill.dueAmount, 0);
  
  const insuranceBills = bills.filter(b => b.insuranceClaim).length;
  const pendingClaims = bills.filter(b => b.claimStatus === 'pending' || b.claimStatus === 'submitted').length;

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage patient bills, payments, and insurance claims</p>
        </div>
        <button
          onClick={() => setShowGenerateBill(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          <Plus className="w-5 h-5" />
          Generate Bill
        </button>
      </div>

      {/* Stats Cards with Colorful Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Paid</p>
              <p className="text-3xl font-bold mt-2">₹{totalPaid.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Due</p>
              <p className="text-3xl font-bold mt-2">₹{totalDue.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Insurance Claims</p>
              <p className="text-3xl font-bold mt-2">{insuranceBills}</p>
              <p className="text-purple-100 text-xs mt-1">{pendingClaims} pending</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient or bill number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="insurance_pending">Insurance Pending</option>
          </select>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Bill Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Bill Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Total Amount (₹)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Due (₹)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Insurance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{bill.billNumber}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{bill.patientName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{bill.patientNumber}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {bill.billDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ₹{bill.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                    ₹{bill.dueAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(bill.status)}`}>
                      {bill.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {bill.insuranceClaim ? (
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          bill.claimStatus === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          bill.claimStatus === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          bill.claimStatus === 'paid' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {bill.claimStatus?.replace('_', ' ') || 'submitted'}
                        </span>
                        <button
                          onClick={() => handleOpenApprovalWorkflow(bill)}
                          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          title="Manage Approval"
                        >
                          <Shield className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(bill)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg"
                        title="Download Invoice"
                        onClick={() => handleDownloadInvoice(bill)}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      {!bill.insuranceClaim && bill.dueAmount > 0 && (
                        <button
                          onClick={() => handleAddInsurance(bill)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg"
                          title="Add Insurance"
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                      )}
                      {bill.status !== 'paid' && (
                        <button
                          onClick={() => handleMarkPaid(bill.id)}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
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

      {/* Modals */}
      {selectedBill && (
        <BillDetailModal
          bill={selectedBill}
          onClose={() => setSelectedBill(null)}
          onAddInsurance={handleAddInsurance}
          onDownloadInvoice={handleDownloadInvoice}
        />
      )}

      {showInsuranceModal && (
        <EnhancedInsuranceModal
          selectedBillForInsurance={selectedBillForInsurance}
          insuranceForm={insuranceForm}
          onClose={() => {
            setShowInsuranceModal(false);
            setSelectedBillForInsurance(null);
          }}
          onSubmitInsurance={handleSubmitInsurance}
          onInsuranceFormChange={handleInsuranceFormChange}
        />
      )}

      {showApprovalWorkflow && (
        <InsuranceApprovalWorkflow
          bill={selectedBillForApproval}
          onStatusUpdate={handleInsuranceStatusUpdate}
          onClose={() => {
            setShowApprovalWorkflow(false);
            setSelectedBillForApproval(null);
          }}
        />
      )}

      {showGenerateBill && (
        <GenerateBillModal
          billForm={billForm}
          onClose={() => setShowGenerateBill(false)}
          onGenerateBill={handleGenerateBill}
          onBillFormChange={handleBillFormChange}
        />
      )}
    </div>
  );
};

export default BillingManagement;