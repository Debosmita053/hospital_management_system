const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  prescriptionNumber: {
    type: String,
    unique: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  medications: [{
    name: {
      type: String,
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    instructions: String,
    quantity: Number,
    refills: {
      type: Number,
      default: 0
    }
  }],
  diagnosis: {
    type: String,
    required: true
  },
  symptoms: [String],
  notes: String,
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date
}, {
  timestamps: true
});

// Generate prescription number before saving
prescriptionSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Prescription').countDocuments();
    this.prescriptionNumber = `RX${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Prescription', prescriptionSchema);

