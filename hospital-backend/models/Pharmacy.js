const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  genericName: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drops', 'inhaler', 'other']
  },
  manufacturer: {
    type: String,
    required: true
  },
  dosage: {
    strength: String,
    unit: String
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    current: {
      type: Number,
      required: true,
      min: 0
    },
    minimum: {
      type: Number,
      required: true,
      min: 0
    },
    maximum: {
      type: Number,
      required: true,
      min: 0
    }
  },
  expiryDate: {
    type: Date,
    required: true
  },
  batchNumber: {
    type: String,
    required: true
  },
  prescriptionRequired: {
    type: Boolean,
    default: true
  },
  sideEffects: [String],
  contraindications: [String],
  storageConditions: String,
  isActive: {
    type: Boolean,
    default: true
  },
  supplier: {
    name: String,
    contact: String,
    address: String
  }
}, {
  timestamps: true
});

// Check if stock is low
pharmacySchema.virtual('isLowStock').get(function() {
  return this.stock.current <= this.stock.minimum;
});

// Check if expired
pharmacySchema.virtual('isExpired').get(function() {
  return new Date() > this.expiryDate;
});

module.exports = mongoose.model('Pharmacy', pharmacySchema);

