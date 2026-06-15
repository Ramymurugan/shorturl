const Url = require('../models/Url');
const Analytics = require('../models/Analytics');
const { generateUniqueCode } = require('../services/shortCodeService');
const { generateQRCode } = require('../services/qrService');
const { recordVisit } = require('../services/analyticsService');
const { getLocalIp } = require('../utils/localIp');
const env = require('../config/env');

// @desc    Create a short URL
// @route   POST /api/url/shorten
// @access  Public/Optional Private
const createUrl = async (req, res, next) => {
  try {
    const { originalUrl, customCode, expiresAt } = req.body;
    let shortCode = '';

    if (customCode) {
      shortCode = customCode.trim();
      const existing = await Url.findOne({ shortCode });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Custom shortcode is already taken' });
      }
    } else {
      shortCode = await generateUniqueCode();
    }

    const reqHost = req.get('host') || 'localhost:5000';
    const host = reqHost.includes('localhost')
      ? reqHost.replace('localhost', getLocalIp())
      : reqHost;
    const shortUrl = `${req.protocol}://${host}/${shortCode}`;
    const qrCode = await generateQRCode(originalUrl);
    const owner = req.user ? req.user.id : null;

    const urlDoc = await Url.create({
      originalUrl,
      shortCode,
      owner,
      qrCode,
      expiresAt: expiresAt || null
    });

    res.status(201).json({
      success: true,
      url: {
        id: urlDoc._id,
        originalUrl: urlDoc.originalUrl,
        shortCode: urlDoc.shortCode,
        shortUrl,
        qrCode,
        isActive: urlDoc.isActive,
        clicks: urlDoc.clicks,
        expiresAt: urlDoc.expiresAt,
        createdAt: urlDoc.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user shortened URLs
// @route   GET /api/url/my-urls
// @access  Private
const getMyUrls = async (req, res, next) => {
  try {
    const urls = await Url.find({ owner: req.user.id }).sort({ createdAt: -1 });

    const reqHost = req.get('host') || 'localhost:5000';
    const host = reqHost.includes('localhost')
      ? reqHost.replace('localhost', getLocalIp())
      : reqHost;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const formattedUrls = await Promise.all(urls.map(async u => {
      const shortUrl = `${req.protocol}://${host}/${u.shortCode}`;
      const qrCode = await generateQRCode(u.originalUrl);
      
      const todayClicks = await Analytics.countDocuments({
        urlId: u._id,
        timestamp: { $gte: startOfToday }
      });

      return {
        id: u._id,
        originalUrl: u.originalUrl,
        shortCode: u.shortCode,
        shortUrl,
        qrCode,
        isActive: u.isActive,
        clicks: u.clicks,
        todayClicks,
        expiresAt: u.expiresAt,
        createdAt: u.createdAt
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

// @desc    Delete shortened URL
// @route   DELETE /api/url/:id
// @access  Private
const deleteUrl = async (req, res, next) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ success: false, message: 'URL record not found' });
    }

    if (url.owner && url.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this URL' });
    }

    await url.deleteOne();

    res.json({
      success: true,
      message: 'Short URL deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Redirect to original URL
// @route   GET /:code
// @access  Public
const redirectUrl = async (req, res, next) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });

    if (!url) {
      return res.status(404).send('<h1>Link Not Found</h1>');
    }

    if (url.expiresAt && new Date() > new Date(url.expiresAt)) {
      url.isActive = false;
      await url.save();
      return res.status(404).send('<h1>Link Expired</h1>');
    }

    if (!url.isActive) {
      return res.status(404).send('<h1>Link Inactive</h1>');
    }

    recordVisit(url._id, req);

    res.redirect(url.originalUrl);
  } catch (error) {
    next(error);
  }
};

// @desc    Update destination URL
// @route   PUT /api/url/:id
// @access  Private
const updateUrl = async (req, res, next) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ success: false, message: 'Please provide a destination URL' });
    }

    const url = await Url.findById(req.params.id);
    if (!url) {
      return res.status(404).json({ success: false, message: 'URL record not found' });
    }

    if (url.owner && url.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this URL' });
    }

    url.originalUrl = originalUrl;
    const { generateQRCode } = require('../services/qrService');
    url.qrCode = await generateQRCode(originalUrl);

    await url.save();

    res.json({
      success: true,
      message: 'Short URL updated successfully',
      url
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create bulk short URLs
// @route   POST /api/url/bulk-shorten
// @access  Private
const createBulkUrls = async (req, res, next) => {
  try {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ success: false, message: 'Please provide an array of URLs' });
    }

    const results = [];
    const owner = req.user ? req.user.id : null;
    const reqHost = req.get('host') || 'localhost:5000';
    const host = reqHost.includes('localhost')
      ? reqHost.replace('localhost', getLocalIp())
      : reqHost;

    for (const item of urls) {
      try {
        const { originalUrl, customCode, expiresAt } = item;

        if (!originalUrl) {
          results.push({ originalUrl: originalUrl || 'Unknown', success: false, error: 'Original URL is required' });
          continue;
        }

        // Validate URL format
        let isUrlValid = true;
        try {
          new URL(originalUrl);
        } catch (e) {
          isUrlValid = false;
        }
        if (!isUrlValid) {
          results.push({ originalUrl, success: false, error: 'Invalid URL format' });
          continue;
        }

        let shortCode = '';
        if (customCode) {
          shortCode = customCode.trim();
          const existing = await Url.findOne({ shortCode });
          if (existing) {
            results.push({ originalUrl, success: false, error: `Custom alias "${customCode}" is already taken` });
            continue;
          }
        } else {
          shortCode = await generateUniqueCode();
        }

        const shortUrl = `${req.protocol}://${host}/${shortCode}`;
        const qrCode = await generateQRCode(originalUrl);

        const urlDoc = await Url.create({
          originalUrl,
          shortCode,
          owner,
          qrCode,
          expiresAt: expiresAt || null
        });

        results.push({
          success: true,
          originalUrl,
          url: {
            id: urlDoc._id,
            originalUrl: urlDoc.originalUrl,
            shortCode: urlDoc.shortCode,
            shortUrl,
            qrCode,
            clicks: urlDoc.clicks,
            expiresAt: urlDoc.expiresAt,
            createdAt: urlDoc.createdAt
          }
        });
      } catch (err) {
        results.push({
          originalUrl: item.originalUrl || 'Unknown',
          success: false,
          error: err.message || 'Server error shortening this URL'
        });
      }
    }

    res.status(200).json({
      success: true,
      results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUrl,
  getMyUrls,
  deleteUrl,
  redirectUrl,
  updateUrl,
  createBulkUrls
};
