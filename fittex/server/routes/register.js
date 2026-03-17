const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Plan = require('../models/Plan');
const upload = require('../middleware/upload');

// POST /api/register/upload-screenshot
router.post('/upload-screenshot', upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl, filename: req.file.filename });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/register
router.post('/', async (req, res) => {
  try {
    const {
      fullName, phone, email, age, gender,
      height, weight, fitnessGoal, experienceLevel,
      planId, paymentScreenshot
    } = req.body;

    // Validate required fields
    if (!fullName || !phone || !planId || !paymentScreenshot) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: fullName, phone, planId, paymentScreenshot'
      });
    }

    // Check for duplicate pending registration
    const existing = await Registration.findOne({ phone: phone.replace(/\D/g, ''), status: 'pending' });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A pending registration already exists for this phone number.'
      });
    }

    // Get plan details
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(400).json({ success: false, message: 'Selected plan not found.' });
    }

    // Calculate BMI
    const bmi = height && weight ? parseFloat((weight / ((height / 100) ** 2)).toFixed(1)) : null;

    const registration = await Registration.create({
      fullName,
      phone: phone.replace(/\D/g, ''),
      email,
      age: parseInt(age),
      gender,
      height: parseFloat(height),
      weight: parseFloat(weight),
      bmi,
      fitnessGoal,
      experienceLevel,
      planId: plan._id,
      planName: plan.planName,
      amount: plan.price,
      paymentScreenshot,
      status: 'pending'
    });

    res.json({
      success: true,
      message: 'Registration submitted successfully! You\'ll receive confirmation within 24 hours.',
      registrationId: registration._id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
