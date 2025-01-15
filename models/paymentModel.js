const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
    razorpayPaymentId: { type: String }, // Razorpay payment ID
    receiptId: { type: String }, // Razorpay receiptId ID
    razorpayOrderId: { type: String, required: true }, // Razorpay order ID
    razorpaySignature: { type: String }, // Razorpay signature (for verification)
    paymentMethod: { type: String, enum: ['card', 'upi', 'wallet', 'online'], default: 'online' },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);

let Payment = mongoose.model('Payment', paymentSchema);

const payoutSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'failed', 'approved'] },
    requestedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
});

let Payout = mongoose.model('Payout', payoutSchema);

module.exports = {
    Payment,
    Payout
};