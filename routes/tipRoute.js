const express = require('express');
const { saveTip, verifyPayment } = require('../controllers/tipController');

const router = express.Router();

router.post('/tips', saveTip)
router.post('verify-payment', verifyPayment);

module.exports = router;


