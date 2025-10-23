const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient is required']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doctor is required']
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: [true, 'Appointment is required']
  },
  medications: [{
    name: {
      type: String,
      required: [true, 'Medication name is required']
    },
    dosage: {
      type: String,
      required: [true, 'Dosage is required']
    },
    frequency: {
      type: String,
      required: [true, 'Frequency is required']
    },
    duration: {
      type: String,
      required: [true, 'Duration is required']
    },
    instructions: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    }
  }],
  diagnosis: {
    type: String,
    required: [true, 'Diagnosis is required'],
    trim: true
  },
  symptoms: [String],
  notes: {
    type: String,
    trim: true
  },
  followUpDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  isDispensed: {
    type: Boolean,
    default: false
  },
  dispensedAt: {
    type: Date
  },
  dispensedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
