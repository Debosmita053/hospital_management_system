const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  recordNumber: {
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
  type: {
    type: String,
    enum: ['consultation', 'lab_result', 'imaging', 'procedure', 'surgery', 'emergency', 'follow_up'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  chiefComplaint: String,
  historyOfPresentIllness: String,
  physicalExamination: {
    vitalSigns: {
      bloodPressure: String,
      temperature: String,
      heartRate: String,
      respiratoryRate: String,
      weight: String,
      height: String
    },
    generalAppearance: String,
    cardiovascular: String,
    respiratory: String,
    gastrointestinal: String,
    neurological: String,
    musculoskeletal: String,
    skin: String,
    other: String
  },
  diagnosis: {
    primary: String,
    secondary: [String],
    differential: [String]
  },
  treatment: {
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String
    }],
    procedures: [String],
    recommendations: String
  },
  labResults: [{
    testName: String,
    result: String,
    normalRange: String,
    status: {
      type: String,
      enum: ['normal', 'abnormal', 'critical']
    },
    date: Date
  }],
  imagingResults: [{
    type: String,
    findings: String,
    impression: String,
    date: Date,
    images: [String]
  }],
  followUp: {
    required: {
      type: Boolean,
      default: false
    },
    date: Date,
    instructions: String
  },
  attachments: [{
    name: String,
    type: String,
    url: String,
    uploadedDate: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'finalized', 'archived'],
    default: 'draft'
  },
  notes: String
}, {
  timestamps: true
});

// Generate record number before saving
medicalRecordSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('MedicalRecord').countDocuments();
    this.recordNumber = `MR${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);

