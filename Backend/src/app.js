const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Status Route
app.get('/api/status', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date(),
    env: process.env.NODE_ENV
  });
});

// Import and register routes
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// Redirect short URLs (e.g. GET /:code)
const urlController = require('./controllers/urlController');
app.get('/:code', urlController.redirectUrl);

// Error Handling Middleware (Must be last)
app.use(errorMiddleware);

module.exports = app;
