const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
    unique: true,
    trim: true
  },
  genericName: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['antibiotic', 'painkiller', 'vitamin', 'supplement', 'prescription', 'otc']
  },
  description: {
    type: String,
    trim: true
  },
  dosage: {
    type: String,
    required: [true, 'Dosage is required']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['mg', 'g', 'ml', 'tablet', 'capsule', 'syrup', 'injection']
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
    min: [0, 'Quantity cannot be negative']
  },
  minimumStock: {
    type: Number,
    required: [true, 'Minimum stock is required'],
    min: [0, 'Minimum stock cannot be negative']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  isPrescriptionRequired: {
    type: Boolean,
    default: true
  },
  sideEffects: [String],
  contraindications: [String],
  storageConditions: {
    type: String,
    default: 'Store in a cool, dry place'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual to check if medicine is low in stock
medicineSchema.virtual('isLowStock').get(function() {
  return this.quantity <= this.minimumStock;
});

// Virtual to check if medicine is expired
medicineSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiryDate;
});

// Index for efficient queries
medicineSchema.index({ name: 1 });
medicineSchema.index({ category: 1 });
medicineSchema.index({ isActive: 1 });

module.exports = mongoose.model('Medicine', medicineSchema);
