import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true,
    trim: true
  },
  frequency: {
    type: String,
    required: true,
    trim: true // e.g., "Once daily", "Twice a day", "Every 8 hours"
  },
  quantity: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'tablets',
    trim: true
  },
  timeOfDay: [{
    type: String, // e.g., "08:00", "20:00"
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Medication', medicationSchema);
