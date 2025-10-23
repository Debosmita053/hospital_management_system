const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUser = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('phone').isMobilePhone(),
  handleValidationErrors
];

// Patient validation rules
const validatePatient = [
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone(),
  body('dateOfBirth').isISO8601(),
  body('gender').isIn(['male', 'female', 'other']),
  body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  handleValidationErrors
];

// Doctor validation rules
const validateDoctor = [
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone(),
  body('specialization').notEmpty().trim(),
  body('licenseNumber').notEmpty().trim(),
  handleValidationErrors
];

// Appointment validation rules
const validateAppointment = [
  body('patientId').isMongoId(),
  body('doctorId').isMongoId(),
  body('appointmentDate').isISO8601(),
  body('appointmentTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('reason').notEmpty().trim(),
  handleValidationErrors
];

// Prescription validation rules
const validatePrescription = [
  body('patientId').isMongoId(),
  body('doctorId').isMongoId(),
  body('medications').isArray({ min: 1 }),
  body('medications.*.name').notEmpty().trim(),
  body('medications.*.dosage').notEmpty().trim(),
  body('medications.*.frequency').notEmpty().trim(),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUser,
  validatePatient,
  validateDoctor,
  validateAppointment,
  validatePrescription
};