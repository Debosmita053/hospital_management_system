const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { validateDepartment, validateRoom, validateObjectId, validatePagination } = require('../middleware/validation');

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', validatePagination, getUsers);
router.get('/users/:id', validateObjectId('id'), getUserById);
router.put('/users/:id', validateObjectId('id'), updateUser);
router.delete('/users/:id', validateObjectId('id'), deleteUser);

// Department management
router.get('/departments', getDepartments);
router.post('/departments', validateDepartment, createDepartment);

// Room management
router.get('/rooms', getRooms);
router.post('/rooms', validateRoom, createRoom);

// Reports
router.get('/reports', getReports);

module.exports = router;
