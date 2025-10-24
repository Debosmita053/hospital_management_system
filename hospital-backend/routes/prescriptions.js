const express = require('express');
const { body, validationResult } = require('express-validator');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/prescriptions
// @desc    Get all prescriptions
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      doctorId,
      patientId,
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { prescriptionNumber: { $regex: search, $options: 'i' } },
        { diagnosis: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    if (doctorId) {
      query.doctor = doctorId;
    }
    
    if (patientId) {
      query.patient = patientId;
    }

    // Role-based filtering
    if (req.user.role === 'doctor') {
      query.doctor = req.user.id;
    } else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (patient) {
        query.patient = patient._id;
      } else {
        return res.json({ prescriptions: [], totalPages: 0, currentPage: 1, total: 0 });
      }
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const prescriptions = await Prescription.find(query)
      .populate('patient', 'patientId')
      .populate('patient.user', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment', 'appointmentNumber appointmentDate')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Prescription.countDocuments(query);

    res.json({
      prescriptions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/prescriptions/:id
// @desc    Get prescription by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'patientId')
      .populate('patient.user', 'firstName lastName email phone dateOfBirth gender bloodGroup')
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment', 'appointmentNumber appointmentDate reason');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Check permissions
    if (req.user.role === 'doctor' && prescription.doctor._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (!patient || prescription.patient._id.toString() !== patient._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(prescription);
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/prescriptions
// @desc    Create new prescription
// @access  Private (Doctor only)
router.post('/', auth, authorize('doctor'), [
  body('patientId').isMongoId(),
  body('medications').isArray({ min: 1 }),
  body('medications.*.name').notEmpty().trim(),
  body('medications.*.dosage').notEmpty().trim(),
  body('medications.*.frequency').notEmpty().trim(),
  body('medications.*.duration').notEmpty().trim(),
  body('diagnosis').notEmpty().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { patientId, appointmentId, medications, diagnosis, symptoms, notes, followUpRequired, followUpDate } = req.body;

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if appointment exists (if provided)
    if (appointmentId) {
      const Appointment = require('../models/Appointment');
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
    }

    const prescription = new Prescription({
      patient: patientId,
      doctor: req.user.id,
      appointment: appointmentId,
      medications,
      diagnosis,
      symptoms,
      notes,
      followUpRequired: followUpRequired || false,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined
    });

    await prescription.save();

    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate('patient', 'patientId')
      .populate('patient.user', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment', 'appointmentNumber appointmentDate');

    res.status(201).json({
      message: 'Prescription created successfully',
      prescription: populatedPrescription
    });
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/prescriptions/:id
// @desc    Update prescription
// @access  Private (Doctor only)
router.put('/:id', auth, authorize('doctor'), async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Check if doctor has permission
    if (prescription.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Don't allow updates to completed prescriptions
    if (prescription.status === 'completed') {
      return res.status(400).json({ message: 'Cannot update completed prescription' });
    }

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patient', 'patientId')
     .populate('patient.user', 'firstName lastName email phone')
     .populate('doctor', 'firstName lastName specialization')
     .populate('appointment', 'appointmentNumber appointmentDate');

    res.json({
      message: 'Prescription updated successfully',
      prescription: updatedPrescription
    });
  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/prescriptions/:id/status
// @desc    Update prescription status
// @access  Private (Doctor, Nurse)
router.put('/:id/status', auth, authorize('doctor', 'nurse'), [
  body('status').isIn(['active', 'completed', 'cancelled']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status } = req.body;

    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Check permissions
    if (req.user.role === 'doctor' && prescription.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    prescription.status = status;
    if (status === 'completed') {
      prescription.endDate = new Date();
    }

    await prescription.save();

    const updatedPrescription = await Prescription.findById(prescription._id)
      .populate('patient', 'patientId')
      .populate('patient.user', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment', 'appointmentNumber appointmentDate');

    res.json({
      message: 'Prescription status updated successfully',
      prescription: updatedPrescription
    });
  } catch (error) {
    console.error('Update prescription status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/prescriptions/patient/:patientId
// @desc    Get prescriptions for a specific patient
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

    const prescriptions = await Prescription.find(query)
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment', 'appointmentNumber appointmentDate')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Prescription.countDocuments(query);

    res.json({
      prescriptions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get patient prescriptions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/prescriptions/dashboard
// @desc    Get prescription dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    let query = {};

    // Role-based filtering
    if (req.user.role === 'doctor') {
      query.doctor = req.user.id;
    } else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (patient) {
        query.patient = patient._id;
      }
    }

    const [
      totalPrescriptions,
      activePrescriptions,
      completedPrescriptions,
      cancelledPrescriptions
    ] = await Promise.all([
      Prescription.countDocuments(query),
      Prescription.countDocuments({ ...query, status: 'active' }),
      Prescription.countDocuments({ ...query, status: 'completed' }),
      Prescription.countDocuments({ ...query, status: 'cancelled' })
    ]);

    res.json({
      totalPrescriptions,
      activePrescriptions,
      completedPrescriptions,
      cancelledPrescriptions
    });
  } catch (error) {
    console.error('Get prescription dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
