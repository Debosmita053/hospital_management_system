const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Department name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  headOfDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Head of department is required']
  },
  location: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  services: [{
    name: String,
    description: String,
    price: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);
