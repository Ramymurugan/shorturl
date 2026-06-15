const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, requestAdminPromotion, changePassword } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', protect, getMe);
router.post('/request-admin', protect, requestAdminPromotion);
router.put('/change-password', protect, changePassword);

module.exports = router;
