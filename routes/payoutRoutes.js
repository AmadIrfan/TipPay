const express = require('express');
const { payout, approvePayout } = require('../controllers/payoutController');
const { verifyToken } = require('../utils/token');
const app = express.Router();

app.post('/payouts/',verifyToken, payout)
app.patch('/payouts/:id', approvePayout)


module.exports = app;