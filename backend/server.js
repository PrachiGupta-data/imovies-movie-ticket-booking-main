const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Cached DB connection for serverless environments (Vercel) & standard servers
const MONGODB_URI = process.env.MONGODB_URI;
let isConnected = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1 || isConnected) return;
  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      isConnected = true;
      console.log('✅ Connected to MongoDB Atlas!');
    } catch (err) {
      console.warn('⚠️  MongoDB Atlas notice:', err.message);
      console.warn('🚀 Live In-Memory Fallback Engine is ACTIVE.');
    }
  }
};

// Ensure database is connected before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Root & Health Check Routes
app.get(['/', '/api'], (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'MongoDB Atlas (Connected)' : 'In-Memory Fallback Engine (Active)';
  res.json({
    name: 'IMovies Movie Ticket Booking API',
    status: 'ONLINE',
    database: dbStatus,
    endpoints: {
      auth: '/api/auth',
      movies: '/api/movies',
      shows: '/api/shows',
      bookings: '/api/bookings',
      health: '/api/health',
    },
  });
});

app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'OK',
    databaseConnected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString(),
  });
});

// API Routes mounted on both /api/* and root /* for universal compatibility
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/movies', movieRoutes);
app.use('/movies', movieRoutes);

app.use('/api/shows', showRoutes);
app.use('/shows', showRoutes);

app.use('/api/bookings', bookingRoutes);
app.use('/bookings', bookingRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Only bind to local port when not in a serverless environment (e.g. Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🎬 IMovies Backend Server running on Port ${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
  });
}

module.exports = app;
