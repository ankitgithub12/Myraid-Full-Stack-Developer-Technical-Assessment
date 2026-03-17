const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const crypto = require('crypto');
const sendResetEmail = require('../utils/sendEmail');


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, passwordInputLength: password?.length });

  const user = await User.findOne({ email });
  console.log('User found:', user ? user.email : null);

  if (user) {
    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch);
    if (isMatch) {
      generateToken(res, user._id);
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    }
  }
  
  console.log('Login failed: Invalid email or password');
  res.status(401);
  throw new Error('Invalid email or password');
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Forgot Password (Generate Token)
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404);
    throw new Error('There is no user with that email');
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save();

  // Build the reset URL pointing at the FRONTEND (React), not the backend
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/resetpassword/${resetToken}`;

  // If Gmail credentials are configured, send a real email
  const emailConfigured =
    process.env.EMAIL_USER &&
    process.env.EMAIL_USER !== 'your_gmail@gmail.com';

  if (emailConfigured) {
    try {
      await sendResetEmail(user.email, resetToken);
      res.status(200).json({
        success: true,
        message: `Password reset email sent to ${user.email}. Check your inbox (and spam folder).`,
      });
    } catch (emailError) {
      // If email fails, clear the token so it can be retried
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500);
      throw new Error('Email could not be sent. Please try again later.');
    }
  } else {
    // Dev / demo mode — return the link directly in the response
    res.status(200).json({
      success: true,
      message: 'Demo mode: Email credentials not set. Copy the link below to reset your password.',
      data: resetUrl,
    });
  }
});

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired password reset token');
  }

  // Set new password
  user.password = req.body.password;
  
  // Clear reset token fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  
  await user.save();

  // Generate new JWT
  generateToken(res, user._id);

  res.status(200).json({
    success: true,
    message: 'Password perfectly reset',
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
};
