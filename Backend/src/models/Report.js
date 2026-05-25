import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  reportType: {
    type: String,
    enum: ['blood_test', 'xray', 'mri', 'ct_scan', 'ultrasound', 'other'],
    default: 'other'
  },
  fileUrl: {
    type: String
  },
  fileName: {
    type: String
  },
  reportData: {
    type: String,
    required: true
  },
  analysis: {
    summary: String,
    findings: [String],
    recommendations: [String],
    analyzedAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'analyzed', 'reviewed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Report', reportSchema);
