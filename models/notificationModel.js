const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }, // Reference to the User
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        }, // Sender of the notification (if applicable)
        title: {
            type: String,
            required: true,
            maxlength: 100 // Maximum length for title
        }, // Notification title
        message: {
            type: String,
            required: true,
            maxlength: 500 // Maximum length for body
        }, // Notification body message
        type: {
            type: String,
            enum: ['tip', 'payout', 'review', 'general'],
            default: 'general'
        }, // Type of Notification
        status: {
            type: String,
            enum: ['read', 'unread'],
            default: 'unread'
        }, // Notification Status
        isActive: {
            type: Boolean,
            default: true
        }, // Active status of the notification
    },
    {
        timestamps: true
    } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Notification', notificationSchema);
