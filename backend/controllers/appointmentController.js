const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Department = require('../models/Department');
const Room = require('../models/Room');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const doctor = req.query.doctor;
    const patient = req.query.patient;
    const date = req.query.date;
    const type = req.query.type;

    const query = {};

    // Role-based filtering
    if (req.user.role === 'doctor') {
      query.doctor = req.user.id;
    } else if (req.user.role === 'patient') {
      query.patient = req.user.id;
    }

    if (status) query.status = status;
    if (doctor) query.doctor = doctor;
    if (patient) query.patient = patient;
    if (type) query.type = type;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName email specialization')
      .populate('department', 'name')
      .populate('room', 'roomNumber roomType')
      .sort({ appointmentDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: {
        appointments,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName email phone dateOfBirth gender bloodGroup')
      .populate('doctor', 'firstName lastName email specialization consultationFee')
      .populate('department', 'name location phone')
      .populate('room', 'roomNumber roomType floor')
      .populate('prescription');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (req.user.role === 'patient' && appointment.patient._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      department,
      appointmentDate,
      appointmentTime,
      duration,
      type,
      reason,
      symptoms,
      room,
      isUrgent
    } = req.body;

    // Check if doctor is available at the requested time
    const existingAppointment = await Appointment.findOne({
      doctor,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available at the requested time'
      });
    }

    const appointment = await Appointment.create({
      patient,
      doctor,
      department,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      duration,
      type,
      reason,
      symptoms,
      room,
      isUrgent,
      createdBy: req.user.id
    });

    await appointment.populate([
      { path: 'patient', select: 'firstName lastName email phone' },
      { path: 'doctor', select: 'firstName lastName email specialization' },
      { path: 'department', select: 'name location' },
      { path: 'room', select: 'roomNumber roomType' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const {
      appointmentDate,
      appointmentTime,
      duration,
      status,
      reason,
      symptoms,
      diagnosis,
      treatment,
      notes,
      room
    } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (appointmentDate) appointment.appointmentDate = new Date(appointmentDate);
    if (appointmentTime) appointment.appointmentTime = appointmentTime;
    if (duration) appointment.duration = duration;
    if (status) appointment.status = status;
    if (reason) appointment.reason = reason;
    if (symptoms) appointment.symptoms = symptoms;
    if (diagnosis) appointment.diagnosis = diagnosis;
    if (treatment) appointment.treatment = treatment;
    if (notes) appointment.notes = notes;
    if (room) appointment.room = room;

    await appointment.save();

    await appointment.populate([
      { path: 'patient', select: 'firstName lastName email phone' },
      { path: 'doctor', select: 'firstName lastName email specialization' },
      { path: 'department', select: 'name location' },
      { path: 'room', select: 'roomNumber roomType' }
    ]);

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Only allow deletion of scheduled appointments
    if (appointment.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete appointment that is not scheduled'
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get available time slots for a doctor
// @route   GET /api/appointments/available-slots
// @access  Private
const getAvailableSlots = async (req, res) => {
  try {
    const { doctor, date } = req.query;

    if (!doctor || !date) {
      return res.status(400).json({
        success: false,
        message: 'Doctor and date are required'
      });
    }

    const appointmentDate = new Date(date);
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get existing appointments for the doctor on the given date
    const existingAppointments = await Appointment.find({
      doctor,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['scheduled', 'confirmed'] }
    }).select('appointmentTime duration');

    // Generate available time slots (9 AM to 5 PM, 30-minute intervals)
    const availableSlots = [];
    const startHour = 9;
    const endHour = 17;
    const interval = 30; // minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Check if this slot is available
        const isBooked = existingAppointments.some(apt => {
          const aptTime = apt.appointmentTime;
          const aptStart = new Date(`2000-01-01T${aptTime}`);
          const slotStart = new Date(`2000-01-01T${timeString}`);
          const slotEnd = new Date(slotStart.getTime() + interval * 60000);
          const aptEnd = new Date(aptStart.getTime() + (apt.duration || 30) * 60000);
          
          return (slotStart < aptEnd && slotEnd > aptStart);
        });

        if (!isBooked) {
          availableSlots.push(timeString);
        }
      }
    }

    res.json({
      success: true,
      data: availableSlots
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAvailableSlots
};
