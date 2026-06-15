const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    let assignedRole = 'user';
    let adminRequestStatus = 'none';
    let message;

    if (role === 'admin') {
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        assignedRole = 'admin';
        adminRequestStatus = 'approved';
      } else {
        assignedRole = 'user';
        adminRequestStatus = 'pending';
        message = 'An administrator already exists. Your request to become an administrator has been sent to the existing administrator for approval.';
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      adminRequestStatus
    });

    res.status(201).json({
      success: true,
      message,
      token: generateToken(user._id),
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

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User does not exist' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
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

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request promotion to administrator
// @route   POST /api/auth/request-admin
// @access  Private
const requestAdminPromotion = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'You are already an administrator' });
    }

    if (user.adminRequestStatus === 'pending') {
      return res.status(400).json({ success: false, message: 'You already have a pending administrator request' });
    }

    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      user.role = 'admin';
      user.adminRequestStatus = 'approved';
      await user.save();
      return res.json({
        success: true,
        message: 'No administrator was found. You have been promoted to administrator automatically.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          adminRequestStatus: user.adminRequestStatus
        }
      });
    }

    user.adminRequestStatus = 'pending';
    await user.save();

    res.json({
      success: true,
      message: 'Your request to become an administrator has been submitted to the administrator for approval.',
      adminRequestStatus: user.adminRequestStatus
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new passwords' });
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  requestAdminPromotion,
  changePassword
};
