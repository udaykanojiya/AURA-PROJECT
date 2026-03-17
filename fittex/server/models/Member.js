const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  memberId: {
    type: String,
    unique: true,
    required: true
  },
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
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  height: Number,
  weight: Number,
  bmi: Number,
  fitnessGoal: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'general_fitness', 'athletic', 'endurance', 'flexibility']
  },
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  planName: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['active', 'expired', 'pending'],
    default: 'pending'
  },
  totalAttendance: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastCheckIn: {
    type: Date
  },
  workoutPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutPlan'
  },
  qrCode: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Member', memberSchema);
