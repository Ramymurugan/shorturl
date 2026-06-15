const User = require('../models/User');
const Url = require('../models/Url');
const Analytics = require('../models/Analytics');
const { generateQRCode } = require('../services/qrService');
const { getLocalIp } = require('../utils/localIp');

// @desc    Get all users in the system
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all URLs in the system
// @route   GET /api/admin/urls
// @access  Private/Admin
const getAllUrls = async (req, res, next) => {
  try {
    const urls = await Url.find().populate('owner', 'name email').sort({ createdAt: -1 });
    
    const reqHost = req.get('host') || 'localhost:5000';
    const host = reqHost.includes('localhost')
      ? reqHost.replace('localhost', getLocalIp())
      : reqHost;
    const formattedUrls = await Promise.all(urls.map(async u => {
      const shortUrl = `${req.protocol}://${host}/${u.shortCode}`;
      const qrCode = await generateQRCode(u.originalUrl);
      return {
        _id: u._id,
        owner: u.owner,
        originalUrl: u.originalUrl,
        shortCode: u.shortCode,
        shortUrl,
        qrCode,
        isActive: u.isActive,
        clicks: u.clicks,
        expiresAt: u.expiresAt,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt
      };
    }));

    res.json({
      success: true,
      count: formattedUrls.length,
      urls: formattedUrls
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system-wide stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalUrls = await Url.countDocuments();
    const activeUrls = await Url.countDocuments({ isActive: true });

    const clicksAggregation = await Url.aggregate([
      { $group: { _id: null, totalClicks: { $sum: '$clicks' } } }
    ]);
    const totalClicks = clicksAggregation.length > 0 ? clicksAggregation[0].totalClicks : 0;

    // Fetch logs from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentLogs = await Analytics.find({ timestamp: { $gte: sevenDaysAgo } });

    // Calculate today's clicks
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayClicks = await Analytics.countDocuments({ timestamp: { $gte: startOfToday } });

    // Generate daily click trend (last 7 days)
    const clickTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const day = d.getDate();
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      clickTrend.push({
        name: `${day} ${month}`,
        clicks: 0,
        dateKey: d.toDateString()
      });
    }

    recentLogs.forEach(log => {
      const logDateString = new Date(log.timestamp).toDateString();
      const dailyItem = clickTrend.find(item => item.dateKey === logDateString);
      if (dailyItem) {
        dailyItem.clicks++;
      }
    });

    // Clean up temporary keys
    clickTrend.forEach(item => {
      delete item.dateKey;
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalUrls,
        activeUrls,
        inactiveUrls: totalUrls - activeUrls,
        totalClicks,
        todayClicks,
        clickTrend
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pending admin requests
// @route   GET /api/admin/requests
// @access  Private/Admin
const getPendingAdminRequests = async (req, res, next) => {
  try {
    const requests = await User.find({ adminRequestStatus: 'pending' }).sort({ updatedAt: -1 });
    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a pending admin request
// @route   PUT /api/admin/requests/:userId/approve
// @access  Private/Admin
const approveAdminRequest = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'User is already an administrator' });
    }

    if (user.adminRequestStatus !== 'pending') {
      return res.status(400).json({ success: false, message: 'No pending administrator request found for this user' });
    }

    user.role = 'admin';
    user.adminRequestStatus = 'approved';
    await user.save();

    res.json({
      success: true,
      message: `User ${user.email} has been approved and promoted to administrator.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminRequestStatus: user.adminRequestStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a pending admin request
// @route   PUT /api/admin/requests/:userId/reject
// @access  Private/Admin
const rejectAdminRequest = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.adminRequestStatus !== 'pending') {
      return res.status(400).json({ success: false, message: 'No pending administrator request found for this user' });
    }

    user.adminRequestStatus = 'rejected';
    await user.save();

    res.json({
      success: true,
      message: `User ${user.email}'s administrator request was rejected.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminRequestStatus: user.adminRequestStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getAllUrls,
  getSystemStats,
  getPendingAdminRequests,
  approveAdminRequest,
  rejectAdminRequest
};
