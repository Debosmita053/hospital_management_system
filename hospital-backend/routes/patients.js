const express = require('express');
const { body, validationResult } = require('express-validator');
const Patient = require('../models/Patient');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/patients
// @desc    Get all patients
// @access  Private (Admin, Doctor, Nurse)
router.get('/', auth, authorize('admin', 'doctor', 'nurse'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { patientId: { $regex: search, $options: 'i' } },
        { medicalRecordNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const patients = await Patient.find(query)
      .populate('user', 'firstName lastName email phone dateOfBirth gender bloodGroup')
      .populate('assignedDoctor', 'firstName lastName specialization')
      .populate('assignedRoom', 'roomNumber roomType')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Patient.countDocuments(query);

    res.json({
      patients,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/patients/:id
// @desc    Get patient by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('user', 'firstName lastName email phone dateOfBirth gender bloodGroup address emergencyContact')
      .populate('assignedDoctor', 'firstName lastName specialization')
      .populate('assignedRoom', 'roomNumber roomType floor')
      .populate('diagnosis.diagnosedBy', 'firstName lastName');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if user has permission to view this patient
    if (req.user.role === 'doctor' && patient.assignedDoctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/patients
// @desc    Create new patient
// @access  Private (Admin, Doctor)
router.post('/', auth, authorize('admin', 'doctor'), [
  body('userData.firstName').notEmpty().trim(),
  body('userData.lastName').notEmpty().trim(),
  body('userData.email').isEmail().normalizeEmail(),
  body('userData.phone').isMobilePhone(),
  body('userData.dateOfBirth').isISO8601(),
  body('userData.gender').isIn(['male', 'female', 'other']),
  body('userData.bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { userData, patientData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user first
    const user = new User({
      ...userData,
      role: 'patient',
      password: 'temp123' // Temporary password, should be changed on first login
    });
    await user.save();

    // Create patient record
    const patient = new Patient({
      user: user._id,
      ...patientData,
      createdBy: req.user.id
    });
    await patient.save();

    const populatedPatient = await Patient.findById(patient._id)
      .populate('user', 'firstName lastName email phone dateOfBirth gender bloodGroup')
      .populate('assignedDoctor', 'firstName lastName specialization');

    res.status(201).json({
      message: 'Patient created successfully',
      patient: populatedPatient
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/patients/:id
// @desc    Update patient
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check permissions
    if (req.user.role === 'doctor' && patient.assignedDoctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName email phone dateOfBirth gender bloodGroup')
     .populate('assignedDoctor', 'firstName lastName specialization');

    res.json({
      message: 'Patient updated successfully',
      patient: updatedPatient
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/patients/:id
// @desc    Delete patient
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    await Patient.findByIdAndDelete(req.params.id);
    await User.findByIdAndDelete(patient.user);

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/patients/:id/assign-doctor
// @desc    Assign doctor to patient
// @access  Private (Admin, Doctor)
router.post('/:id/assign-doctor', auth, authorize('admin', 'doctor'), [
  body('doctorId').isMongoId(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { doctorId } = req.body;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(400).json({ message: 'Invalid doctor' });
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { assignedDoctor: doctorId },
      { new: true }
    ).populate('user', 'firstName lastName email phone')
     .populate('assignedDoctor', 'firstName lastName specialization');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({
      message: 'Doctor assigned successfully',
      patient
    });
  } catch (error) {
    console.error('Assign doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/patients/:id/assign-room
// @desc    Assign room to patient
// @access  Private (Admin, Nurse)
router.post('/:id/assign-room', auth, authorize('admin', 'nurse'), [
  body('roomId').isMongoId(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { roomId } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { 
        assignedRoom: roomId,
        status: 'admitted',
        admissionDate: new Date()
      },
      { new: true }
    ).populate('user', 'firstName lastName email phone')
     .populate('assignedRoom', 'roomNumber roomType floor');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({
      message: 'Room assigned successfully',
      patient
    });
  } catch (error) {
    console.error('Assign room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/patients/:id/medical-history
// @desc    Get patient medical history
// @access  Private
router.get('/:id/medical-history', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check permissions
    if (req.user.role === 'doctor' && patient.assignedDoctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const MedicalRecord = require('../models/MedicalRecord');
    const Appointment = require('../models/Appointment');

    const [medicalRecords, appointments] = await Promise.all([
      MedicalRecord.find({ patient: req.params.id })
        .populate('doctor', 'firstName lastName specialization')
        .sort({ createdAt: -1 }),
      Appointment.find({ patient: req.params.id })
        .populate('doctor', 'firstName lastName specialization')
        .sort({ appointmentDate: -1 })
    ]);

    res.json({
      medicalRecords,
      appointments,
      patient: {
        id: patient._id,
        patientId: patient.patientId,
        medicalRecordNumber: patient.medicalRecordNumber,
        status: patient.status,
        diagnosis: patient.diagnosis,
        allergies: patient.allergies,
        medications: patient.medications
      }
    });
  } catch (error) {
    console.error('Get medical history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;