const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  customerId: { type: String }, // Optional customer reference
  paymentMethod: { type: String, default: 'online' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Tip', tipSchema);

