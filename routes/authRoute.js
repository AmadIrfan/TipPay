const express = require('express');
// const phoneOtp = require('./otpRoute');
const { registerWithEmail, loginWithEmail, sendOtp, verifyOtp,resetPassword } = require('../controllers/authController');
const router = express.Router();


router.post('/register/email', registerWithEmail);
router.post('/login/email', loginWithEmail);
router.post('/phone/send-otp', sendOtp);
router.post('/phone/verifyUser',verifyOtp)
router.post('/resetPassword',resetPassword)
module.exports = router;
