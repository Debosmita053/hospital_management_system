const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/staff
// @desc    Get all staff members
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      role, 
      department,
      isActive = true,
      sortBy = 'firstName', 
      sortOrder = 'asc' 
    } = req.query;
    
    const query = { 
      role: { $in: ['doctor', 'nurse', 'admin'] },
      isActive: isActive === 'true'
    };
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (department) {
      query.department = department;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const staff = await User.find(query)
      .populate('department', 'name')
      .select('-password')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      staff,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/staff/:id
// @desc    Get staff member by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const staff = await User.findById(req.params.id)
      .populate('department', 'name description')
      .select('-password');

    if (!staff || !['doctor', 'nurse', 'admin'].includes(staff.role)) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.json(staff);
  } catch (error) {
    console.error('Get staff member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/staff
// @desc    Create new staff member
// @access  Private (Admin only)
router.post('/', auth, authorize('admin'), [
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone(),
  body('role').isIn(['doctor', 'nurse', 'admin']),
  body('password').isLength({ min: 6 }),
  body('department').optional().isMongoId(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, firstName, lastName, phone, role, department, ...roleSpecificData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if department exists (if provided)
    if (department) {
      const Department = require('../models/Department');
      const departmentExists = await Department.findById(department);
      if (!departmentExists) {
        return res.status(404).json({ message: 'Department not found' });
      }
    }

    const staff = new User({
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      department,
      ...roleSpecificData
    });

    await staff.save();

    const populatedStaff = await User.findById(staff._id)
      .populate('department', 'name')
      .select('-password');

    res.status(201).json({
      message: 'Staff member created successfully',
      staff: populatedStaff
    });
  } catch (error) {
    console.error('Create staff member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/staff/:id
// @desc    Update staff member
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);
    if (!staff || !['doctor', 'nurse', 'admin'].includes(staff.role)) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Check permissions
    if (req.user.role === 'admin' || req.user.id === req.params.id) {
      // Admin can update anyone, staff can update themselves
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedStaff = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('department', 'name')
     .select('-password');

    res.json({
      message: 'Staff member updated successfully',
      staff: updatedStaff
    });
  } catch (error) {
    console.error('Update staff member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/staff/:id
// @desc    Delete staff member
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);
    if (!staff || !['doctor', 'nurse', 'admin'].includes(staff.role)) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Delete staff member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/staff/:id/status
// @desc    Update staff member status
// @access  Private (Admin only)
router.put('/:id/status', auth, authorize('admin'), [
  body('isActive').isBoolean(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { isActive } = req.body;

    const staff = await User.findById(req.params.id);
    if (!staff || !['doctor', 'nurse', 'admin'].includes(staff.role)) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    staff.isActive = isActive;
    await staff.save();

    res.json({
      message: `Staff member ${isActive ? 'activated' : 'deactivated'} successfully`,
      staff: {
        id: staff._id,
        name: `${staff.firstName} ${staff.lastName}`,
        isActive: staff.isActive
      }
    });
  } catch (error) {
    console.error('Update staff status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/staff/dashboard
// @desc    Get staff dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const [
      totalStaff,
      activeStaff,
      doctors,
      nurses,
      admins
    ] = await Promise.all([
      User.countDocuments({ role: { $in: ['doctor', 'nurse', 'admin'] } }),
      User.countDocuments({ role: { $in: ['doctor', 'nurse', 'admin'] }, isActive: true }),
      User.countDocuments({ role: 'doctor', isActive: true }),
      User.countDocuments({ role: 'nurse', isActive: true }),
      User.countDocuments({ role: 'admin', isActive: true })
    ]);

    res.json({
      totalStaff,
      activeStaff,
      doctors,
      nurses,
      admins
    });
  } catch (error) {
    console.error('Get staff dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

