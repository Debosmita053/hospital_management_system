const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, specialization, department, sortBy = 'firstName', sortOrder = 'asc' } = req.query;
    
    const query = { role: 'doctor', isActive: true };
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }
    
    if (department) {
      query.department = department;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const doctors = await User.find(query)
      .populate('department', 'name')
      .select('-password')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      doctors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get doctor by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id)
      .populate('department', 'name description')
      .select('-password');

    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/doctors
// @desc    Create new doctor
// @access  Private (Admin only)
router.post('/', auth, authorize('admin'), [
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone(),
  body('specialization').notEmpty().trim(),
  body('licenseNumber').notEmpty().trim(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, firstName, lastName, phone, specialization, licenseNumber, department } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if license number already exists
    const existingLicense = await User.findOne({ licenseNumber });
    if (existingLicense) {
      return res.status(400).json({ message: 'License number already exists' });
    }

    const doctor = new User({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: 'doctor',
      specialization,
      licenseNumber,
      department
    });

    await doctor.save();

    const populatedDoctor = await User.findById(doctor._id)
      .populate('department', 'name')
      .select('-password');

    res.status(201).json({
      message: 'Doctor created successfully',
      doctor: populatedDoctor
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/doctors/:id
// @desc    Update doctor
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check permissions
    if (req.user.role === 'doctor' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedDoctor = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('department', 'name')
     .select('-password');

    res.json({
      message: 'Doctor updated successfully',
      doctor: updatedDoctor
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/doctors/:id
// @desc    Delete doctor
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if doctor has assigned patients
    const assignedPatients = await Patient.find({ assignedDoctor: req.params.id });
    if (assignedPatients.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete doctor with assigned patients. Please reassign patients first.' 
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/doctors/:id/patients
// @desc    Get doctor's patients
// @access  Private
router.get('/:id/patients', auth, async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check permissions
    if (req.user.role === 'doctor' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { page = 1, limit = 10, status } = req.query;
    
    const query = { assignedDoctor: req.params.id };
    if (status) {
      query.status = status;
    }

    const patients = await Patient.find(query)
      .populate('user', 'firstName lastName email phone dateOfBirth gender bloodGroup')
      .populate('assignedRoom', 'roomNumber roomType')
      .sort({ createdAt: -1 })
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
    console.error('Get doctor patients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/doctors/:id/appointments
// @desc    Get doctor's appointments
// @access  Private
router.get('/:id/appointments', auth, async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check permissions
    if (req.user.role === 'doctor' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { page = 1, limit = 10, date, status } = req.query;
    
    const query = { doctor: req.params.id };
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }
    
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'patientId')
      .populate('patient.user', 'firstName lastName email phone')
      .populate('department', 'name')
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/doctors/:id/schedule
// @desc    Get doctor's schedule
// @access  Private
router.get('/:id/schedule', auth, async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check permissions
    if (req.user.role === 'doctor' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { startDate, endDate } = req.query;
    
    const query = { 
      doctor: req.params.id,
      status: { $in: ['scheduled', 'confirmed'] }
    };
    
    if (startDate && endDate) {
      query.appointmentDate = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'patientId')
      .populate('patient.user', 'firstName lastName')
      .populate('department', 'name')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    // Group appointments by date
    const schedule = {};
    appointments.forEach(appointment => {
      const date = appointment.appointmentDate.toISOString().split('T')[0];
      if (!schedule[date]) {
        schedule[date] = [];
      }
      schedule[date].push(appointment);
    });

    res.json({
      doctor: {
        id: doctor._id,
        name: `${doctor.firstName} ${doctor.lastName}`,
        specialization: doctor.specialization
      },
      schedule
    });
  } catch (error) {
    console.error('Get doctor schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/doctors/:id/dashboard
// @desc    Get doctor's dashboard data
// @access  Private
router.get('/:id/dashboard', auth, async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check permissions
    if (req.user.role === 'doctor' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const [
      totalPatients,
      todayAppointments,
      pendingAppointments,
      completedAppointments
    ] = await Promise.all([
      Patient.countDocuments({ assignedDoctor: req.params.id }),
      Appointment.countDocuments({ 
        doctor: req.params.id, 
        appointmentDate: { $gte: startOfDay, $lte: endOfDay } 
      }),
      Appointment.countDocuments({ 
        doctor: req.params.id, 
        status: 'scheduled' 
      }),
      Appointment.countDocuments({ 
        doctor: req.params.id, 
        status: 'completed' 
      })
    ]);

    res.json({
      totalPatients,
      todayAppointments,
      pendingAppointments,
      completedAppointments
    });
  } catch (error) {
    console.error('Get doctor dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;