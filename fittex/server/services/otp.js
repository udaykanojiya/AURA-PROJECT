const nodemailer = require('nodemailer');
const User = require('../models/User');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create email transporter
const createTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && 
      process.env.EMAIL_USER !== 'your_gmail@gmail.com') {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return null;
};

// Send OTP
const sendOTP = async (phone) => {
  try {
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save or update user with OTP
    await User.findOneAndUpdate(
      { phone },
      { phone, otpCode: otp, otpExpiry: expiry, isVerified: false },
      { upsert: true, new: true }
    );

    // Try to send via email
    const transporter = createTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"FITTEX GYM" <${process.env.EMAIL_USER}>`,
          to: `${phone}@gmail.com`, // Fallback - ideally use actual email
          subject: 'FITTEX GYM - Your OTP Code',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:400px;margin:0 auto;background:#0a0a0a;padding:30px;border-radius:10px;">
              <h2 style="color:#BFFF00;text-align:center;">FITTEX GYM</h2>
              <p style="color:#fff;text-align:center;">Your OTP is:</p>
              <h1 style="color:#BFFF00;text-align:center;font-size:48px;letter-spacing:10px;">${otp}</h1>
              <p style="color:#aaa;text-align:center;font-size:12px;">Valid for 5 minutes. Do not share this OTP.</p>
            </div>
          `
        });
      } catch (emailErr) {
        console.log('Email failed, OTP logged to console:', emailErr.message);
      }
    }

    // Always log OTP to console for development
    console.log(`\n🔐 OTP for ${phone}: ${otp} (expires in 5 min)\n`);
    
    return { success: true, otp }; // Return otp for dev purposes
  } catch (error) {
    throw new Error('Failed to send OTP: ' + error.message);
  }
};

// Verify OTP
const verifyOTP = async (phone, otp) => {
  try {
    const user = await User.findOne({ phone });
    
    if (!user) {
      return { success: false, message: 'Phone number not found. Please request OTP first.' };
    }
    
    if (!user.otpCode) {
      return { success: false, message: 'No OTP found. Please request a new OTP.' };
    }
    
    if (new Date() > user.otpExpiry) {
      return { success: false, message: 'OTP has expired. Please request a new OTP.' };
    }
    
    if (user.otpCode !== otp.toString()) {
      return { success: false, message: 'Invalid OTP. Please try again.' };
    }
    
    // Mark as verified, clear OTP
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    return { success: true, userId: user._id };
  } catch (error) {
    throw new Error('OTP verification failed: ' + error.message);
  }
};

module.exports = { sendOTP, verifyOTP, generateOTP };
