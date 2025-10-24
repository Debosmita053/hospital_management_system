const express = require('express');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Billing = require('../models/Billing');
const Room = require('../models/Room');
const Medicine = require('../models/Medicine');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reports/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Calculate date range based on period
    let startDate, endDate;
    const now = new Date();
    
    switch (period) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        endDate = new Date();
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // Get basic statistics
    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalRevenue,
      roomStats,
      medicineStats
    ] = await Promise.all([
      // Total patients
      Patient.countDocuments(),
      
      // Total doctors
      User.countDocuments({ role: 'doctor', isActive: true }),
      
      // Total appointments in period
      Appointment.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate }
      }),
      
      // Total revenue in period
      Billing.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            paidRevenue: { $sum: '$paidAmount' }
          }
        }
      ]),
      
      // Room statistics
      Room.aggregate([
        {
          $group: {
            _id: null,
            totalRooms: { $sum: 1 },
            totalBeds: { $sum: '$totalBeds' },
            occupiedBeds: { $sum: '$occupiedBeds' },
            availableBeds: { $sum: '$availableBeds' }
          }
        }
      ]),
      
      // Medicine statistics
      Medicine.aggregate([
        {
          $group: {
            _id: null,
            totalMedicines: { $sum: 1 },
            totalStock: { $sum: '$currentStock' },
            totalValue: { $sum: { $multiply: ['$currentStock', '$price'] } },
            lowStock: {
              $sum: { $cond: [{ $lte: ['$currentStock', '$minimumStock'] }, 1, 0] }
            }
          }
        }
      ])
    ]);

    // Get patient status breakdown
    const patientStatusStats = await Patient.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get appointment status breakdown
    const appointmentStatusStats = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get department statistics
    const departmentStats = await User.aggregate([
      { $match: { role: 'doctor', isActive: true } },
      {
        $group: {
          _id: '$department',
          doctorCount: { $sum: 1 }
        }
      }
    ]);

    // Get recent activities
    const recentPatients = await Patient.find()
      .populate('assignedDoctor', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentAppointments = await Appointment.find()
      .populate('patient', 'firstName lastName patientId')
      .populate('doctor', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        period,
        startDate,
        endDate,
        overview: {
          totalPatients,
          totalDoctors,
          totalAppointments,
          totalRevenue: totalRevenue[0]?.totalRevenue || 0,
          paidRevenue: totalRevenue[0]?.paidRevenue || 0
        },
        patientStatus: patientStatusStats,
        appointmentStatus: appointmentStatusStats,
        departments: departmentStats,
        rooms: roomStats[0] || {
          totalRooms: 0,
          totalBeds: 0,
          occupiedBeds: 0,
          availableBeds: 0
        },
        medicines: medicineStats[0] || {
          totalMedicines: 0,
          totalStock: 0,
          totalValue: 0,
          lowStock: 0
        },
        recentActivities: {
          patients: recentPatients,
          appointments: recentAppointments
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

// @route   GET /api/reports/patients
// @desc    Get patient reports
// @access  Private (Admin)
router.get('/patients', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      status, 
      department,
      groupBy = 'month' 
    } = req.query;

    const filter = {};
    
    if (startDate && endDate) {
      filter.createdAt = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }
    
    if (status) {
      filter.status = status;
    }

    // Get patient statistics
    const patientStats = await Patient.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          admitted: {
            $sum: { $cond: [{ $eq: ['$status', 'admitted'] }, 1, 0] }
          },
          outpatient: {
            $sum: { $cond: [{ $eq: ['$status', 'outpatient'] }, 1, 0] }
          },
          discharged: {
            $sum: { $cond: [{ $eq: ['$status', 'discharged'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get patients by department
    const patientsByDepartment = await Patient.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedDoctor',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      { $unwind: { path: '$doctor', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$doctor.department',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get age distribution
    const ageDistribution = await Patient.aggregate([
      { $match: filter },
      {
        $addFields: {
          age: {
            $divide: [
              { $subtract: [new Date(), '$dateOfBirth'] },
              31557600000 // milliseconds in a year
            ]
          }
        }
      },
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [0, 18, 30, 45, 60, 100],
          default: 'Other',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    // Get gender distribution
    const genderDistribution = await Patient.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: patientStats[0] || {
          total: 0,
          admitted: 0,
          outpatient: 0,
          discharged: 0
        },
        byDepartment: patientsByDepartment,
        ageDistribution,
        genderDistribution
      }
    });
  } catch (error) {
    console.error('Get patient reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient reports',
      error: error.message
    });
  }
});

// @route   GET /api/reports/appointments
// @desc    Get appointment reports
// @access  Private (Admin)
router.get('/appointments', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      status, 
      department,
      doctor 
    } = req.query;

    const filter = {};
    
    if (startDate && endDate) {
      filter.appointmentDate = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (department) {
      filter.department = department;
    }
    
    if (doctor) {
      filter.doctor = doctor;
    }

    // Get appointment statistics
    const appointmentStats = await Appointment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          scheduled: {
            $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] }
          },
          confirmed: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          totalRevenue: { $sum: '$charges.totalAmount' }
        }
      }
    ]);

    // Get appointments by department
    const appointmentsByDepartment = await Appointment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          revenue: { $sum: '$charges.totalAmount' }
        }
      }
    ]);

    // Get appointments by doctor
    const appointmentsByDoctor = await Appointment.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'doctor',
          foreignField: '_id',
          as: 'doctorInfo'
        }
      },
      { $unwind: '$doctorInfo' },
      {
        $group: {
          _id: {
            doctorId: '$doctor',
            doctorName: { $concat: ['$doctorInfo.firstName', ' ', '$doctorInfo.lastName'] }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$charges.totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: appointmentStats[0] || {
          total: 0,
          scheduled: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
          totalRevenue: 0
        },
        byDepartment: appointmentsByDepartment,
        byDoctor: appointmentsByDoctor
      }
    });
  } catch (error) {
    console.error('Get appointment reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment reports',
      error: error.message
    });
  }
});

// @route   GET /api/reports/revenue
// @desc    Get revenue reports
// @access  Private (Admin)
router.get('/revenue', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      groupBy = 'month' 
    } = req.query;

    const filter = {};
    
    if (startDate && endDate) {
      filter.createdAt = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    // Get revenue statistics
    const revenueStats = await Billing.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          paidRevenue: { $sum: '$paidAmount' },
          pendingRevenue: { $sum: { $subtract: ['$totalAmount', '$paidAmount'] } },
          totalBills: { $sum: 1 },
          paidBills: {
            $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] }
          },
          pendingBills: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          overdueBills: {
            $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get revenue by payment method
    const revenueByPaymentMethod = await Billing.aggregate([
      { $match: filter },
      { $unwind: '$payments' },
      {
        $group: {
          _id: '$payments.paymentMethod',
          count: { $sum: 1 },
          amount: { $sum: '$payments.amount' }
        }
      }
    ]);

    // Get revenue by department
    const revenueByDepartment = await Billing.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'appointments',
          localField: 'appointment',
          foreignField: '_id',
          as: 'appointmentInfo'
        }
      },
      { $unwind: { path: '$appointmentInfo', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$appointmentInfo.department',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: revenueStats[0] || {
          totalRevenue: 0,
          paidRevenue: 0,
          pendingRevenue: 0,
          totalBills: 0,
          paidBills: 0,
          pendingBills: 0,
          overdueBills: 0
        },
        byPaymentMethod: revenueByPaymentMethod,
        byDepartment: revenueByDepartment
      }
    });
  } catch (error) {
    console.error('Get revenue reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue reports',
      error: error.message
    });
  }
});

// @route   GET /api/reports/doctors
// @desc    Get doctor performance reports
// @access  Private (Admin)
router.get('/doctors', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      department 
    } = req.query;

    const filter = {};
    
    if (startDate && endDate) {
      filter.createdAt = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }
    
    if (department) {
      filter.department = department;
    }

    // Get doctor performance
    const doctorPerformance = await Appointment.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'doctor',
          foreignField: '_id',
          as: 'doctorInfo'
        }
      },
      { $unwind: '$doctorInfo' },
      {
        $group: {
          _id: {
            doctorId: '$doctor',
            doctorName: { $concat: ['$doctorInfo.firstName', ' ', '$doctorInfo.lastName'] },
            department: '$doctorInfo.department',
            specialization: '$doctorInfo.specialization'
          },
          totalAppointments: { $sum: 1 },
          completedAppointments: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelledAppointments: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          totalRevenue: { $sum: '$charges.totalAmount' },
          avgConsultationFee: { $avg: '$charges.consultationFee' }
        }
      },
      {
        $addFields: {
          completionRate: {
            $multiply: [
              { $divide: ['$completedAppointments', '$totalAppointments'] },
              100
            ]
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: doctorPerformance
    });
  } catch (error) {
    console.error('Get doctor reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor reports',
      error: error.message
    });
  }
});

// @route   GET /api/reports/export
// @desc    Export reports data
// @access  Private (Admin)
router.get('/export', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { type, format = 'json', startDate, endDate } = req.query;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Report type is required'
      });
    }

    const filter = {};
    if (startDate && endDate) {
      filter.createdAt = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    let data;
    let filename;

    switch (type) {
      case 'patients':
        data = await Patient.find(filter)
          .populate('assignedDoctor', 'firstName lastName specialization')
          .lean();
        filename = 'patients_report';
        break;
        
      case 'appointments':
        data = await Appointment.find(filter)
          .populate('patient', 'firstName lastName patientId')
          .populate('doctor', 'firstName lastName specialization')
          .lean();
        filename = 'appointments_report';
        break;
        
      case 'billing':
        data = await Billing.find(filter)
          .populate('patient', 'firstName lastName patientId')
          .populate('appointment', 'appointmentId appointmentDate')
          .lean();
        filename = 'billing_report';
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
      res.json({
        success: true,
        data,
        exportedAt: new Date().toISOString(),
        totalRecords: data.length
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Only JSON format is currently supported'
      });
    }
  } catch (error) {
    console.error('Export reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export reports',
      error: error.message
    });
  }
});

module.exports = router;
