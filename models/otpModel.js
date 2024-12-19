const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true, // Ensure one OTP per phone at a time
        validate: {
            validator: function (value) {
                return /^\d{10}$/.test(value); // Validate 10-digit phone numbers
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    fcmToken: {
        type: String,
        required: true
    },
    otp: { type: String, required: true },
    otpExpires: { type: Date, required: true }, // Expiry time for OTP
}, { timestamps: true });

module.exports = mongoose.model('OTP', otpSchema);
