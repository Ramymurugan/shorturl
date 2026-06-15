const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
    index: true
  },
  ipAddress: {
    type: String,
    default: 'Unknown'
  },
  userAgent: {
    type: String
  },
  browser: {
    type: String
  },
  os: {
    type: String
  },
  device: {
    type: String
  },
  referrer: {
    type: String,
    default: 'Direct'
  },
  country: {
    type: String,
    default: 'United States'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
