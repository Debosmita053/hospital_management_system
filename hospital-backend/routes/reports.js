const express = require('express');
const { body, validationResult } = require('express-validator');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Billing = require('../models/Billing');
const Room = require('../models/Room');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reports/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalRooms,
      occupiedRooms,
      monthlyRevenue,
      todayAppointments,
      pendingBills
    ] = await Promise.all([
      Patient.countDocuments(),
      User.countDocuments({ role: 'doctor', isActive: true }),
      Appointment.countDocuments(),
      Room.countDocuments({ isActive: true }),
      Room.countDocuments({ isActive: true, availableBeds: { $lt: { $expr: '$bedCount' } } }),
      Billing.aggregate([
        { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth }, status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Appointment.countDocuments({ 
        appointmentDate: { 
          $gte: new Date(today.setHours(0, 0, 0, 0)), 
          $lte: new Date(today.setHours(23, 59, 59, 999)) 
        } 
      }),
      Billing.countDocuments({ status: 'pending' })
    ]);

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalRooms,
      occupiedRooms,
      availableRooms: totalRooms - occupiedRooms,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      todayAppointments,
      pendingBills
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reports/revenue
// @desc    Get revenue report
// @access  Private (Admin only)
router.get('/revenue', auth, authorize('admin'), async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const matchStage = { status: 'paid' };
    if (startDate && endDate) {
      matchStage.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    let groupFormat;
    switch (groupBy) {
      case 'day':
        groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        break;
      case 'month':
        groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        break;
      case 'year':
        groupFormat = { $dateToString: { format: '%Y', date: '$createdAt' } };
        break;
      default:
        groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    }

    const revenue = await Billing.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupFormat,
          totalRevenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ revenue });
  } catch (error) {
    console.error('Get revenue report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reports/patients
// @desc    Get patient report
// @access  Private (Admin only)
router.get('/patients', auth, authorize('admin'), async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (status) {
      matchStage.status = status;
    }

    const patientStats = await Patient.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ patientStats });
  } catch (error) {
    console.error('Get patient report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reports/appointments
// @desc    Get appointment report
// @access  Private (Admin only)
router.get('/appointments', auth, authorize('admin'), async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    const matchStage = {};
    if (startDate && endDate) {
      matchStage.appointmentDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (status) {
      matchStage.status = status;
    }

    const appointmentStats = await Appointment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ appointmentStats });
  } catch (error) {
    console.error('Get appointment report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;