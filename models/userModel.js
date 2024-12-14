const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true,default:"ABC" },
  email: {
    type: String, unique: true, default: null, validate: {
      validator: function (value) {
        // Regular expression to validate email format
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: { type: String, required: true },
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
