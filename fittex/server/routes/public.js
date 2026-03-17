const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const GymSettings = require('../models/GymSettings');
const Registration = require('../models/Registration');

// GET /api/public/plans - Get all membership plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
    
    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plans'
    });
  }
});

// GET /api/public/payment-details - Get payment information
router.get('/payment-details', async (req, res) => {
  try {
    const settings = await GymSettings.findOne();
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Payment details not configured'
      });
    }

    res.json({
      success: true,
      data: {
        upiId: settings.upiId,
        upiQRCode: settings.upiQRCode,
        bankAccount: settings.bankAccount,
        bankIFSC: settings.bankIFSC,
        bankName: settings.bankName
      }
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details'
    });
  }
});

// POST /api/public/register - Submit registration
router.post('/register', async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      age,
      gender,
      height,
      weight,
      bmi,
      fitnessGoal,
      experienceLevel,
      planId,
      paymentScreenshot
    } = req.body;

    // Validate required fields
    if (!fullName || !phone || !email || !planId || !paymentScreenshot) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate base64 image
    if (!paymentScreenshot.startsWith('data:image')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format'
      });
    }

    // Get plan details
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    // Create registration
    const registration = new Registration({
      fullName,
      phone,
      email,
      age,
      gender,
      height,
      weight,
      bmi,
      fitnessGoal,
      experienceLevel,
      planId: plan._id,
      planName: plan.planName,
      amount: plan.price,
      paymentScreenshot, // Store base64 directly
      status: 'pending'
    });

    await registration.save();

    res.json({
      success: true,
      message: 'Registration submitted successfully! You will receive confirmation within 24 hours.',
      data: {
        registrationId: registration._id
      }
    });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit registration'
    });
  }
});

module.exports = router;
