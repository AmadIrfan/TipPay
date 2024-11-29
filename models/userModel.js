const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, // Allow custom or auto-generated ID
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  phone: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['employee', 'employer'], required: true },
  image: { type: String },
  age: { type: Number },
  title: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// userSchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

module.exports = mongoose.model('User', userSchema);
