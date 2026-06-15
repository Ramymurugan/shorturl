const express = require('express');
const router = express.Router();
const { createUrl, getMyUrls, deleteUrl, updateUrl, createBulkUrls } = require('../controllers/urlController');
const { validateCreateUrl } = require('../validators/urlValidator');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

router.post('/shorten', optionalProtect, validateCreateUrl, createUrl);
router.get('/my-urls', protect, getMyUrls);
router.delete('/:id', protect, deleteUrl);
router.put('/:id', protect, updateUrl);
router.post('/bulk-shorten', protect, createBulkUrls);

module.exports = router;
