const express = require('express');
const {
    addTip,
    getTipsByPeriod,
    getTipDetails,
    requestPayout,
    getPayoutStatus,
    getPaymentsByUser,
    expirePayment,
    verifyPayment,
    paymentsWebhook,

} = require('../controllers/tipController');
const { verifyToken } = require('../utils/token');
const router = express.Router();

router.post('/newTips', verifyToken, addTip)
router.post('/verify-payment', verifyToken, verifyPayment);
router.get('/tipsPeriod', verifyToken, getTipsByPeriod);
router.get('/tipDetails', verifyToken, getTipDetails);
router.get('/getPaymentsByUser', verifyToken, getPaymentsByUser);
router.post('/check-expired-payments',verifyToken, expirePayment)
module.exports = router;


