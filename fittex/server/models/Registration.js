const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  age: Number,
  gender: String,
  height: Number,
  weight: Number,
  bmi: Number,
  fitnessGoal: String,
  experienceLevel: String,
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  planName: String,
  amount: Number,
  paymentScreenshot: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: String,
  reviewedBy: String,
  reviewedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Registration', registrationSchema);
