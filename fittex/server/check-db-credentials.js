const mongoose = require('mongoose');
require('dotenv').config();
const GymSettings = require('./models/GymSettings');

async function checkSettings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fittex');
    const settings = await GymSettings.findOne();
    if (settings) {
      console.log('Stored Admin Username:', settings.adminUsername);
      console.log('Stored Admin Password:', settings.adminPassword);
    } else {
      console.log('No settings found in database.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSettings();
