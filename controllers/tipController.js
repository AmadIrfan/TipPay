const Razorpay = require('razorpay');
const { Payment } = require('../models/paymentModel');
const Tip = require('../models/tipModels');
const User = require('../models/userModel');


const razorpay = new Razorpay({
  key_id: 'your_key_id',
  key_secret: 'your_key_secret',
});

let saveTip = async (req, res) => {
  const { employeeId, amount, customerId, paymentMethod } = req.body;

  try {
    // Step 1: Create Razorpay Payment Order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    // Step 2: Save Payment in Database
    const payment = new Payment({
      userId: employeeId,
      amount,
      status: 'pending',
      transactionId: order.id,
      paymentMethod,
    });
    await payment.save();

    // Step 3: Save Tip in Database
    const tip = new Tip({
      employeeId,
      amount,
      customerId,
      paymentMethod,
    });
    await tip.save();

    // Step 4: Respond with Payment Order
    res.status(200).json({ status: 'ok', message: 'Tip initiated', data: { order, payment } });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ status: 'error', message: `Error creating ${error.message}`, data: null });
  }
}
const crypto = require('crypto');
const { log } = require('console');

let verifyPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  try {
    // Step 1: Verify Razorpay Signature
    const hmac = crypto.createHmac('sha256', 'your_key_secret');
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = hmac.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ status: 'error', data: null, message: 'Payment verification failed' });
    }

    // Step 2: Update Payment Status
    const payment = await Payment.findOneAndUpdate(
      { transactionId: razorpay_order_id },
      { status: 'success' },
      { new: true }
    );

    // Step 3: Respond with Payment Details
    res.status(200).json({ status: 'ok', data: { payment }, message: 'Payment verified successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', data: null, message: `Error verifying payment ${error}` });
  }
}


module.exports = {
  saveTip,
  verifyPayment,
}