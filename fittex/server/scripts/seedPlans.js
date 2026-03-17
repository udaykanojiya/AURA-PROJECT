require('dotenv').config();
const mongoose = require('mongoose');
const Plan = require('../models/Plan');

const plans = [
  {
    planName: 'Basic - 1 Month',
    duration: 30,
    price: 2999,
    features: [
      'Gym Access (6 days/week)',
      'Basic Equipment',
      'Locker Facility',
      'Drinking Water'
    ],
    isActive: true
  },
  {
    planName: 'Standard - 3 Months',
    duration: 90,
    price: 7999,
    features: [
      'Gym Access (6 days/week)',
      'All Equipment Access',
      'Locker Facility',
      '1 Free Personal Training Session',
      'Nutrition Guidance',
      'Drinking Water'
    ],
    isActive: true
  },
  {
    planName: 'Premium - 6 Months',
    duration: 180,
    price: 13999,
    features: [
      'Gym Access (7 days/week)',
      'All Equipment Access',
      'Personal Locker',
      '5 Free Personal Training Sessions',
      'Diet Plan Included',
      'Supplement Discount (10%)',
      'Drinking Water',
      'Steam Bath Access'
    ],
    isActive: true
  }
];

const seedPlans = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing plans
    await Plan.deleteMany({});
    console.log('Cleared existing plans');

    // Insert new plans
    await Plan.insertMany(plans);
    console.log('✅ Plans seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding plans:', error);
    process.exit(1);
  }
};

seedPlans();
