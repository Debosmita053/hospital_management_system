const express = require('express');
const router = express.Router();
const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAvailableSlots
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');
const { validateAppointment, validateObjectId, validatePagination } = require('../middleware/validation');

// All routes are protected
router.use(protect);

// Get appointments
router.get('/', validatePagination, getAppointments);

// Get available time slots
router.get('/available-slots', getAvailableSlots);

// Get appointment by ID
router.get('/:id', validateObjectId('id'), getAppointmentById);

// Create appointment
router.post('/', validateAppointment, createAppointment);

// Update appointment
router.put('/:id', validateObjectId('id'), updateAppointment);

// Delete appointment
router.delete('/:id', validateObjectId('id'), deleteAppointment);

module.exports = router;
