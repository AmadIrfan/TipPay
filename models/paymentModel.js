const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['success', 'failed', 'pending'], required: true },
    transactionId: { type: String, unique: true },
    paymentMethod: { type: String, enum: ['card', 'upi', 'wallet'], required: true },
    timestamp: { type: Date, default: Date.now }
});
let Payment = mongoose.model('Payment', paymentSchema);

const payoutSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['approved', 'pending', 'declined'], default: 'pending' },
    requestedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
});

let Payout = mongoose.model('Payout', payoutSchema);

module.exports = {
    Payment,
    Payout
};