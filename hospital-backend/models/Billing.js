const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  items: [{
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['consultation', 'medication', 'procedure', 'room', 'lab', 'other'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    total: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'partial', 'overdue', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'insurance', 'bank_transfer', 'upi', 'other']
  },
  payments: [{
    amount: {
      type: Number,
      required: true
    },
    method: {
      type: String,
      required: true
    },
    transactionId: String,
    paymentDate: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  dueDate: {
    type: Date,
    required: true
  },
  insurance: {
    provider: String,
    policyNumber: String,
    coverageAmount: Number,
    claimNumber: String
  },
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate invoice number before saving
billingSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Billing').countDocuments();
    this.invoiceNumber = `INV${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Calculate totals before saving
billingSchema.pre('save', function(next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.total = this.subtotal + this.tax - this.discount;
  next();
});

module.exports = mongoose.model('Billing', billingSchema);