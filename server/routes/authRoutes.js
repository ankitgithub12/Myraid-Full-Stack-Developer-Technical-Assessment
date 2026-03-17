const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const {
  userRegisterValidation,
  userLoginValidation,
} = require('../middleware/validationMiddleware');

router.post('/register', userRegisterValidation, registerUser);
router.post('/login', userLoginValidation, loginUser);
router.post('/logout', logoutUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
