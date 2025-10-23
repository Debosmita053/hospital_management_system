const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient is required']
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  billNumber: {
    type: String,
    required: [true, 'Bill number is required'],
    unique: true
  },
  items: [{
    name: {
      type: String,
      required: [true, 'Item name is required']
    },
    description: String,
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative']
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative']
    },
    category: {
      type: String,
      enum: ['consultation', 'medication', 'procedure', 'room', 'lab', 'imaging', 'other'],
      required: [true, 'Category is required']
    }
  }],
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'partial', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'insurance', 'bank_transfer', 'upi', 'cheque']
  },
  paymentDate: {
    type: Date
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  insurance: {
    provider: String,
    policyNumber: String,
    coverage: Number
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by is required']
  }
}, {
  timestamps: true
});

// Generate bill number before saving
billingSchema.pre('save', async function(next) {
  if (!this.billNumber) {
    const count = await this.constructor.countDocuments();
    this.billNumber = `BILL-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Calculate total amount before saving
billingSchema.pre('save', function(next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.totalAmount = this.subtotal + this.tax - this.discount;
  next();
});

// Index for efficient queries
billingSchema.index({ patient: 1, createdAt: -1 });
billingSchema.index({ status: 1 });
billingSchema.index({ billNumber: 1 });

module.exports = mongoose.model('Billing', billingSchema);
