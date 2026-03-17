const express = require('express');
const router = express.Router();
const { requireAdminAuth } = require('../middleware/auth');
const Member = require('../models/Member');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
const Payment = require('../models/Payment');
const WorkoutPlan = require('../models/WorkoutPlan');
const Plan = require('../models/Plan');
const GymSettings = require('../models/GymSettings');
const QRCode = require('qrcode');
const { sendApprovalEmail, sendRejectionEmail } = require('../services/email');
const { generateInvoicePDF } = require('../services/pdf');

// All routes require admin auth
router.use(requireAdminAuth);

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ status: 'active' });
    const pendingRegistrations = await Registration.countDocuments({ status: 'pending' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await Attendance.countDocuments({
      date: { $gte: today },
      status: 'present'
    });

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyPayments = await Payment.find({ createdAt: { $gte: startOfMonth }, verified: true });
    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    res.json({
      success: true,
      data: { totalMembers, activeMembers, pendingRegistrations, todayAttendance, monthlyRevenue }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/registrations
router.get('/registrations', async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const query = status === 'all' ? {} : { status };
    const registrations = await Registration.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('planId');
    const total = await Registration.countDocuments(query);
    res.json({ success: true, data: registrations, total, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/registrations/:id/approve
router.post('/registrations/:id/approve', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found.' });
    if (registration.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Registration already processed.' });
    }

    // Get plan details
    const plan = await Plan.findById(registration.planId);
    if (!plan) return res.status(400).json({ success: false, message: 'Plan not found.' });

    // Generate member ID
    const memberCount = await Member.countDocuments();
    const memberId = `FTX${String(memberCount + 1).padStart(3, '0')}`;

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    // Generate QR Code
    const qrData = JSON.stringify({ memberId, phone: registration.phone, name: registration.fullName });
    const qrCode = await QRCode.toDataURL(qrData, {
      color: { dark: '#0a0a0a', light: '#BFFF00' },
      width: 300
    });

    // Create or find user account (linked to Member)
    const User = require('../models/User');
    let user = await User.findOne({ email: registration.email });
    if (!user) {
      user = await User.create({
        email: registration.email,
        phone: registration.phone,
        role: 'member',
        isVerified: true
      });
    }

    // Create member
    const member = await Member.create({
      userId: user._id,
      memberId,
      fullName: registration.fullName,
      phone: registration.phone,
      email: registration.email,
      age: registration.age,
      gender: registration.gender,
      height: registration.height,
      weight: registration.weight,
      bmi: registration.bmi,
      fitnessGoal: registration.fitnessGoal,
      experienceLevel: registration.experienceLevel,
      planId: plan._id,
      planName: plan.planName,
      startDate,
      endDate,
      status: 'active',
      qrCode,
      totalAttendance: 0,
      currentStreak: 0
    });

    // Generate invoice number
    const paymentCount = await Payment.countDocuments();
    const invoiceNumber = `INV-${String(paymentCount + 1).padStart(4, '0')}`;

    // Create payment record
    const payment = await Payment.create({
      memberId: member._id,
      invoiceNumber,
      amount: registration.amount,
      planName: registration.planName,
      paymentDate: new Date(),
      paymentScreenshot: registration.paymentScreenshot,
      verified: true
    });

    // Generate PDF invoice
    try {
      const pdfResult = await generateInvoicePDF(payment, member);
      payment.invoicePDF = pdfResult.url;
      await payment.save();
    } catch (pdfErr) {
      console.log('PDF generation failed:', pdfErr.message);
    }

    // Update registration status
    registration.status = 'approved';
    registration.reviewedBy = req.session?.adminUsername || 'admin';
    registration.reviewedAt = new Date();
    await registration.save();

    // Send approval email (non-blocking, never fail the request)
    try {
      if (registration.email) {
        await sendApprovalEmail(registration.email, registration.phone, member);
      }
    } catch (emailErr) {
      console.log('Approval email failed (non-critical):', emailErr.message);
    }

    res.json({
      success: true,
      message: `Member ${memberId} approved successfully!`,
      memberId: member.memberId,
      invoiceNumber
    });
  } catch (err) {
    console.error('Approval error full details:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/registrations/:id/reject
router.post('/registrations/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found.' });

    registration.status = 'rejected';
    registration.rejectionReason = reason || 'Payment verification failed';
    registration.reviewedBy = req.session.adminUsername || 'admin';
    registration.reviewedAt = new Date();
    await registration.save();

    if (registration.email) {
      await sendRejectionEmail(registration.email, registration.fullName, registration.rejectionReason);
    }

    res.json({ success: true, message: 'Registration rejected.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/members
router.get('/members', async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { memberId: { $regex: search, $options: 'i' } }
      ];
    }
    const members = await Member.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Member.countDocuments(query);
    res.json({ success: true, data: members, total, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/members/:id
router.get('/members/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found.' });
    const payments = await Payment.find({ memberId: member._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: { member, payments } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/members/:id/status
router.patch('/members/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const member = await Member.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found.' });
    res.json({ success: true, message: `Member status updated to ${status}`, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/attendance/mark
router.post('/attendance/mark', async (req, res) => {
  try {
    const { memberIds, date } = req.body;
    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const results = [];
    for (const memberId of memberIds) {
      try {
        const att = await Attendance.findOneAndUpdate(
          { memberId, date: attendanceDate },
          { memberId, date: attendanceDate, status: 'present', markedBy: 'admin', checkInTime: new Date() },
          { upsert: true, new: true }
        );
        // Update member total attendance
        await Member.findByIdAndUpdate(memberId, { $inc: { totalAttendance: 1 } });
        results.push({ memberId, success: true });
      } catch (e) {
        results.push({ memberId, success: false, error: e.message });
      }
    }
    res.json({ success: true, message: `Attendance marked for ${memberIds.length} members`, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/attendance
router.get('/attendance', async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const endDate = new Date(targetDate);
    endDate.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      date: { $gte: targetDate, $lte: endDate }
    }).populate('memberId', 'fullName memberId phone');

    const allMembers = await Member.find({ status: 'active' }, 'fullName memberId phone');
    res.json({ success: true, data: { records, allMembers } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET/POST /api/admin/workout-plans
router.get('/workout-plans', async (req, res) => {
  try {
    const plans = await WorkoutPlan.find().sort({ createdAt: -1 });
    res.json({ success: true, data: plans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/workout-plans', async (req, res) => {
  try {
    const plan = await WorkoutPlan.create(req.body);
    res.json({ success: true, message: 'Workout plan created!', data: plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/workout-plans/:id', async (req, res) => {
  try {
    await WorkoutPlan.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Workout plan deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/members/:id/assign-plan
router.post('/members/:id/assign-plan', async (req, res) => {
  try {
    const { workoutPlanId } = req.body;
    const member = await Member.findByIdAndUpdate(req.params.id, { workoutPlanId }, { new: true });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found.' });
    res.json({ success: true, message: 'Workout plan assigned!', data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// CRUD /api/admin/plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await Plan.find().sort({ price: 1 });
    res.json({ success: true, data: plans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/plans', async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.json({ success: true, message: 'Plan created!', data: plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/plans/:id', async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Plan updated!', data: plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/plans/:id', async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Plan deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET/PATCH /api/admin/settings
router.get('/settings', async (req, res) => {
  try {
    let settings = await GymSettings.findOne();
    if (!settings) settings = await GymSettings.create({});
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/settings', async (req, res) => {
  try {
    let settings = await GymSettings.findOne();
    if (!settings) {
      settings = await GymSettings.create(req.body);
    } else {
      Object.assign(settings, req.body, { updatedAt: new Date() });
      await settings.save();
    }
    res.json({ success: true, message: 'Settings updated!', data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/reports
router.get('/reports', async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const m = month ? parseInt(month) - 1 : now.getMonth();
    const y = year ? parseInt(year) : now.getFullYear();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0, 23, 59, 59);

    const newMembers = await Member.countDocuments({ createdAt: { $gte: start, $lte: end } });
    const payments = await Payment.find({ createdAt: { $gte: start, $lte: end }, verified: true });
    const revenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const attendance = await Attendance.countDocuments({ date: { $gte: start, $lte: end }, status: 'present' });

    res.json({
      success: true,
      data: { newMembers, revenue, attendance, paymentsCount: payments.length, month: m + 1, year: y }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/generate-gym-qr
router.post('/generate-gym-qr', async (req, res) => {
  try {
    const { latitude, longitude, maxDistance, gymHours } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required.' });
    }

    const qrData = `FITTEX:MAIN:${latitude}:${longitude}`;
    const qrImage = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300,
      color: { dark: '#0a0a0a', light: '#FFFFFF' }
    });

    let settings = await GymSettings.findOne();
    if (!settings) settings = new GymSettings();

    settings.gymLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
    settings.checkInSettings = {
      maxDistance: maxDistance || 50,
      gymHours: {
        openTime: gymHours?.openTime ?? 6,
        closeTime: gymHours?.closeTime ?? 22
      }
    };
    settings.qrCode = { data: qrData, image: qrImage, generatedAt: new Date() };
    settings.updatedAt = new Date();
    await settings.save();

    res.json({
      success: true,
      data: { qrData, qrImage, generatedAt: settings.qrCode.generatedAt }
    });
  } catch (err) {
    console.error('Generate gym QR error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/gym-qr - Get current gym QR
router.get('/gym-qr', async (req, res) => {
  try {
    const settings = await GymSettings.findOne();
    if (!settings?.qrCode?.data) {
      return res.json({ success: true, data: null });
    }
    res.json({ success: true, data: { ...settings.qrCode.toObject?.() || settings.qrCode, settings: settings.checkInSettings, location: settings.gymLocation } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/live-attendance
router.get('/live-attendance', async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayCheckIns = await Attendance.countDocuments({
      date: { $gte: todayStart },
      status: 'present'
    });

    // Hourly stats for today
    const hourlyData = await Attendance.aggregate([
      { $match: { date: { $gte: todayStart }, status: 'present' } },
      { $group: { _id: { $hour: '$checkInTime' }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]);

    const hourlyStats = hourlyData.map(h => ({ hour: h._id, count: h.count }));

    // Recent check-ins with member info
    const recentCheckIns = await Attendance.find({
      date: { $gte: todayStart },
      status: 'present'
    })
      .populate({ path: 'memberId', model: 'Member', select: 'fullName memberId' })
      .sort({ checkInTime: -1 })
      .limit(20)
      .lean();

    const formatted = recentCheckIns.map(r => ({
      memberName: r.memberId?.fullName || r.memberName || 'Unknown',
      memberId: r.memberId?.memberId || '—',
      checkInTime: r.checkInTime,
      location: r.location
    }));

    res.json({
      success: true,
      data: {
        todayCheckIns,
        recentCheckIns: formatted,
        hourlyStats
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
