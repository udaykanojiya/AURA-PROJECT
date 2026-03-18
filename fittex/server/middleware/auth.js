const Member = require('../models/Member');
const jwt = require('jsonwebtoken');

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

// Middleware: Check if admin is logged in (supports both Session and JWT)
const requireAdminAuth = (req, res, next) => {
  // 1. Try JWT from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fittex-super-secret-jwt-key-2026');
      if (decoded.role === 'admin') {
        req.admin = decoded;
        return next();
      }
    } catch (err) {
      // Token invalid, fall back to session
    }
  }

  // 2. Fallback to Session
  if (req.session && req.session.isAdmin) {
    return next();
  }

  return res.status(401).json({ success: false, message: 'Admin authentication required.' });
};

module.exports = { requireMemberAuth, requireAdminAuth };
