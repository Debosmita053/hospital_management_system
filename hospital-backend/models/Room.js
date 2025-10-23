const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  roomType: {
    type: String,
    enum: ['general', 'private', 'icu', 'emergency', 'operation', 'recovery'],
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  bedCount: {
    type: Number,
    required: true,
    min: 1
  },
  availableBeds: {
    type: Number,
    default: function() { return this.bedCount; }
  },
  beds: [{
    bedNumber: String,
    isOccupied: {
      type: Boolean,
      default: false
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient'
    },
    admissionDate: Date
  }],
  amenities: [{
    name: String,
    available: {
      type: Boolean,
      default: true
    }
  }],
  rate: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: String
}, {
  timestamps: true
});

// Update available beds when bed occupancy changes
roomSchema.pre('save', function(next) {
  this.availableBeds = this.beds.filter(bed => !bed.isOccupied).length;
  next();
});

module.exports = mongoose.model('Room', roomSchema);