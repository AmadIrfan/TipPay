const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebase_id: { type:String}, // Allow custom or auto-generated ID
  name: { type: String },
  email: { type: String, unique: true, sparse: true, default: null },
  password: { type: String },
  phone: { type: String, unique: true, sparse: true, default: null },
  role: { type: String, enum: ['employee', 'employer'], required: true },
  image: { type: String },
  age: { type: Number },
  title: { type: String },
  isActive: { type: Boolean, default: true },
  fcm_token:{ type: String, default: '' },
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);
