const Billing = require('../models/Billing');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get all bills
// @route   GET /api/billing
// @access  Private
const getBills = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const patient = req.query.patient;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const query = {};

    // Role-based filtering
    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    }

    if (status) query.status = status;
    if (patient) query.patient = patient;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bills = await Billing.find(query)
      .populate('patient', 'firstName lastName email phone')
      .populate('appointment', 'appointmentDate appointmentTime')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Billing.countDocuments(query);

    res.json({
      success: true,
      data: {
        bills,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get bills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get bill by ID
// @route   GET /api/billing/:id
// @access  Private
const getBillById = async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.id)
      .populate('patient', 'firstName lastName email phone address')
      .populate('appointment', 'appointmentDate appointmentTime reason')
      .populate('createdBy', 'firstName lastName');

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'patient' && bill.patient._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: bill
    });
  } catch (error) {
    console.error('Get bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create bill
// @route   POST /api/billing
// @access  Private/Admin
const createBill = async (req, res) => {
  try {
    const {
      patient,
      appointment,
      items,
      tax,
      discount,
      dueDate,
      insurance,
      notes
    } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required'
      });
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => {
      item.totalPrice = item.quantity * item.unitPrice;
      return sum + item.totalPrice;
    }, 0);

    const bill = await Billing.create({
      patient,
      appointment,
      items,
      subtotal,
      tax: tax || 0,
      discount: discount || 0,
      dueDate: new Date(dueDate),
      insurance,
      notes,
      createdBy: req.user.id
    });

    await bill.populate([
      { path: 'patient', select: 'firstName lastName email phone' },
      { path: 'appointment', select: 'appointmentDate appointmentTime' },
      { path: 'createdBy', select: 'firstName lastName' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      data: bill
    });
  } catch (error) {
    console.error('Create bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update bill
// @route   PUT /api/billing/:id
// @access  Private/Admin
const updateBill = async (req, res) => {
  try {
    const {
      items,
      tax,
      discount,
      status,
      paymentMethod,
      paymentDate,
      dueDate,
      insurance,
      notes
    } = req.body;

    const bill = await Billing.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    if (items) {
      bill.items = items;
      bill.subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    }
    if (tax !== undefined) bill.tax = tax;
    if (discount !== undefined) bill.discount = discount;
    if (status) bill.status = status;
    if (paymentMethod) bill.paymentMethod = paymentMethod;
    if (paymentDate) bill.paymentDate = new Date(paymentDate);
    if (dueDate) bill.dueDate = new Date(dueDate);
    if (insurance) bill.insurance = insurance;
    if (notes) bill.notes = notes;

    await bill.save();

    await bill.populate([
      { path: 'patient', select: 'firstName lastName email phone' },
      { path: 'appointment', select: 'appointmentDate appointmentTime' },
      { path: 'createdBy', select: 'firstName lastName' }
    ]);

    res.json({
      success: true,
      message: 'Bill updated successfully',
      data: bill
    });
  } catch (error) {
    console.error('Update bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Process payment
// @route   POST /api/billing/:id/payment
// @access  Private
const processPayment = async (req, res) => {
  try {
    const { paymentMethod, amount, notes } = req.body;

    const bill = await Billing.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    if (bill.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Bill is already paid'
      });
    }

    if (amount && amount < bill.totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount cannot be less than total amount'
      });
    }

    bill.status = 'paid';
    bill.paymentMethod = paymentMethod;
    bill.paymentDate = new Date();
    if (notes) bill.notes = notes;

    await bill.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: bill
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get billing statistics
// @route   GET /api/billing/stats
// @access  Private/Admin
const getBillingStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const [
      totalBills,
      paidBills,
      pendingBills,
      totalRevenue,
      monthlyRevenue
    ] = await Promise.all([
      Billing.countDocuments(dateFilter),
      Billing.countDocuments({ ...dateFilter, status: 'paid' }),
      Billing.countDocuments({ ...dateFilter, status: 'pending' }),
      Billing.aggregate([
        { $match: { ...dateFilter, status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Billing.aggregate([
        {
          $match: {
            ...dateFilter,
            status: 'paid',
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
            }
          }
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalBills,
        paidBills,
        pendingBills,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get billing stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Generate bill for appointment
// @route   POST /api/billing/generate
// @access  Private/Admin
const generateBillForAppointment = async (req, res) => {
  try {
    const { appointmentId, items } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate('patient')
      .populate('doctor');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if bill already exists for this appointment
    const existingBill = await Billing.findOne({ appointment: appointmentId });
    if (existingBill) {
      return res.status(400).json({
        success: false,
        message: 'Bill already exists for this appointment'
      });
    }

    // Create bill
    const bill = await Billing.create({
      patient: appointment.patient._id,
      appointment: appointmentId,
      items,
      createdBy: req.user.id
    });

    await bill.populate([
      { path: 'patient', select: 'firstName lastName email phone' },
      { path: 'appointment', select: 'appointmentDate appointmentTime' },
      { path: 'createdBy', select: 'firstName lastName' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Bill generated successfully',
      data: bill
    });
  } catch (error) {
    console.error('Generate bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getBills,
  getBillById,
  createBill,
  updateBill,
  processPayment,
  getBillingStats,
  generateBillForAppointment
};
