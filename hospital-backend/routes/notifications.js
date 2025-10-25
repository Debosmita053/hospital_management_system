const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Placeholder for notifications - can be expanded with a Notification model
    const notifications = [];
    
    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
