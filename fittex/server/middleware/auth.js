const Member = require('../models/Member');

// Middleware: Check if member is logged in
const requireMemberAuth = async (req, res, next) => {
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

// Middleware: Check if admin is logged in
const requireAdminAuth = (req, res, next) => {
  if (!req.session || !req.session.isAdmin) {
    return res.status(401).json({ success: false, message: 'Admin authentication required.' });
  }
  next();
};

module.exports = { requireMemberAuth, requireAdminAuth };
