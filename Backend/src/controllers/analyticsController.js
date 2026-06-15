const Analytics = require('../models/Analytics');
const Url = require('../models/Url');

// @desc    Get analytics for a specific URL
// @route   GET /api/analytics/:urlId
// @access  Private
const getUrlAnalytics = async (req, res, next) => {
  try {
    const { urlId } = req.params;

    const url = await Url.findById(urlId);
    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    if (url.owner && url.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view these analytics' });
    }

    const logs = await Analytics.find({ urlId }).sort({ timestamp: -1 });

    const stats = {
      totalClicks: url.clicks,
      browsers: {},
      os: {},
      devices: {},
      referrers: {},
      countries: {},
      recentVisits: logs.slice(0, 10)
    };

    // Generate daily click trend (last 7 days)
    const dailyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const day = d.getDate();
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      dailyTrend.push({
        name: `${day} ${month}`,
        clicks: 0,
        dateKey: d.toDateString()
      });
    }

    // Generate weekly click trend (last 4 weeks)
    const weeklyTrend = [];
    for (let i = 3; i >= 0; i--) {
      const label = i === 0 ? 'This Week' : `${i} Wk${i > 1 ? 's' : ''} Ago`;
      weeklyTrend.push({
        name: label,
        clicks: 0
      });
    }

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    logs.forEach(log => {
      stats.browsers[log.browser] = (stats.browsers[log.browser] || 0) + 1;
      stats.os[log.os] = (stats.os[log.os] || 0) + 1;
      stats.devices[log.device] = (stats.devices[log.device] || 0) + 1;
      stats.referrers[log.referrer] = (stats.referrers[log.referrer] || 0) + 1;
      stats.countries[log.country || 'Unknown'] = (stats.countries[log.country || 'Unknown'] || 0) + 1;

      // Populate Daily Trend
      const logDateString = new Date(log.timestamp).toDateString();
      const dailyItem = dailyTrend.find(item => item.dateKey === logDateString);
      if (dailyItem) {
        dailyItem.clicks++;
      }

      // Populate Weekly Trend
      const logDate = new Date(log.timestamp);
      const diffTime = todayEnd - logDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const weekIndex = Math.floor(diffDays / 7);
      if (weekIndex >= 0 && weekIndex < 4) {
        weeklyTrend[3 - weekIndex].clicks++;
      }
    });

    // Clean up temporary keys
    dailyTrend.forEach(item => {
      delete item.dateKey;
    });

    stats.dailyTrend = dailyTrend;
    stats.weeklyTrend = weeklyTrend;

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public analytics for a shortened URL by its shortCode
// @route   GET /api/analytics/public/:shortCode
// @access  Public
const getPublicUrlAnalytics = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    const logs = await Analytics.find({ urlId: url._id }).sort({ timestamp: -1 });

    const stats = {
      totalClicks: url.clicks,
      browsers: {},
      os: {},
      devices: {},
      referrers: {},
      countries: {},
      recentVisits: logs.slice(0, 10)
    };

    logs.forEach(log => {
      stats.browsers[log.browser] = (stats.browsers[log.browser] || 0) + 1;
      stats.os[log.os] = (stats.os[log.os] || 0) + 1;
      stats.devices[log.device] = (stats.devices[log.device] || 0) + 1;
      stats.referrers[log.referrer] = (stats.referrers[log.referrer] || 0) + 1;
      stats.countries[log.country || 'Unknown'] = (stats.countries[log.country || 'Unknown'] || 0) + 1;
    });

    // Generate daily click trend (last 7 days)
    const dailyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const day = d.getDate();
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      dailyTrend.push({
        name: `${day} ${month}`,
        clicks: 0,
        dateKey: d.toDateString()
      });
    }

    // Generate weekly click trend (last 4 weeks)
    const weeklyTrend = [];
    for (let i = 3; i >= 0; i--) {
      const label = i === 0 ? 'This Week' : `${i} Wk${i > 1 ? 's' : ''} Ago`;
      weeklyTrend.push({
        name: label,
        clicks: 0
      });
    }

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    logs.forEach(log => {
      const logDateString = new Date(log.timestamp).toDateString();
      const dailyItem = dailyTrend.find(item => item.dateKey === logDateString);
      if (dailyItem) {
        dailyItem.clicks++;
      }

      const logDate = new Date(log.timestamp);
      const diffTime = todayEnd - logDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const weekIndex = Math.floor(diffDays / 7);
      if (weekIndex >= 0 && weekIndex < 4) {
        weeklyTrend[3 - weekIndex].clicks++;
      }
    });

    dailyTrend.forEach(item => {
      delete item.dateKey;
    });

    stats.dailyTrend = dailyTrend;
    stats.weeklyTrend = weeklyTrend;

    const reqHost = req.get('host') || 'localhost:5000';
    const shortUrl = `${req.protocol}://${reqHost}/${url.shortCode}`;

    res.json({
      success: true,
      stats,
      url: {
        originalUrl: url.originalUrl,
        shortUrl,
        createdAt: url.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUrlAnalytics,
  getPublicUrlAnalytics
};
