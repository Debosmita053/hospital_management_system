const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Billing = require('../models/Billing');

const router = express.Router();

// @route   GET /api/dashboard/admin
// @desc    Get admin dashboard stats
// @access  Private (Admin only)
router.get('/admin', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAppointments = await Appointment.countDocuments({
      date: { $gte: new Date().setHours(0, 0, 0, 0), $lt: new Date().setHours(23, 59, 59, 999) }
    });
    const monthlyRevenue = await Billing.aggregate([
      { $match: { createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalPatients,
      totalDoctors,
      appointmentsToday: totalAppointments,
      monthlyRevenue: monthlyRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/doctor
// @desc    Get doctor dashboard stats
// @access  Private (Doctor only)
router.get('/doctor', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const totalPatients = await Patient.countDocuments({ assignedDoctor: req.user.id });
    const todaysAppointments = await Appointment.countDocuments({
      doctor: req.user.id,
      date: { $gte: new Date().setHours(0, 0, 0, 0), $lt: new Date().setHours(23, 59, 59, 999) }
    });
    const pendingReports = await Appointment.countDocuments({
      doctor: req.user.id,
      status: 'pending'
    });
    const prescriptionsIssued = await require('../models/Prescription').countDocuments({
      doctor: req.user.id,
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    res.json({
      totalPatients,
      todaysAppointments,
      pendingReports,
      prescriptionsIssued
    });
  } catch (error) {
    console.error('Doctor dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/patient
// @desc    Get patient dashboard stats
// @access  Private (Patient only)
router.get('/patient', auth, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const upcomingAppointments = await Appointment.countDocuments({
      patient: req.user.id,
      date: { $gte: new Date() },
      status: 'scheduled'
    });
    const totalBills = await Billing.countDocuments({ patient: req.user.id });
    const pendingBills = await Billing.countDocuments({
      patient: req.user.id,
      status: 'pending'
    });
    const medicalRecords = await require('../models/MedicalRecord').countDocuments({ patient: req.user.id });

    res.json({
      upcomingAppointments,
      totalBills,
      pendingBills,
      medicalRecords
    });
  } catch (error) {
    console.error('Patient dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/nurse
// @desc    Get nurse dashboard stats
// @access  Private (Nurse only)
router.get('/nurse', auth, async (req, res) => {
  try {
    if (req.user.role !== 'nurse') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const assignedPatients = await Patient.countDocuments({ assignedNurse: req.user.id });
    const todaysTasks = await Appointment.countDocuments({
      nurse: req.user.id,
      date: { $gte: new Date().setHours(0, 0, 0, 0), $lt: new Date().setHours(23, 59, 59, 999) }
    });
    const completedTasks = await Appointment.countDocuments({
      nurse: req.user.id,
      status: 'completed',
      date: { $gte: new Date().setHours(0, 0, 0, 0), $lt: new Date().setHours(23, 59, 59, 999) }
    });

    res.json({
      assignedPatients,
      todaysTasks,
      completedTasks
    });
  } catch (error) {
    console.error('Nurse dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
