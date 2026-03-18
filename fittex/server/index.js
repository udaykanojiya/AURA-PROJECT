require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/database');

const app = express();

// Middleware
app.use(cors({ 
  origin: [
    'https://aura-project-ashy.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration for cross-domain persistence
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.set('trust proxy', 1); // Trust first proxy (Render)
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'fittex-super-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction, // Required for sameSite: 'none'
    sameSite: isProduction ? 'none' : 'lax', // Required for cross-domain cookies
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Connect Database
connectDB();

// Import Routes
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const memberRoutes = require('./routes/member');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/member', memberRoutes);

// Health Route
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});