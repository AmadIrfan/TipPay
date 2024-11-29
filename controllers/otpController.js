

const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


let sendOtp = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Send OTP via SMS using Twilio
        const message = await client.messages.create({
            body: `Your OTP code is: ${otp}`,
            from: "+923460151920", // Your Twilio phone number
            to: phoneNumber, // The recipient's phone number
        });

        // You would ideally store the OTP and associate it with the phone number for verification later
        // For simplicity, we'll send OTP back to client (in a real scenario, store this OTP securely)
        res.status(200).json({
            status: 'ok',
            message: 'OTP sent successfully',
            data: { phoneNumber, otp }, // Send the OTP back (for testing purposes)
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
            data: null,
        });
    }
}
let verifyOtp = (req, res) => {
    const { phoneNumber, otp, enteredOtp } = req.body;

    // Compare OTPs (in a real scenario, you'd retrieve the OTP from the database or cache)
    if (otp === enteredOtp) {
        // Generate JWT Token after OTP verification
        const token = "this.is.your.token";

        res.status(200).json({
            status: 'ok',
            message: 'Phone number verified successfully',
            data: { token }, // Send back JWT token
        });
    } else {
        res.status(400).json({
            status: 'error',
            message: 'Invalid OTP',
            data: null,
        });
    }
}
module.exports = {
    verifyOtp, sendOtp,
}