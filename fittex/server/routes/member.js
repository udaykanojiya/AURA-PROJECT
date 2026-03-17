const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Middleware to check member session
const requireMember = async (req, res, next) => {
  if (!req.session || !req.session.memberId) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please login.' });
  }
  try {
    const member = await Member.findById(req.session.memberId);
    if (!member) {
      req.session.destroy();
      return res.status(401).json({ success: false, message: 'Member not found. Please login again.' });
    }
    req.member = member;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Auth error: ' + err.message });
  }
};

// POST /api/member/login - After OTP verification, create member session
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found. Please register first.' });
    }

    const member = await Member.findOne({ userId: user._id });
    if (!member) {
      return res.status(403).json({
        success: false,
        message: 'Member account not found. Your registration may be pending admin approval.',
        code: 'PENDING_APPROVAL'
      });
    }

    // Set member session
    req.session.memberId = member._id.toString();
    req.session.memberEmail = email;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        memberId: member.memberId,
        fullName: member.fullName,
        status: member.status
      }
    });
  } catch (error) {
    console.error('Member login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// GET /api/member/dashboard
router.get('/dashboard', requireMember, async (req, res) => {
  try {
    const member = req.member;

    let daysRemaining = 0;
    if (member.endDate && member.status === 'active') {
      const today = new Date();
      daysRemaining = Math.ceil((new Date(member.endDate) - today) / (1000 * 60 * 60 * 24));
    }

    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    const attendanceThisMonth = await Attendance.countDocuments({
      memberId: member._id,
      date: { $gte: currentMonthStart },
      status: 'present'
    });

    res.json({
      success: true,
      data: {
        memberName: member.fullName,
        memberId: member.memberId,
        planName: member.planName,
        status: member.status,
        startDate: member.startDate,
        endDate: member.endDate,
        daysRemaining: Math.max(daysRemaining, 0),
        attendanceThisMonth,
        totalAttendance: member.totalAttendance || 0,
        currentStreak: member.currentStreak || 0,
        bmi: member.bmi,
        qrCode: member.qrCode
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/member/profile
router.get('/profile', requireMember, async (req, res) => {
  try {
    const member = await Member.findById(req.session.memberId).populate('planId').lean();
    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/member/attendance
router.get('/attendance', requireMember, async (req, res) => {
  try {
    const attendance = await Attendance.find({ memberId: req.session.memberId }).sort({ date: -1 }).limit(100);
    const member = req.member;
    res.json({
      success: true,
      data: {
        records: attendance,
        summary: { total: member.totalAttendance || 0, currentStreak: member.currentStreak || 0 }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/member/workout-plan
router.get('/workout-plan', requireMember, async (req, res) => {
  try {
    const member = await Member.findById(req.session.memberId).populate('workoutPlanId');
    if (!member.workoutPlanId) {
      return res.json({ success: true, data: null, message: 'No workout plan assigned yet' });
    }
    res.json({ success: true, data: member.workoutPlanId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/member/invoices
router.get('/invoices', requireMember, async (req, res) => {
  try {
    const invoices = await Payment.find({ memberId: req.session.memberId }).sort({ paymentDate: -1 });
    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/member/qr-code
router.get('/qr-code', requireMember, async (req, res) => {
  try {
    const member = req.member;
    res.json({
      success: true,
      data: {
        qrCode: member.qrCode,
        memberId: member.memberId,
        memberName: member.fullName
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/member/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: 'Logged out' });
  });
});

// ─── Haversine Distance Formula ────────────────────────────────────────────────
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // meters
}

// POST /api/member/check-in
router.post('/check-in', requireMember, async (req, res) => {
  try {
    const { qrData, memberLocation } = req.body;
    const member = req.member;

    // CHECK 1: Valid QR Format
    if (!qrData || !qrData.startsWith('FITTEX:')) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_QR', message: 'Invalid QR code. Please scan the gym QR code.' }
      });
    }

    // CHECK 2: Get Gym Settings
    const GymSettings = require('../models/GymSettings');
    const gym = await GymSettings.findOne();
    if (!gym || !gym.gymLocation?.latitude) {
      return res.status(404).json({
        success: false,
        error: { code: 'GYM_NOT_CONFIGURED', message: 'Gym location not configured. Contact admin.' }
      });
    }

    // CHECK 3: GPS Location Verification
    if (!memberLocation?.latitude || !memberLocation?.longitude) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_LOCATION', message: 'Location data missing. Please allow GPS access.' }
      });
    }

    const distance = calculateDistance(
      memberLocation.latitude,
      memberLocation.longitude,
      gym.gymLocation.latitude,
      gym.gymLocation.longitude
    );

    // Give some leeway based on GPS accuracy (subtract half of accuracy from distance)
    const accuracyLeeway = (memberLocation.accuracy || 0) / 2;
    const effectiveDistance = Math.max(0, distance - accuracyLeeway);

    console.log('--- Check-in Debug ---');
    console.log('Member Loc:', { lat: memberLocation.latitude, lng: memberLocation.longitude, accuracy: memberLocation.accuracy });
    console.log('Gym Loc:', { lat: gym.gymLocation.latitude, lng: gym.gymLocation.longitude });
    console.log('Calculated Distance:', distance, 'meters');
    console.log('Effective Distance (with accuracy leeway):', effectiveDistance, 'meters');

    const maxDistance = gym.checkInSettings?.maxDistance || 100; // Increased default to 100m
    if (effectiveDistance > maxDistance) {
      console.log('❌ Too far:', effectiveDistance, '>', maxDistance);
      return res.status(400).json({
        success: false,
        error: {
          code: 'LOCATION_TOO_FAR',
          message: `You're ${Math.round(distance)}m from the gym. Must be within ${maxDistance}m.`,
          distance: Math.round(distance),
          effectiveDistance: Math.round(effectiveDistance),
          maxDistance
        }
      });
    }

    // CHECK 4: Gym Hours
    const openTime = gym.checkInSettings?.gymHours?.openTime ?? 6;
    const closeTime = gym.checkInSettings?.gymHours?.closeTime ?? 22;
    const hour = new Date().getHours();
    if (hour < openTime || hour >= closeTime) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'OUTSIDE_GYM_HOURS',
          message: `Gym is closed. Hours: ${openTime}:00 AM – ${closeTime <= 12 ? closeTime : closeTime - 12}:00 PM`
        }
      });
    }

    // CHECK 5: Active Membership
    if (member.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: { code: 'MEMBERSHIP_INACTIVE', message: 'Membership is not active.' }
      });
    }

    if (new Date(member.endDate) < new Date()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MEMBERSHIP_EXPIRED',
          message: `Membership expired on ${new Date(member.endDate).toLocaleDateString('en-IN')}.`
        }
      });
    }

    // CHECK 6: Duplicate check-in today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const existingCheckIn = await Attendance.findOne({
      memberId: member._id,
      date: { $gte: todayStart },
      status: 'present'
    });

    if (existingCheckIn) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DUPLICATE_CHECKIN',
          message: `Already checked in today at ${new Date(existingCheckIn.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}.`,
          previousCheckIn: existingCheckIn.checkInTime,
          currentStreak: member.currentStreak,
          totalAttendance: member.totalAttendance
        }
      });
    }

    // ─── ALL CHECKS PASSED — Create Attendance Record ──────────────────────────
    const now = new Date();
    const attendance = await Attendance.create({
      memberId: member._id,
      memberName: member.fullName,
      date: now,
      checkInTime: now,
      status: 'present',
      location: {
        latitude: memberLocation.latitude,
        longitude: memberLocation.longitude,
        accuracy: memberLocation.accuracy
      },
      verificationMethod: 'qr_location',
      qrCodeScanned: qrData,
      markedBy: 'qr_scan'
    });

    // Update Member Stats & Streak
    member.totalAttendance = (member.totalAttendance || 0) + 1;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const yesterdayEnd = new Date(yesterday.getTime() + 24 * 60 * 60 * 1000);

    const yesterdayAtt = await Attendance.findOne({
      memberId: member._id,
      date: { $gte: yesterday, $lt: yesterdayEnd },
      status: 'present'
    });

    if (yesterdayAtt) {
      member.currentStreak = (member.currentStreak || 0) + 1;
    } else {
      member.currentStreak = 1;
    }

    if (member.currentStreak > (member.longestStreak || 0)) {
      member.longestStreak = member.currentStreak;
    }
    member.lastCheckIn = now;
    await member.save();

    res.json({
      success: true,
      message: 'Check-in successful! Welcome to FITTEX! 💪',
      data: {
        checkInTime: attendance.checkInTime,
        currentStreak: member.currentStreak,
        longestStreak: member.longestStreak,
        totalAttendance: member.totalAttendance
      }
    });

  } catch (err) {
    console.error('Check-in error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
