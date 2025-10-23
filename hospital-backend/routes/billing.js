const express = require('express');
const { body, validationResult } = require('express-validator');
const Billing = require('../models/Billing');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/billing
// @desc    Get all billing records
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      dateFrom, 
      dateTo,
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { 'patient.patientId': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    if (dateFrom && dateTo) {
      query.createdAt = { 
        $gte: new Date(dateFrom), 
        $lte: new Date(dateTo) 
      };
    }

    // Role-based filtering
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (patient) {
        query.patient = patient._id;
      } else {
        return res.json({ bills: [], totalPages: 0, currentPage: 1, total: 0 });
      }
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const bills = await Billing.find(query)
      .populate('patient', 'patientId')
      .populate('patient.user', 'firstName lastName email phone')
      .populate('appointment', 'appointmentNumber appointmentDate')
      .populate('createdBy', 'firstName lastName')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Billing.countDocuments(query);

    res.json({
      bills,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get billing records error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/billing/:id
// @desc    Get billing record by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.id)
      .populate('patient', 'patientId')
      .populate('patient.user', 'firstName lastName email phone dateOfBirth gender bloodGroup')
      .populate('appointment', 'appointmentNumber appointmentDate reason')
      .populate('createdBy', 'firstName lastName');

    if (!bill) {
      return res.status(404).json({ message: 'Billing record not found' });
    }

    // Check permissions
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (!patient || bill.patient._id.toString() !== patient._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(bill);
  } catch (error) {
    console.error('Get billing record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/billing
// @desc    Create new billing record
// @access  Private (Admin, Doctor)
router.post('/', auth, authorize('admin', 'doctor'), [
  body('patientId').isMongoId(),
  body('items').isArray({ min: 1 }),
  body('items.*.description').notEmpty().trim(),
  body('items.*.category').isIn(['consultation', 'medication', 'procedure', 'room', 'lab', 'other']),
  body('items.*.quantity').isInt({ min: 1 }),
  body('items.*.unitPrice').isFloat({ min: 0 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { patientId, appointmentId, items, tax = 0, discount = 0, dueDate, notes, insurance } = req.body;

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if appointment exists (if provided)
    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
    }

    // Calculate totals
    const itemsWithTotals = items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice
    }));

    const subtotal = itemsWithTotals.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal + tax - discount;

    const billing = new Billing({
      patient: patientId,
      appointment: appointmentId,
      items: itemsWithTotals,
      subtotal,
      tax,
      discount,
      total,
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      notes,
      insurance,
      createdBy: req.user.id
    });

    await billing.save();

    const populatedBill = await Billing.findById(billing._id)
      .populate('patient', 'patientId')
      .populate('patient.user', 'firstName lastName email phone')
      .populate('appointment', 'appointmentNumber appointmentDate')
      .populate('createdBy', 'firstName lastName');

    res.status(201).json({
      message: 'Billing record created successfully',
      bill: populatedBill
    });
  } catch (error) {
    console.error('Create billing record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/billing/:id
// @desc    Update billing record
// @access  Private (Admin, Doctor)
router.put('/:id', auth, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);
    if (!billing) {
      return res.status(404).json({ message: 'Billing record not found' });
    }

    // Don't allow updates to paid bills
    if (billing.status === 'paid') {
      return res.status(400).json({ message: 'Cannot update paid billing record' });
    }

    const updatedBilling = await Billing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patient', 'patientId')
     .populate('patient.user', 'firstName lastName email phone')
     .populate('appointment', 'appointmentNumber appointmentDate')
     .populate('createdBy', 'firstName lastName');

    res.json({
      message: 'Billing record updated successfully',
      bill: updatedBilling
    });
  } catch (error) {
    console.error('Update billing record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/billing/:id/payment
// @desc    Record payment for billing
// @access  Private
router.post('/:id/payment', auth, [
  body('amount').isFloat({ min: 0.01 }),
  body('method').isIn(['cash', 'card', 'insurance', 'bank_transfer', 'upi', 'other']),
  body('transactionId').optional().isString(),
  body('notes').optional().isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { amount, method, transactionId, notes } = req.body;

    const billing = await Billing.findById(req.params.id);
    if (!billing) {
      return res.status(404).json({ message: 'Billing record not found' });
    }

    // Check permissions
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (!patient || billing.patient.toString() !== patient._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    // Add payment
    const payment = {
      amount,
      method,
      transactionId,
      paymentDate: new Date(),
      notes
    };

    billing.payments.push(payment);

    // Calculate total paid amount
    const totalPaid = billing.payments.reduce((sum, payment) => sum + payment.amount, 0);

    // Update status based on payment
    if (totalPaid >= billing.total) {
      billing.status = 'paid';
    } else if (totalPaid > 0) {
      billing.status = 'partial';
    }

    await billing.save();

    const updatedBill = await Billing.findById(billing._id)
      .populate('patient', 'patientId')
      .populate('patient.user', 'firstName lastName email phone')
      .populate('appointment', 'appointmentNumber appointmentDate')
      .populate('createdBy', 'firstName lastName');

    res.json({
      message: 'Payment recorded successfully',
      bill: updatedBill
    });
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/billing/dashboard
// @desc    Get billing dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    let query = {};

    // Role-based filtering
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (patient) {
        query.patient = patient._id;
      }
    }

    const [
      totalBills,
      totalRevenue,
      pendingBills,
      paidBills,
      monthlyRevenue
    ] = await Promise.all([
      Billing.countDocuments(query),
      Billing.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Billing.countDocuments({ ...query, status: 'pending' }),
      Billing.countDocuments({ ...query, status: 'paid' }),
      Billing.aggregate([
        { 
          $match: { 
            ...query, 
            createdAt: { $gte: startOfMonth, $lte: endOfMonth } 
          } 
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    res.json({
      totalBills,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingBills,
      paidBills,
      monthlyRevenue: monthlyRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Get billing dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/billing/patient/:patientId
// @desc    Get billing records for a specific patient
// @access  Private
router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const query = { patient: patientId };
    if (status) {
      query.status = status;
    }

    // Check permissions
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (!patient || patient._id.toString() !== patientId) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const bills = await Billing.find(query)
      .populate('appointment', 'appointmentNumber appointmentDate')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Billing.countDocuments(query);

    res.json({
      bills,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get patient billing records error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;