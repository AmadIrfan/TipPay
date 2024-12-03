const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    customerId: { type: String }, // Optional customer reference
    paymentMethod: { type: String, enum: ['card', 'upi', 'wallet'], required: true },
    timestamp: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Tip', tipSchema);
  
