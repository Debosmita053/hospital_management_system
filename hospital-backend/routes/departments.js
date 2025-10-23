const express = require('express');
const { body, validationResult } = require('express-validator');
const Department = require('../models/Department');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/departments
// @desc    Get all departments
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isActive = true } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const departments = await Department.find(query)
      .populate('head', 'firstName lastName specialization')
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Department.countDocuments(query);

    res.json({
      departments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/departments/:id
// @desc    Get department by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('head', 'firstName lastName specialization email phone')
      .populate('services');

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json(department);
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/departments
// @desc    Create new department
// @access  Private (Admin only)
router.post('/', auth, authorize('admin'), [
  body('name').notEmpty().trim(),
  body('description').optional().trim(),
  body('head').optional().isMongoId(),
  body('location.floor').optional().isString(),
  body('location.building').optional().isString(),
  body('location.room').optional().isString(),
  body('contactInfo.phone').optional().isMobilePhone(),
  body('contactInfo.email').optional().isEmail(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { head, ...departmentData } = req.body;

    // Check if head exists and is a doctor
    if (head) {
      const headUser = await User.findById(head);
      if (!headUser || headUser.role !== 'doctor') {
        return res.status(400).json({ message: 'Head must be a valid doctor' });
      }
    }

    const department = new Department(departmentData);
    await department.save();

    const populatedDepartment = await Department.findById(department._id)
      .populate('head', 'firstName lastName specialization');

    res.status(201).json({
      message: 'Department created successfully',
      department: populatedDepartment
    });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/departments/:id
// @desc    Update department
// @access  Private (Admin only)
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const { head, ...updateData } = req.body;

    // Check if head exists and is a doctor
    if (head) {
      const headUser = await User.findById(head);
      if (!headUser || headUser.role !== 'doctor') {
        return res.status(400).json({ message: 'Head must be a valid doctor' });
      }
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { ...updateData, head },
      { new: true, runValidators: true }
    ).populate('head', 'firstName lastName specialization');

    res.json({
      message: 'Department updated successfully',
      department: updatedDepartment
    });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/departments/:id
// @desc    Delete department
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if department has staff
    const staffCount = await User.countDocuments({ department: req.params.id });
    if (staffCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete department with assigned staff. Please reassign staff first.' 
      });
    }

    await Department.findByIdAndDelete(req.params.id);

    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/departments/:id/staff
// @desc    Get department staff
// @access  Private
router.get('/:id/staff', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;

    const query = { department: req.params.id };
    if (role) {
      query.role = role;
    }

    const staff = await User.find(query)
      .select('-password')
      .populate('department', 'name')
      .sort({ firstName: 1 })
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
    console.error('Get department staff error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/departments/:id/services
// @desc    Add service to department
// @access  Private (Admin only)
router.post('/:id/services', auth, authorize('admin'), [
  body('name').notEmpty().trim(),
  body('description').optional().trim(),
  body('price').isFloat({ min: 0 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    department.services.push(req.body);
    await department.save();

    res.json({
      message: 'Service added successfully',
      department
    });
  } catch (error) {
    console.error('Add service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/departments/:id/services/:serviceId
// @desc    Update department service
// @access  Private (Admin only)
router.put('/:id/services/:serviceId', auth, authorize('admin'), async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const service = department.services.id(req.params.serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    Object.assign(service, req.body);
    await department.save();

    res.json({
      message: 'Service updated successfully',
      department
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/departments/:id/services/:serviceId
// @desc    Delete department service
// @access  Private (Admin only)
router.delete('/:id/services/:serviceId', auth, authorize('admin'), async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const service = department.services.id(req.params.serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.remove();
    await department.save();

    res.json({
      message: 'Service deleted successfully',
      department
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;