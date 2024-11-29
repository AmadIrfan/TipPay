const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User
    message: { type: String, required: true }, // Notification Message
    type: { type: String }, // Type of Notification (e.g., tip, payout, review)
    status: { type: String, enum: ['read', 'unread'], default: 'unread' }, // Notification Status
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
