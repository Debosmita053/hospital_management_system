const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
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
    ref: 'Appointment'
  },
  recordType: {
    type: String,
    enum: ['consultation', 'surgery', 'emergency', 'follow-up', 'lab-result', 'imaging'],
    required: [true, 'Record type is required']
  },
  chiefComplaint: {
    type: String,
    required: [true, 'Chief complaint is required'],
    trim: true
  },
  historyOfPresentIllness: {
    type: String,
    trim: true
  },
  physicalExamination: {
    vitalSigns: {
      bloodPressure: String,
      heartRate: Number,
      temperature: Number,
      respiratoryRate: Number,
      oxygenSaturation: Number
    },
    generalAppearance: String,
    cardiovascular: String,
    respiratory: String,
    abdominal: String,
    neurological: String,
    musculoskeletal: String,
    skin: String
  },
  diagnosis: {
    primary: {
      type: String,
      required: [true, 'Primary diagnosis is required']
    },
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
    recommendations: [String]
  },
  labResults: [{
    testName: String,
    result: String,
    normalRange: String,
    date: Date,
    lab: String
  }],
  imagingResults: [{
    type: String,
    findings: String,
    date: Date,
    facility: String
  }],
  followUpInstructions: {
    type: String,
    trim: true
  },
  followUpDate: {
    type: Date
  },
  isConfidential: {
    type: Boolean,
    default: false
  },
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }]
}, {
  timestamps: true
});

// Index for efficient queries
medicalRecordSchema.index({ patient: 1, createdAt: -1 });
medicalRecordSchema.index({ doctor: 1, createdAt: -1 });
medicalRecordSchema.index({ recordType: 1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
