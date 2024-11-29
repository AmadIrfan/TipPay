const express = require('express');
const app = express.Router();
const { sendOtp ,verifyOtp}=require('../controllers/otpController')
app.post('/verify',verifyOtp);
app.post('/send',sendOtp);
app.get('/hello', (req, res) => {
    return res.send('hello')
});

module.exports = app;