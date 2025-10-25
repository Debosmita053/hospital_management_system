const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/appointments
// @desc    Get all appointments
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      date,
      doctorId, 
      patientId,
      sortBy = 'appointmentDate',
      sortOrder = 'asc'
    } = req.query;

    const query = {};
    
    if (search) {
      query.$or = [
        { appointmentNumber: { $regex: search, $options: 'i' } },
        { reason: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lte: endDate };
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
        return res.json({ appointments: [], totalPages: 0, currentPage: 1, total: 0 });
      }
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const appointments = await Appointment.find(query)
      .populate('patient', 'patientId')
      .populate('patient.user', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization')
      .populate('department', 'name')
      .sort(sortOptions)
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
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'patientId')
      .populate('patient.user', 'firstName lastName email phone dateOfBirth gender bloodGroup')
      .populate('doctor', 'firstName lastName specialization')
      .populate('department', 'name')
      .populate('prescription');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check permissions
    if (req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (!patient || appointment.patient._id.toString() !== patient._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private
router.post('/', auth, [
  body('patientId').isMongoId(),
  body('doctorId').isMongoId(),
  body('departmentId').isMongoId(),
  body('appointmentDate').isISO8601(),
  body('appointmentTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('reason').notEmpty().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { patientId, doctorId, departmentId, appointmentDate, appointmentTime, reason, symptoms, duration = 30 } = req.body;

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check for conflicting appointments
    const appointmentDateTime = new Date(appointmentDate);
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: appointmentDateTime,
      appointmentTime,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: 'Doctor has a conflicting appointment at this time'
      });
    }

    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      department: departmentId,
      appointmentDate: appointmentDateTime,
      appointmentTime,
      duration,
      reason,
      symptoms,
      createdBy: req.user.id
    });

    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'patientId')
      .populate('patient.user', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization')
      .populate('department', 'name');

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: populatedAppointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check permissions
    if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (!patient || appointment.patient.toString() !== patient._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patient', 'patientId')
     .populate('patient.user', 'firstName lastName email phone')
     .populate('doctor', 'firstName lastName specialization')
     .populate('department', 'name');

    res.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check permissions
    if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (!patient || appointment.patient.toString() !== patient._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    // Only allow cancellation of scheduled/confirmed appointments
    if (!['scheduled', 'confirmed'].includes(appointment.status)) {
      return res.status(400).json({ 
        message: 'Only scheduled or confirmed appointments can be cancelled' 
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status
// @access  Private (Doctor, Admin)
router.put('/:id/status', auth, authorize('doctor', 'admin'), [
  body('status').isIn(['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, notes } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if doctor has permission
    if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'patientId')
      .populate('patient.user', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization')
      .populate('department', 'name');

    res.json({
      message: 'Appointment status updated successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/appointments/available-slots
// @desc    Get available appointment slots
// @access  Private
router.get('/available-slots', auth, async (req, res) => {
  try {
    const { doctorId, date, duration = 30 } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ message: 'Doctor ID and date are required' });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointmentDate = new Date(date);
    const startOfDay = new Date(appointmentDate.setHours(9, 0, 0, 0));
    const endOfDay = new Date(appointmentDate.setHours(17, 0, 0, 0));

    // Get existing appointments for the doctor on this date
    const existingAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['scheduled', 'confirmed'] }
    }).select('appointmentTime duration');

    // Generate available time slots (9 AM to 5 PM, 30-minute intervals)
    const availableSlots = [];
    const currentTime = new Date(startOfDay);

    while (currentTime < endOfDay) {
      const timeString = currentTime.toTimeString().slice(0, 5);
      
      // Check if this slot conflicts with existing appointments
      const hasConflict = existingAppointments.some(apt => {
        const aptTime = new Date(`2000-01-01T${apt.appointmentTime}`);
        const slotTime = new Date(`2000-01-01T${timeString}`);
        const aptEndTime = new Date(aptTime.getTime() + apt.duration * 60000);
        
        return (slotTime >= aptTime && slotTime < aptEndTime) ||
               (slotTime.getTime() + duration * 60000 > aptTime && slotTime < aptTime);
      });

      if (!hasConflict) {
        availableSlots.push(timeString);
      }

      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    res.json({
      doctor: {
        id: doctor._id,
        name: `${doctor.firstName} ${doctor.lastName}`,
        specialization: doctor.specialization
      },
      date,
      availableSlots
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/appointments/dashboard
// @desc    Get appointment dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

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
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      cancelledAppointments
    ] = await Promise.all([
      Appointment.countDocuments(query),
      Appointment.countDocuments({ ...query, appointmentDate: { $gte: startOfDay, $lte: endOfDay } }),
      Appointment.countDocuments({ ...query, status: 'scheduled' }),
      Appointment.countDocuments({ ...query, status: 'completed' }),
      Appointment.countDocuments({ ...query, status: 'cancelled' })
    ]);

    res.json({
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      cancelledAppointments
    });
  } catch (error) {
    console.error('Get appointment dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;