const express = require('express');
// const phoneOtp = require('./otpRoute');
const { registerWithEmail, loginWithEmail, authWithPhone } = require('../controllers/authController');
const router = express.Router();


router.post('/register/email', registerWithEmail);
router.post('/login/email', loginWithEmail);
// router.post('/login/phone', loginWithEmail);
router.post('/register/phone', authWithPhone);
// router.use('/Otp', phoneOtp)
module.exports = router;
