const express = require('express');
const router = express.Router();
const { getUrlAnalytics, getPublicUrlAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/public/:shortCode', getPublicUrlAnalytics);
router.get('/:urlId', protect, getUrlAnalytics);

module.exports = router;
