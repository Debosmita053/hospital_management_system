const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true
  },
  genericName: {
    type: String,
    required: [true, 'Generic name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['tablet', 'syrup', 'injection', 'ointment', 'drops', 'capsule', 'powder']
  },
  manufacturer: {
    type: String,
    required: [true, 'Manufacturer is required']
  },
  batchNumber: {
    type: String,
    required: [true, 'Batch number is required']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['tablets', 'bottles', 'vials', 'tubes', 'strips', 'boxes']
  },
  pricePerUnit: {
    type: Number,
    required: [true, 'Price per unit is required'],
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: 0
  },
  description: {
    type: String,
    default: null
  },
  sideEffects: [{
    type: String
  }],
  dosage: {
    type: String,
    default: null
  },
  isPrescriptionRequired: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  reorderLevel: {
    type: Number,
    default: 10,
    min: 0
  }
}, {
  timestamps: true
});

// Check if medicine is expired
medicineSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiryDate;
});

// Check if medicine is low in stock
medicineSchema.virtual('isLowStock').get(function() {
  return this.quantity <= this.reorderLevel;
});

module.exports = mongoose.model('Medicine', medicineSchema);
