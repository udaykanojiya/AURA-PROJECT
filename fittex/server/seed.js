require('dotenv').config();
const mongoose = require('mongoose');
const Plan = require('./models/Plan');
const GymSettings = require('./models/GymSettings');
const WorkoutPlan = require('./models/WorkoutPlan');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fittex');
    console.log('✅ Connected to MongoDB');

    // Seed Plans
    const existingPlans = await Plan.countDocuments();
    if (existingPlans === 0) {
      await Plan.insertMany([
        {
          planName: 'Basic - 1 Month',
          duration: 30,
          price: 2999,
          features: ['Gym Access', 'Locker', 'Basic Fitness Assessment', 'Access to all equipment'],
          isActive: true
        },
        {
          planName: 'Standard - 3 Months',
          duration: 90,
          price: 7999,
          features: ['Gym Access', 'Locker', 'Fitness Assessment', 'Group Classes', 'Diet Consultation'],
          isActive: true
        },
        {
          planName: 'Premium - 6 Months',
          duration: 180,
          price: 13999,
          features: ['Gym Access', 'Locker', 'Personal Trainer (2x/week)', 'Group Classes', 'Diet Plan', 'Progress Tracking'],
          isActive: true
        },
        {
          planName: 'Elite - 1 Year',
          duration: 365,
          price: 24999,
          features: ['Unlimited Gym Access', 'Private Locker', 'Personal Trainer (5x/week)', 'All Group Classes', 'Custom Diet Plan', 'Monthly Body Assessment', 'Priority Booking'],
          isActive: true
        }
      ]);
      console.log('✅ Plans seeded');
    } else {
      console.log('ℹ️  Plans already exist, skipping...');
    }

    // Seed Gym Settings
    const existingSettings = await GymSettings.countDocuments();
    if (existingSettings === 0) {
      await GymSettings.create({
        gymName: 'FITTEX GYM',
        tagline: 'Sculpt Your Body, Elevate Your Spirit',
        address: '123 Fitness Street, Andheri West, Mumbai, Maharashtra 400058',
        phone: '+91 98765 43210',
        email: 'info@fittexgym.com',
        openHours: 'Mon-Sat: 5:00 AM - 10:00 PM | Sun: 6:00 AM - 8:00 PM',
        upiId: 'fittexgym@paytm',
        upiQRCode: '',
        bankAccount: '1234567890',
        bankIFSC: 'SBIN0001234',
        bankName: 'State Bank of India',
        accountHolderName: 'FITTEX GYM',
        instagram: 'https://instagram.com/fittexgym',
        facebook: 'https://facebook.com/fittexgym',
        youtube: 'https://youtube.com/@fittexgym'
      });
      console.log('✅ Gym settings seeded');
    } else {
      console.log('ℹ️  Gym settings already exist, skipping...');
    }

    // Seed a Sample Workout Plan
    const existingWorkouts = await WorkoutPlan.countDocuments();
    if (existingWorkouts === 0) {
      await WorkoutPlan.create({
        planName: 'Beginner Full Body Program',
        targetLevel: 'beginner',
        targetGoal: 'general_fitness',
        schedule: [
          {
            day: 1,
            dayName: 'Chest & Triceps',
            exercises: [
              { name: 'Bench Press', sets: 3, reps: '10-12', rest: 60 },
              { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: 60 },
              { name: 'Cable Fly', sets: 3, reps: '12-15', rest: 45 },
              { name: 'Tricep Pushdown', sets: 3, reps: '12-15', rest: 45 },
              { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', rest: 45 }
            ]
          },
          {
            day: 2,
            dayName: 'Back & Biceps',
            exercises: [
              { name: 'Lat Pulldown', sets: 3, reps: '10-12', rest: 60 },
              { name: 'Seated Cable Row', sets: 3, reps: '10-12', rest: 60 },
              { name: 'Barbell Row', sets: 3, reps: '8-10', rest: 60 },
              { name: 'Barbell Curl', sets: 3, reps: '12-15', rest: 45 },
              { name: 'Hammer Curl', sets: 3, reps: '12-15', rest: 45 }
            ]
          },
          {
            day: 3,
            dayName: 'Rest Day',
            exercises: []
          },
          {
            day: 4,
            dayName: 'Legs',
            exercises: [
              { name: 'Squat', sets: 4, reps: '8-10', rest: 90 },
              { name: 'Leg Press', sets: 3, reps: '12-15', rest: 60 },
              { name: 'Leg Curl', sets: 3, reps: '12-15', rest: 45 },
              { name: 'Calf Raise', sets: 4, reps: '15-20', rest: 30 }
            ]
          },
          {
            day: 5,
            dayName: 'Shoulders & Abs',
            exercises: [
              { name: 'Overhead Press', sets: 3, reps: '10-12', rest: 60 },
              { name: 'Lateral Raise', sets: 3, reps: '12-15', rest: 45 },
              { name: 'Face Pull', sets: 3, reps: '15', rest: 45 },
              { name: 'Plank', sets: 3, reps: '60 sec', rest: 30 },
              { name: 'Crunches', sets: 3, reps: '20', rest: 30 }
            ]
          },
          {
            day: 6,
            dayName: 'Cardio Day',
            exercises: [
              { name: 'Treadmill Run', sets: 1, reps: '30 min', rest: 0 },
              { name: 'Jump Rope', sets: 3, reps: '5 min', rest: 60 }
            ]
          },
          {
            day: 7,
            dayName: 'Rest Day',
            exercises: []
          }
        ]
      });
      console.log('✅ Sample workout plan seeded');
    } else {
      console.log('ℹ️  Workout plans already exist, skipping...');
    }

    console.log('\n🎉 Seeding complete! FITTEX GYM is ready.');
    console.log('📋 Admin credentials: owner / FittexAdmin@2024');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
