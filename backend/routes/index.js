const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const appointmentRoutes = require('./appointments');
const medicineRoutes = require('./medicines');
const billingRoutes = require('./billing');

// Mount routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/medicines', medicineRoutes);
router.use('/billing', billingRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Hospital Management System API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
