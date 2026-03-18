const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP } = require('../services/otpService');
const jwt = require('jsonwebtoken');
const GymSettings = require('../models/GymSettings');

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ success: false, message: 'Invalid email format' });
    await sendOTP(email);
    res.json({ success: true, message: `OTP sent to ${email}. Valid for 5 minutes.` });
  } catch (error) {
    console.error('Error in send-otp:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    const result = await verifyOTP(email, otp);
    if (!result.success) return res.status(400).json(result);
    res.json({ success: true, message: 'OTP verified successfully', data: { userId: result.userId, email: result.email, isVerified: true } });
  } catch (error) {
    console.error('Error in verify-otp:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP. Please try again.' });
  }
});

// POST /api/auth/admin-login
router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password required' });

    let settings = null;
    try {
      // Try to find settings with a 2-second timeout
      settings = await GymSettings.findOne().maxTimeMS(2000).exec();
    } catch (e) {
      console.log('Database lookup failed or timed out, using defaults');
    }
    console.log('Admin login attempt:', { username, hasSettings: !!settings });
    if (!settings) {
      // Fallback to env/defaults
      const targetUser = process.env.ADMIN_USERNAME || 'admin';
      const targetPass = process.env.ADMIN_PASSWORD || 'admin123';
      
      if (username !== targetUser) return res.status(401).json({ success: false, message: 'Invalid admin username' });
      if (password !== targetPass) return res.status(401).json({ success: false, message: 'Invalid admin password' });
    } else {
      if (username !== settings.adminUsername) return res.status(401).json({ success: false, message: 'Invalid admin username (Settings)' });
      if (password !== settings.adminPassword) return res.status(401).json({ success: false, message: 'Invalid admin password (Settings)' });
    }

    req.session.isAdmin = true;
    req.session.adminUsername = username;
    
    // Generate JWT for Admin
    const token = jwt.sign(
      { username, role: 'admin' }, 
      process.env.JWT_SECRET || 'fittex-super-secret-jwt-key-2026',
      { expiresIn: '24h' }
    );
    
    // Explicitly save session for backward compatibility, but primarily return the token
    req.session.save((err) => {
      res.json({ 
        success: true, 
        message: 'Admin login successful', 
        token, // RETURN THE TOKEN TO FRONTEND
        data: { username, role: 'admin' } 
      });
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: 'Logged out' });
  });
});

// GET /api/auth/status
router.get('/status', (req, res) => {
  // 1. Check for JWT first (preferred)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fittex-super-secret-jwt-key-2026');
      if (decoded.role === 'admin') {
        return res.json({ role: 'admin', username: decoded.username });
      }
    } catch (err) {
      // Token invalid, fall back to session
    }
  }

  // 2. Fallback to existing session (for compatibility)
  if (req.session && req.session.isAdmin) {
    return res.json({ role: 'admin', username: req.session.adminUsername });
  }
  if (req.session && req.session.memberId) {
    return res.json({ role: 'member', memberId: req.session.memberId });
  }
  res.status(401).json({ message: 'Not authenticated' });
});

module.exports = router;
