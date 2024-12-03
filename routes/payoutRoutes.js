const express = require('express');
const { payout, approvePayout } = require('../controllers/payoutController');
const app = express.Router();

app.post('/payouts/', payout)
app.patch('/payouts/:id', approvePayout)


module.exports = app;