const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  return null;
};

const sendApprovalEmail = async (email, phone, member) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`📧 [DEV] Approval email would be sent to ${email || phone}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: `"FITTEX GYM" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to FITTEX GYM - Registration Approved!',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#0a0a0a;padding:30px;border-radius:10px;">
          <h2 style="color:#BFFF00;text-align:center;">FITTEX GYM</h2>
          <h3 style="color:#fff;">Welcome, ${member.fullName}! 🎉</h3>
          <p style="color:#aaa;">Your registration has been approved.</p>
          <div style="background:#1a1a1a;padding:15px;border-radius:8px;border-left:4px solid #BFFF00;">
            <p style="color:#fff;margin:5px 0;">Member ID: <strong style="color:#BFFF00">${member.memberId}</strong></p>
            <p style="color:#fff;margin:5px 0;">Plan: <strong style="color:#BFFF00">${member.planName}</strong></p>
            <p style="color:#fff;margin:5px 0;">Valid Until: <strong style="color:#BFFF00">${new Date(member.endDate).toLocaleDateString()}</strong></p>
          </div>
          <p style="color:#aaa;margin-top:20px;">Login with your phone number (+OTP) at our member portal.</p>
          <p style="color:#BFFF00;font-weight:bold;">SCULPT YOUR BODY, ELEVATE YOUR SPIRIT! 💪</p>
        </div>
      `
    });
  } catch (err) {
    console.log('Approval email failed:', err.message);
  }
};

const sendRejectionEmail = async (email, name, reason) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`📧 [DEV] Rejection email would be sent to ${email}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: `"FITTEX GYM" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'FITTEX GYM - Registration Update',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#0a0a0a;padding:30px;border-radius:10px;">
          <h2 style="color:#BFFF00;text-align:center;">FITTEX GYM</h2>
          <h3 style="color:#fff;">Hello ${name},</h3>
          <p style="color:#aaa;">Unfortunately, your registration could not be approved at this time.</p>
          <div style="background:#1a1a1a;padding:15px;border-radius:8px;border-left:4px solid #ff4444;">
            <p style="color:#fff;margin:5px 0;">Reason: <strong style="color:#ff4444">${reason || 'Payment verification failed'}</strong></p>
          </div>
          <p style="color:#aaa;margin-top:20px;">Please contact us for assistance or re-register with correct payment proof.</p>
          <p style="color:#aaa;">Phone: +91 98765 43210 | Email: info@fittexgym.com</p>
        </div>
      `
    });
  } catch (err) {
    console.log('Rejection email failed:', err.message);
  }
};

module.exports = { sendApprovalEmail, sendRejectionEmail };
