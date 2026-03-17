const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: true
  },
  targetLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  targetGoal: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'general_fitness', 'athletic']
  },
  schedule: [{
    day: Number,
    dayName: String,
    exercises: [{
      name: String,
      sets: Number,
      reps: String,
      rest: Number
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
