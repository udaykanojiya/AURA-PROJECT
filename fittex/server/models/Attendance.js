const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
    index: true
  },
  memberName: String,
  date: {
    type: Date,
    required: true,
    index: true
  },
  checkInTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    default: 'present'
  },
  location: {
    latitude: Number,
    longitude: Number,
    accuracy: Number
  },
  verificationMethod: {
    type: String,
    enum: ['qr_location', 'manual_admin'],
    default: 'qr_location'
  },
  qrCodeScanned: String,
  markedBy: {
    type: String,
    enum: ['admin', 'qr_scan', 'system'],
    default: 'qr_scan'
  }
}, {
  timestamps: true
});

// Fast lookup by member per day
attendanceSchema.index({ memberId: 1, date: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
