const express = require('express');
const router = express.Router();
const {
  getBills,
  getBillById,
  createBill,
  updateBill,
  processPayment,
  getBillingStats,
  generateBillForAppointment
} = require('../controllers/billingController');
const { protect, authorize } = require('../middleware/auth');
const { validateBilling, validateObjectId, validatePagination } = require('../middleware/validation');

// All routes are protected
router.use(protect);

// Get bills
router.get('/', validatePagination, getBills);

// Get billing statistics (Admin only)
router.get('/stats', authorize('admin'), getBillingStats);

// Get bill by ID
router.get('/:id', validateObjectId('id'), getBillById);

// Create bill (Admin only)
router.post('/', authorize('admin'), validateBilling, createBill);

// Generate bill for appointment (Admin only)
router.post('/generate', authorize('admin'), generateBillForAppointment);

// Update bill (Admin only)
router.put('/:id', authorize('admin'), validateObjectId('id'), updateBill);

// Process payment
router.post('/:id/payment', validateObjectId('id'), processPayment);

module.exports = router;
