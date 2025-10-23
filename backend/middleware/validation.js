const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User validation rules
const validateUser = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .isIn(['admin', 'doctor', 'nurse', 'patient'])
    .withMessage('Role must be one of: admin, doctor, nurse, patient'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be one of: male, female, other'),
  
  handleValidationErrors
];

// Login validation
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Appointment validation
const validateAppointment = [
  body('patient')
    .isMongoId()
    .withMessage('Valid patient ID is required'),
  
  body('doctor')
    .isMongoId()
    .withMessage('Valid doctor ID is required'),
  
  body('department')
    .isMongoId()
    .withMessage('Valid department ID is required'),
  
  body('appointmentDate')
    .isISO8601()
    .withMessage('Valid appointment date is required'),
  
  body('appointmentTime')
    .notEmpty()
    .withMessage('Appointment time is required'),
  
  body('reason')
    .notEmpty()
    .withMessage('Reason for appointment is required')
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters'),
  
  body('type')
    .optional()
    .isIn(['consultation', 'follow-up', 'emergency', 'surgery', 'checkup'])
    .withMessage('Invalid appointment type'),
  
  handleValidationErrors
];

// Department validation
const validateDepartment = [
  body('name')
    .notEmpty()
    .withMessage('Department name is required')
    .isLength({ max: 100 })
    .withMessage('Department name cannot exceed 100 characters'),
  
  body('headOfDepartment')
    .isMongoId()
    .withMessage('Valid head of department ID is required'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  handleValidationErrors
];

// Room validation
const validateRoom = [
  body('roomNumber')
    .notEmpty()
    .withMessage('Room number is required'),
  
  body('roomType')
    .isIn(['general', 'private', 'icu', 'emergency', 'surgery', 'maternity'])
    .withMessage('Invalid room type'),
  
  body('department')
    .isMongoId()
    .withMessage('Valid department ID is required'),
  
  body('floor')
    .isInt({ min: 1 })
    .withMessage('Floor must be a positive integer'),
  
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be at least 1'),
  
  body('pricePerDay')
    .isFloat({ min: 0 })
    .withMessage('Price per day must be a non-negative number'),
  
  handleValidationErrors
];

// Medicine validation
const validateMedicine = [
  body('name')
    .notEmpty()
    .withMessage('Medicine name is required'),
  
  body('category')
    .isIn(['antibiotic', 'painkiller', 'vitamin', 'supplement', 'prescription', 'otc'])
    .withMessage('Invalid medicine category'),
  
  body('dosage')
    .notEmpty()
    .withMessage('Dosage is required'),
  
  body('unit')
    .isIn(['mg', 'g', 'ml', 'tablet', 'capsule', 'syrup', 'injection'])
    .withMessage('Invalid unit'),
  
  body('manufacturer')
    .notEmpty()
    .withMessage('Manufacturer is required'),
  
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  
  body('expiryDate')
    .isISO8601()
    .withMessage('Valid expiry date is required'),
  
  handleValidationErrors
];

// Billing validation
const validateBilling = [
  body('patient')
    .isMongoId()
    .withMessage('Valid patient ID is required'),
  
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  
  body('items.*.name')
    .notEmpty()
    .withMessage('Item name is required'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  
  body('items.*.unitPrice')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a non-negative number'),
  
  body('dueDate')
    .isISO8601()
    .withMessage('Valid due date is required'),
  
  handleValidationErrors
];

// MongoDB ObjectId validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Valid ${paramName} ID is required`),
  
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUser,
  validateLogin,
  validateAppointment,
  validateDepartment,
  validateRoom,
  validateMedicine,
  validateBilling,
  validateObjectId,
  validatePagination
};
