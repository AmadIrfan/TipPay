
const Razorpay = require('razorpay');
const { Payment, Payout } = require('../models/paymentModel');
const Tip = require('../models/tipModels');
const User = require('../models/userModel');
const crypto = require('crypto');
require('dotenv').config();


// RAZORPAY_KEY_ID=your_key_id
// RAZORPAY_KEY_SECRET=your_key_secret
// RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

let addTip = async (req, res) => {

  try {
    const { amount } = req.body;
    let employeeId = req.user.id;

    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    const payment = new Payment({
      userId: employeeId,
      amount,
      status: 'pending',
      receiptId: order.receipt,
      razorpayOrderId: order.id,
    });
    await payment.save();

    res.status(200).json({ status: 'ok', message: 'Tip initiated', data: payment });
  } catch (error) {
    res.status(500).json({ status: 'error', message: `Error creating ${error.message}`, data: null });
  }
}


let verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const body = razorpayOrderId + '|' + razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Invalid signature', data: null });
    }
    const paymentMethodFind = await razorpayInstance.payments.fetch(razorpayPaymentId);

    const paymentMethod = paymentMethodFind.method; // This will give 'card', 'upi', 'wallet', etc.


    const payment = await Payment.findOneAndUpdate(

      { razorpayOrderId },
      { status: 'success', razorpayPaymentId, razorpaySignature, paymentMethod: paymentMethod },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ success: false, message: 'payment request is not created' });

    }
    const user = await User.findById(payment.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'user not found' });
    }


    // Todo:  here i have to change  for customerID 
    const tip = new Tip({
      employeeId: payment.userId,
      amount: payment.amount,
      customerId: payment.userId,
      paymentMethod: paymentMethod
    });


    await tip.save();
    user.totalTips = Number(user.totalTips) + Number(payment.amount);

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      payment,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}


let paymentsWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const signature = req.headers['x-razorpay-signature'];
  const payload = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  if (expectedSignature !== signature) {
    return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
  }

  const event = req.body;

  if (event.event === 'payment.captured') {
    const { order_id, payment_id } = event.payload.payment.entity;

    await Payment.findOneAndUpdate(
      { razorpayOrderId: order_id },
      { status: 'success', razorpayPaymentId: payment_id }
    );
  }

  res.status(200).json({ success: true, message: 'Webhook processed successfully' });
}

let expirePayment = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ status: 'error', message: 'User ID is required.', data: null });
    }
    // Find and update payments that are pending and older than 2 days
    const result = await Payment.updateMany(
      {
        employeeId: userId, // Match the user ID
        status: 'pending', // Only pending payments
        // requestedAt: { $lte: twoDaysAgo }, // Created more than 2 days ago
      },
      {
        $set: { status: 'expired' },
      }
    );

    return res.status(200).json({
      status: 'ok',
      message: 'Expired payments checked and updated successfully.',
      data: {},
    });
  } catch (error) {
    console.error('Error checking and updating expired payments:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }
}



// Create a new tip

// Fetch tips by time period (daily, weekly, monthly)
const getTipsByPeriod = async (req, res) => {
  try {
    // const { employeeId, period } = req.params;
    const { period } = req.query;
    let employeeId = req.user.id;
    // Validate employee

    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== 'employee') {
      return res.status(400).json({ status: 'error', message: 'Invalid employee ID', data: null });
    }
    let startDate = new Date();
    if (period === 'daily') { startDate.setHours(0, 0, 0, 0); }
    else if (period === 'weekly') { startDate.setDate(startDate.getDate() - 7); }
    else if (period === 'monthly') { startDate.setDate(startDate.getDate() - 30); }
    else {
      if (!period) {
        return res.status(400).json({ status: 'error', message: 'Invalid period', data: null });
      }
      else {
        startDate.setDate(startDate.getDate() - Number.parseInt(period));
      }
    }

    const tips = await Tip.find({ employeeId, timestamp: { $gte: startDate } });

    const totalAmount = tips.reduce((sum, tip) => sum + tip.amount, 0);

    res.status(200).json({
      status: 'ok',
      message: `Tips fetched for ${period} period.`,
      data: { totalAmount, tips },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: `Error fetching tips: ${err.message}`, data: null });
  }
};

// Fetch individual tip details
const getTipDetails = async (req, res) => {
  try {
    const { tipId } = req.query;

    const tip = await Tip.findById(tipId).populate('employeeId', 'name email');

    if (!tip) {
      return res.status(404).json({ status: 'error', message: 'Tip not found', data: null });
    }

    res.status(200).json({ status: 'ok', message: 'Tip details fetched successfully', data: tip });
  } catch (err) {
    res.status(500).json({ status: 'error', message: `Error fetching tip details: ${err.message}`, data: null });
  }
};

// Add a payout request
const requestPayout = async (req, res) => {
  try {
    const { employeeId, amount } = req.body;

    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== 'employee') {
      return res.status(400).json({ status: 'error', message: 'Invalid employee ID', data: null });
    }

    const payout = new Payout({ employeeId, amount });
    await payout.save();

    res.status(201).json({
      status: 'ok',
      message: 'Payout request submitted successfully',
      data: payout,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: `Error requesting payout: ${err.message}`, data: null });
  }
};

// Fetch payout status for an employee
const getPayoutStatus = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const payouts = await Payout.find({ employeeId });

    res.status(200).json({
      status: 'ok',
      message: 'Payout status fetched successfully',
      data: payouts,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: `Error fetching payout status: ${err.message}`, data: null });
  }
};

// Fetch all payments for a user
const getPaymentsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await Payment.find({ userId });

    res.status(200).json({
      status: 'ok',
      message: 'Payments fetched successfully',
      data: payments,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: `Error fetching payments: ${err.message}`,
      data: null,
    });
  }
};

module.exports = {
  addTip,
  getTipsByPeriod,
  getTipDetails,
  requestPayout,
  getPayoutStatus,
  getPaymentsByUser,
  expirePayment, verifyPayment,
  paymentsWebhook,
};





