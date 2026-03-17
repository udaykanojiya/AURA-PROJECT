const mongoose = require('mongoose');

const gymSettingsSchema = new mongoose.Schema({
  gymName: { type: String, default: 'FITTEX Gym' },
  address: String,
  phone: String,
  email: String,
  upiId: String,
  upiQRCode: String,
  bankAccount: String,
  bankIFSC: String,
  bankName: String,
  adminUsername: String,
  adminPassword: String,

  // GPS Location for attendance verification
  gymLocation: {
    latitude: Number,
    longitude: Number,
    address: String
  },

  // Attendance check-in settings
  checkInSettings: {
    maxDistance: { type: Number, default: 50 }, // meters
    gymHours: {
      openTime: { type: Number, default: 6 },   // 6 AM
      closeTime: { type: Number, default: 22 }  // 10 PM
    }
  },

  // Permanent gym QR code
  qrCode: {
    data: String,
    image: String,
    generatedAt: Date
  },

  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GymSettings', gymSettingsSchema);
