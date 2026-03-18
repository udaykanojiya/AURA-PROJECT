const nodemailer = require('nodemailer');

// Create transporter
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT) || 587;

console.log(`📡 SMTP Config: Host=${smtpHost}, Port=${smtpPort}`);

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ SMTP Transporter Verification Error:', error.message);
  } else {
    console.log('✅ SMTP Transporter is ready to send emails');
  }
});

// Send OTP Email
const sendOTPEmail = async (email, phone, otp) => {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    console.error('❌ Email credentials (SMTP_USER/SMTP_PASSWORD) are missing in environment variables.');
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"FITTEX GYM" <${process.env.EMAIL_USER}>`,
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
          <p>Your One-Time Password (OTP) for phone number <strong>${phone || 'your account'}</strong> is:</p>
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
    console.log('✅ OTP email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    if (error.code === 'ETIMEDOUT') {
      console.error('💡 Hint: Connection timed out. This could be due to network restrictions on Port 465/587 or incorrect SMTP host.');
    } else if (error.code === 'EAUTH') {
      console.error('💡 Hint: SMTP Authentication failed. Check your EMAIL_USER and EMAIL_PASSWORD (use App Password for Gmail).');
    }
    return false;
  }
};

module.exports = { sendOTPEmail };
