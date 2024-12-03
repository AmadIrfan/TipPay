const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebase_id: { type: String },
  name: { type: String },
  email: { type: String, unique: true, sparse: true, default: null },
  password: { type: String },
  phone: { type: String, unique: true, sparse: true, default: null },
  role: { type: String, enum: ['employee', 'employer'], required: true },
  image: { type: String },
  age: { type: Number },
  title: { type: String },
  isActive: { type: Boolean, default: true },
  fcm_token: { type: String, default: '' },
  bankDetails: {
    accountNumber: { type: String },
    bankName: { type: String },
    ifscCode: { type: String }
  },
  totalTips: { type: Number, default: 0 }, // Sum of all tips
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
