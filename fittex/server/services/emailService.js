const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send OTP Email
const sendOTPEmail = async (email, phone, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your FITTEX OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #BFFF00; background: #0A0A0A; padding: 20px; text-align: center;">
          FITTEX GYM
        </h2>
        <div style="padding: 20px; background: #f5f5f5;">
          <h3>Your OTP Code</h3>
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) for phone number <strong>${phone}</strong> is:</p>
          <div style="background: #0A0A0A; color: #BFFF00; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p><strong>This OTP is valid for 5 minutes.</strong></p>
          <p>If you did not request this code, please ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated email from FITTEX Gym. Please do not reply.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Email send failed:', error);
    return false;
  }
};

module.exports = { sendOTPEmail };
