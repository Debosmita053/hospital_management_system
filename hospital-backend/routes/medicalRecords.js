const express = require('express');
const { body, validationResult } = require('express-validator');
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/medical-records
// @desc    Get all medical records
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      type, 
      status,
      patientId,
      doctorId,
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { recordNumber: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { diagnosis: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (patientId) {
      query.patient = patientId;
    }
    
    if (doctorId) {
      query.doctor = doctorId;
    }

    // Role-based filtering
    if (req.user.role === 'doctor') {
      query.doctor = req.user.id;
    } else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (patient) {
        query.patient = patient._id;
      } else {
        return res.json({ records: [], totalPages: 0, currentPage: 1, total: 0 });
      }
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const records = await MedicalRecord.find(query)
      .populate('patient', 'patientId')
      .populate('patient.user', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment', 'appointmentNumber appointmentDate')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MedicalRecord.countDocuments(query);

    res.json({
      records,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get medical records error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/medical-records/:id
// @desc    Get medical record by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'patientId')
      .populate('patient.user', 'firstName lastName email phone dateOfBirth gender bloodGroup')
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment', 'appointmentNumber appointmentDate reason');

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    // Check permissions
    if (req.user.role === 'doctor' && record.doctor._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (!patient || record.patient._id.toString() !== patient._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(record);
  } catch (error) {
    console.error('Get medical record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/medical-records
// @desc    Create new medical record
// @access  Private (Doctor only)
router.post('/', auth, authorize('doctor'), [
  body('patientId').isMongoId(),
  body('type').isIn(['consultation', 'lab_result', 'imaging', 'procedure', 'surgery', 'emergency', 'follow_up']),
  body('title').notEmpty().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { patientId, appointmentId, type, title, ...recordData } = req.body;

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const record = new MedicalRecord({
      patient: patientId,
      doctor: req.user.id,
      appointment: appointmentId,
      type,
      title,
      ...recordData
    });

    await record.save();

    const populatedRecord = await MedicalRecord.findById(record._id)
      .populate('patient', 'patientId')
      .populate('patient.user', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment', 'appointmentNumber appointmentDate');

    res.status(201).json({
      message: 'Medical record created successfully',
      record: populatedRecord
    });
  } catch (error) {
    console.error('Create medical record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/medical-records/:id
// @desc    Update medical record
// @access  Private (Doctor only)
router.put('/:id', auth, authorize('doctor'), async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    // Check if doctor has permission
    if (record.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Don't allow updates to finalized records
    if (record.status === 'finalized') {
      return res.status(400).json({ message: 'Cannot update finalized medical record' });
    }

    const updatedRecord = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patient', 'patientId')
     .populate('patient.user', 'firstName lastName email phone')
     .populate('doctor', 'firstName lastName specialization')
     .populate('appointment', 'appointmentNumber appointmentDate');

    res.json({
      message: 'Medical record updated successfully',
      record: updatedRecord
    });
  } catch (error) {
    console.error('Update medical record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/medical-records/patient/:patientId
// @desc    Get medical records for a specific patient
// @access  Private
router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10, type, status } = req.query;

    const query = { patient: patientId };
    if (type) query.type = type;
    if (status) query.status = status;

    // Check permissions
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (!patient || patient._id.toString() !== patientId) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const records = await MedicalRecord.find(query)
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment', 'appointmentNumber appointmentDate')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MedicalRecord.countDocuments(query);

    res.json({
      records,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get patient medical records error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
