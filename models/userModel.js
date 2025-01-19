const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "ABC" },
  email: {
    type: String,
    sparse: true,
    default: null,
    validate: {
      validator: function (value) {
        return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  phone: {
    type: String,
    default: null,
    sparse: true,
  },
  password: { type: String },
  role: { type: String, enum: ['employee', 'employer'], required: true },
  profilePicture: { type: String },
  age: { type: Number },
  title: { type: String },
  isActive: { type: Boolean, default: true },
  fcm_token: { type: String, default: '' },
  bankDetails: {
    accountNumber: { type: String },
    bankName: { type: String },
    ifscCode: { type: String }
  },
  totalTips: { type: Number, default: 0 },
  employeeDetails: {
    department: { type: String },
    organizationName: { type: String }
  },

}, { timestamps: true });

userSchema.pre('save', function (next) {
  if (this.role === 'employee') {
  } else {
    this.employeeDetails = undefined;
  }
  next();
});

userSchema.index({ email: 1 }, { sparse: true });
userSchema.index({ phone: 1 }, { sparse: true });
module.exports = mongoose.model('User', userSchema);
