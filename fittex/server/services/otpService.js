const User = require('../models/User');
const { sendOTPEmail } = require('./emailService');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to user
const sendOTP = async (email) => {
  try {
    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save or update user
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      user = new User({
        email: email.toLowerCase(),
        otpCode: otp,
        otpExpiry,
        isVerified: false
      });
    } else {
      user.otpCode = otp;
      user.otpExpiry = otpExpiry;
    }

    await user.save();

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, '', otp); // Send empty phone

    if (!emailSent) {
      throw new Error('Failed to send OTP email');
    }

    return {
      success: true,
      message: 'OTP sent to your email'
    };
  } catch (error) {
    console.error('Error in sendOTP:', error);
    throw error;
  }
};

// Verify OTP
const verifyOTP = async (email, otp) => {
  try {
    console.log('--- Debug: verifyOTP ---');
    console.log('Searching for email:', email);
    
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      console.log('User not found for email:', email);
      return {
        success: false,
        message: 'Email not found'
      };
    }

    console.log('User found. Stored OTP:', user.otpCode);
    console.log('Provided OTP:', otp);
    console.log('Stored Expiry:', user.otpExpiry);
    console.log('Current Time:', new Date());

    // Check if OTP expired
    if (user.otpExpiry < new Date()) {
      console.log('OTP Expired');
      return {
        success: false,
        message: 'OTP expired. Please request a new one.'
      };
    }

    // Check if OTP matches (trim and stringify to be safe)
    if (String(user.otpCode).trim() !== String(otp).trim()) {
      console.log('OTP Mismatch!');
      return {
        success: false,
        message: 'Invalid OTP'
      };
    }

    console.log('✅ OTP Verified Successfully');
    // OTP is valid
    user.isVerified = true;
    user.otpCode = null; // Clear OTP
    user.otpExpiry = null;
    await user.save();

    return {
      success: true,
      message: 'OTP verified successfully',
      userId: user._id,
      email: user.email
    };
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    throw error;
  }
};

module.exports = {
  sendOTP,
  verifyOTP
};
