const express = require('express');
const router = express.Router();
const { getAllUsers, getAllUrls, getSystemStats, getPendingAdminRequests, approveAdminRequest, rejectAdminRequest } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/adminMiddleware');

// Group routes under auth/admin check
router.use(protect);
router.use(authorizeAdmin);

router.get('/users', getAllUsers);
router.get('/urls', getAllUrls);
router.get('/stats', getSystemStats);
router.get('/requests', getPendingAdminRequests);
router.put('/requests/:userId/approve', approveAdminRequest);
router.put('/requests/:userId/reject', rejectAdminRequest);

module.exports = router;
