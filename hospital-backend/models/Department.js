const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: {
    floor: String,
    building: String,
    room: String
  },
  contactInfo: {
    phone: String,
    email: String
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