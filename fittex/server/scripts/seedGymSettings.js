require('dotenv').config();
const mongoose = require('mongoose');
const GymSettings = require('../models/GymSettings');

const seedGymSettings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing settings
    await GymSettings.deleteMany({});

    // For UPI QR - You can add base64 later or keep as placeholder
    const placeholderQR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    // Create gym settings
    const settings = new GymSettings({
      gymName: 'FITTEX Gym',
      address: '123 Fitness Street, Mumbai, Maharashtra 400001',
      phone: '9876543210',
      email: 'info@fittexgym.com',
      
      // Payment details - UPDATE with your actual details
      upiId: 'fittexgym@paytm',
      upiQRCode: placeholderQR, // Can update later with actual QR
      bankAccount: '1234567890',
      bankIFSC: 'SBIN0001234',
      bankName: 'State Bank of India',
      
      // Admin credentials
      adminUsername: 'admin',
      adminPassword: 'admin123'
    });

    await settings.save();
    console.log('✅ Gym settings seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding gym settings:', error);
    process.exit(1);
  }
};

seedGymSettings();
