const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    unique: true,
    trim: true
  },
  roomType: {
    type: String,
    enum: ['general', 'private', 'icu', 'emergency', 'surgery', 'maternity'],
    required: [true, 'Room type is required']
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required']
  },
  floor: {
    type: Number,
    required: [true, 'Floor is required']
  },
  capacity: {
    type: Number,
    required: [true, 'Room capacity is required'],
    min: [1, 'Room capacity must be at least 1']
  },
  currentOccupancy: {
    type: Number,
    default: 0,
    max: [this.capacity, 'Current occupancy cannot exceed room capacity']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  amenities: [{
    name: String,
    description: String
  }],
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: [0, 'Price cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual to check if room is full
roomSchema.virtual('isFull').get(function() {
  return this.currentOccupancy >= this.capacity;
});

// Update availability based on occupancy
roomSchema.pre('save', function(next) {
  this.isAvailable = this.currentOccupancy < this.capacity;
  next();
});

module.exports = mongoose.model('Room', roomSchema);
