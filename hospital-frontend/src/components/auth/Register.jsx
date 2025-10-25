import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, Heart, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const darkMode = theme === 'dark';

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'doctor',
    firstName: '',
    lastName: '',
    phone: '+91',
    dateOfBirth: '',
    gender: 'male',
    // Doctor specific
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: '',
    qualifications: '',
    // Staff specific
    department: '',
    employeeId: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    // Validation for step 1
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        toast.error('Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
    }

    // Validation for step 2
    if (step === 2) {
      if (!formData.firstName || !formData.lastName || !formData.phone) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Phone number validation for +91 format
      if (!formData.phone.startsWith('+91') || formData.phone.length !== 13) {
        toast.error('Phone number must be in format: +91XXXXXXXXXX');
        return;
      }

      // Role-specific validation
      if (formData.role === 'doctor') {
        if (!formData.specialization || !formData.licenseNumber || !formData.qualifications) {
          toast.error('Please fill in all required doctor fields');
          return;
        }
      }
      if (formData.role === 'nurse' || formData.role === 'lab_technician' || formData.role === 'pharmacist' || formData.role === 'ward_boy') {
        if (!formData.department || !formData.employeeId || !formData.qualifications) {
          toast.error('Please fill in all required staff fields');
          return;
        }
      }
    }

    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dateOfBirth || !formData.gender) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
<<<<<<< Updated upstream
        // Doctor specific
        ...(formData.role === 'doctor' && {
          specialization: formData.specialization,
          licenseNumber: formData.licenseNumber,
          yearsOfExperience: formData.yearsOfExperience,
          qualifications: formData.qualifications,
        }),
        // Staff specific
        ...((formData.role === 'nurse' || formData.role === 'lab_technician' || formData.role === 'pharmacist' || formData.role === 'ward_boy') && {
          department: formData.department,
          employeeId: formData.employeeId,
          qualifications: formData.qualifications,
=======
        ...(formData.role === 'patient' && {
          address: {
            street: formData.address,
          },
          emergencyContact: {
            phone: formData.emergencyContact,
          },
>>>>>>> Stashed changes
        }),
        ...(formData.role === 'doctor' && {
          specialization: 'General Medicine', // Default specialization
          licenseNumber: 'TEMP' + Date.now(), // Temporary license
          department: null, // Will be assigned later
        }),
      };

      const result = await register(userData);

<<<<<<< Updated upstream
    if (result.success) {
      toast.success('Registration successful!');
      navigate('/login');
    } else {
      toast.error(result.error);
=======
      if (result.success) {
        toast.success('Registration successful!');
        navigate(`/${result.user.role}`);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
>>>>>>> Stashed changes
    }

    setLoading(false);
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'doctor': return 'Register as a doctor to manage patients, appointments, and medical records';
      case 'nurse': return 'Register as a nurse to provide patient care and manage medical records';
      case 'lab_technician': return 'Register as a lab technician to manage lab tests and results';
      case 'pharmacist': return 'Register as a pharmacist to manage medications and prescriptions';
      case 'ward_boy': return 'Register as a ward assistant to support patient care services';
      default: return '';
    }
  };

  // Specializations for doctors
  const specializations = [
    'Cardiology',
    'Dermatology',
    'Emergency Medicine',
    'Family Medicine',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Surgery'
  ];

  // Departments for staff
  const departments = [
    'Emergency Room',
    'Intensive Care Unit',
    'Operating Room',
    'Pediatrics',
    'Maternity Ward',
    'Cardiology',
    'Oncology',
    'Neurology',
    'Laboratory',
    'Pathology',
    'Microbiology',
    'Biochemistry',
    'Pharmacy',
    'Radiology',
    'General Ward'
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
    }`}>
      {/* Back Button */}
      <button
        onClick={handleBackToLanding}
        className={`absolute top-6 left-6 flex items-center space-x-2 transition-colors duration-200 ${
          darkMode 
            ? 'text-gray-400 hover:text-white' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </button>

      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-2xl ${
              darkMode ? 'bg-blue-500' : 'bg-blue-600'
            }`}>
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className={`text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Registration
          </h2>
          <p className={`mt-2 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Manage your hospital member account
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 
                ? 'bg-blue-600 text-white' 
                : darkMode 
                  ? 'bg-gray-700 text-gray-400' 
                  : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${
              step >= 2 
                ? 'bg-blue-600' 
                : darkMode 
                  ? 'bg-gray-700' 
                  : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 
                ? 'bg-blue-600 text-white' 
                : darkMode 
                  ? 'bg-gray-700 text-gray-400' 
                  : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${
              step >= 3 
                ? 'bg-blue-600' 
                : darkMode 
                  ? 'bg-gray-700' 
                  : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 
                ? 'bg-blue-600 text-white' 
                : darkMode 
                  ? 'bg-gray-700 text-gray-400' 
                  : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
          <div className={`flex justify-between mt-2 text-xs ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <span>Account</span>
            <span>Professional</span>
            <span>Details</span>
          </div>
        </div>

        {/* Registration Card */}
        <div className={`rounded-2xl shadow-xl p-8 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300'
                      }`}
                      placeholder="you@hospital.com"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className={`h-5 w-5 ${
                          darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                        }`} />
                      ) : (
                        <Eye className={`h-5 w-5 ${
                          darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                        }`} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Staff Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="lab_technician">Lab Technician</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="ward_boy">Ward Assistant</option>
                  </select>
                  <p className={`mt-1 text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {getRoleDescription(formData.role)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium transition duration-150 ${
                    darkMode 
                      ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400 focus:ring-offset-gray-800' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  Next Step
                </button>
              </div>
            )}

            {/* Step 2: Personal & Professional Info */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      First Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'border-gray-300'
                        }`}
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300'
                      }`}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300'
                      }`}
                      placeholder="+91 9876543210"
                      pattern="\+91[0-9]{10}"
                    />
                  </div>
                  <p className={`mt-1 text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Format: +91 followed by 10 digits (e.g., +919876543210)
                  </p>
                </div>

                {/* Doctor Specific Fields */}
                {formData.role === 'doctor' && (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Specialization *
                      </label>
                      <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Specialization</option>
                        {specializations.map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        License Number *
                      </label>
                      <input
                        type="text"
                        name="licenseNumber"
                        required
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'border-gray-300'
                        }`}
                        placeholder="MED123456"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                        className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'border-gray-300'
                        }`}
                        placeholder="5"
                        min="0"
                        max="50"
                      />
                    </div>
                  </>
                )}

                {/* Staff Specific Fields */}
                {(formData.role === 'nurse' || formData.role === 'lab_technician' || formData.role === 'pharmacist' || formData.role === 'ward_boy') && (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Department *
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Employee ID *
                      </label>
                      <input
                        type="text"
                        name="employeeId"
                        required
                        value={formData.employeeId}
                        onChange={handleChange}
                        className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'border-gray-300'
                        }`}
                        placeholder="EMP12345"
                      />
                    </div>
                  </>
                )}

                {/* Qualifications Field for All Roles */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Qualifications *
                  </label>
                  <textarea
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    required
                    rows="3"
                    className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                    }`}
                    placeholder={
                      formData.role === 'doctor' 
                        ? "MD, MBBS, MS, etc." 
                        : formData.role === 'nurse'
                        ? "B.Sc Nursing, GNM, ANM, etc."
                        : formData.role === 'lab_technician'
                        ? "B.Sc MLT, DMLT, etc."
                        : formData.role === 'pharmacist'
                        ? "B.Pharm, D.Pharm, etc."
                        : "High School, Diploma, etc."
                    }
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={`flex-1 py-3 px-4 border rounded-lg font-medium transition duration-150 ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className={`flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium transition duration-150 ${
                      darkMode 
                        ? 'bg-blue-500 hover:bg-blue-600' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Additional Details */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="dateOfBirth"
                      required
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className={`flex-1 py-3 px-4 border rounded-lg font-medium transition duration-150 ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode 
                        ? 'bg-blue-500 hover:bg-blue-600' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Already have an account?{' '}
              <Link
                to="/login"
                className={`font-medium ${
                  darkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-500'
                }`}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;