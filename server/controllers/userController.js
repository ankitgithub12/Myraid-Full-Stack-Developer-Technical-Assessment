const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');

// @desc    Get user profile (Current Token User)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile (Name / Email)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
const updateUserPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Check old password matches before allowing an update
    if (await user.matchPassword(req.body.currentPassword)) {
      user.password = req.body.newPassword;
      await user.save();

      // Regenerate token to maintain session
      generateToken(res, user._id);

      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401);
      throw new Error('Current password is incorrect');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Verify password first as a security measure
    if (await user.matchPassword(req.body.password)) {
      // Delete the user from DB entirely
      await user.deleteOne();

      // Clear the cookie session
      res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
      });

      res.json({ message: 'User removed successfully' });
    } else {
      res.status(401);
      throw new Error('Incorrect password. Account cannot be deleted.');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  deleteUserProfile,
};
