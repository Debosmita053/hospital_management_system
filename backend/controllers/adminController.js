const User = require('../models/User');
const Department = require('../models/Department');
const Room = require('../models/Room');
const Appointment = require('../models/Appointment');
const Billing = require('../models/Billing');
const Medicine = require('../models/Medicine');
const MedicalRecord = require('../models/MedicalRecord');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalDepartments,
      totalRooms,
      totalBilling,
      todayAppointments,
      pendingAppointments
    ] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'doctor' }),
      Appointment.countDocuments(),
      Department.countDocuments(),
      Room.countDocuments(),
      Billing.countDocuments(),
      Appointment.countDocuments({
        appointmentDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }),
      Appointment.countDocuments({ status: 'scheduled' })
    ]);

    // Calculate revenue for current month
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const monthlyRevenue = await Billing.aggregate([
      {
        $match: {
          status: 'paid',
          createdAt: { $gte: currentMonth, $lt: nextMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        totalDepartments,
        totalRooms,
        totalBilling,
        todayAppointments,
        pendingAppointments,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all users with pagination and filtering
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role;
    const search = req.query.search;
    const isActive = req.query.isActive;

    const query = {};
    
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, phone, isActive, specialization, licenseNumber, experience, consultationFee } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (role) user.role = role;
    if (phone) user.phone = phone;
    if (isActive !== undefined) user.isActive = isActive;
    if (specialization) user.specialization = specialization;
    if (licenseNumber) user.licenseNumber = licenseNumber;
    if (experience !== undefined) user.experience = experience;
    if (consultationFee !== undefined) user.consultationFee = consultationFee;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has appointments or other related data
    const hasAppointments = await Appointment.findOne({ 
      $or: [{ patient: user._id }, { doctor: user._id }] 
    });

    if (hasAppointments) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with existing appointments'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all departments
// @route   GET /api/admin/departments
// @access  Private/Admin
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('headOfDepartment', 'firstName lastName email')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create department
// @route   POST /api/admin/departments
// @access  Private/Admin
const createDepartment = async (req, res) => {
  try {
    const { name, description, headOfDepartment, location, phone, email, services } = req.body;

    const department = await Department.create({
      name,
      description,
      headOfDepartment,
      location,
      phone,
      email,
      services
    });

    await department.populate('headOfDepartment', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department
    });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all rooms
// @route   GET /api/admin/rooms
// @access  Private/Admin
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('department', 'name')
      .sort({ floor: 1, roomNumber: 1 });

    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create room
// @route   POST /api/admin/rooms
// @access  Private/Admin
const createRoom = async (req, res) => {
  try {
    const { roomNumber, roomType, department, floor, capacity, amenities, pricePerDay } = req.body;

    const room = await Room.create({
      roomNumber,
      roomType,
      department,
      floor,
      capacity,
      amenities,
      pricePerDay
    });

    await room.populate('department', 'name');

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get reports data
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReports = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    let start = new Date(startDate) || new Date();
    let end = new Date(endDate) || new Date();
    
    // Set time to start and end of day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    let reportData = {};

    switch (type) {
      case 'appointments':
        reportData = await Appointment.aggregate([
          {
            $match: {
              appointmentDate: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]);
        break;

      case 'revenue':
        reportData = await Billing.aggregate([
          {
            $match: {
              status: 'paid',
              createdAt: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$totalAmount' },
              count: { $sum: 1 }
            }
          }
        ]);
        break;

      case 'patients':
        reportData = await User.aggregate([
          {
            $match: {
              role: 'patient',
              createdAt: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 }
            }
          }
        ]);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    res.json({
      success: true,
      data: reportData
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDepartments,
  createDepartment,
  getRooms,
  createRoom,
  getReports
};
