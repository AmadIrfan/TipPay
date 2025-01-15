// @ts-nocheck
const User = require('../models/userModel');
const Otp = require('../models/otpModel');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose")
const { generateToken } = require('../utils/token');
const { sendMsg } = require('../controllers/notificationController');

const registerWithEmail = async (req, res) => {
    const { email, password, role } = req.body;
    try {


        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'Email already registered', data: null });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        let name = email.split("@")[0];
        const newUser = new User({ name: name, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({
            status: 'ok',
            message: 'User registered successfully',
            data: { id: newUser._id, email: newUser.email },
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message, data: null });
    }
};

// Login Endpoint
const loginWithEmail = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password', data: null });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password', data: null });
        }

        let token = generateToken(user._id, user.role);
        res.status(200).json({
            status: 'ok',
            message: 'Login successful',
            data: { token },
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message, data: null });
    }
};
const authWithPhone = async (req, res) => {
    try {
        let { id, phoneNumber, role } = req.body;
        if (!phoneNumber || !id) {
            return res.status(422).json({
                status: 'error', message: "Empty Fields. data is required", data: null
            });
        }
        const existingUser = await User.findOne({ phone: phoneNumber });

        if (existingUser) {
            let token = generateToken(existingUser._id, existingUser.role);

            return res.status(200).json({ status: 'ok', message: 'User Already Exist', data: { existingUser, token: token } });
        }
        const newUser = new User({ firebase_id: id, phone: phoneNumber, role: role });

        await newUser.save();
        let token = generateToken(newUser._id, newUser.role);
        return res.status(201).json({
            status: 'ok',
            message: 'User registered successfully',
            data: { token: token },
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message, data: null });

    }

}
const saveUser = async (phone, fcmToken, role) => {
    try {

        // Check if email is already registered
        const user = await User.findOne({ phone });
        if (user) {
            let token = generateToken(user._id, user.role);
            return {
                token: token
            };
        }


        const newUser = new User({ name: "jhon", phone: phone, role: role, fcm_token: fcmToken });
        await newUser.save();

        let token = generateToken(newUser._id, newUser.role);
        return { id: newUser._id, phone: phone, token: token };

    } catch (error) {
        throw new Error(error.message)
    }

}


let sendOtp = async (req, res) => {

    try {
        const { phone, fcmToken } = req.body;
        if (!phone || !/^(\+91[\-\s]?)?[6-9]\d{9}$/.test(phone)) {
            throw new Error("Invalid phone number");
        }

        const otpRecord = await Otp.findOne({ phone });
        if (otpRecord) {
            await Otp.findOneAndDelete({ phone });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

        // Save OTP in the database (upsert to overwrite existing OTP for the phone)
        let userOtp = new Otp({
            phone: phone,
            otp: otp,
            fcmToken: fcmToken,
            otpExpires: expiryTime,
            upsert: true,
            new: true
        });

        await userOtp.save();

        await sendMsg(fcmToken, `your phone verification otp is ${otp}. This otp is valid for only 5 minutes `, "Verification token");

        // TODO: Send OTP via notification/SMS service
        // console.log(`OTP for ${phone}: ${otp}`);

        res.status(200).json({
            status: 'ok', message: "OTP sent successfully",
            data: {
                phone: phone,
                fcmToken: fcmToken,
                otp: otp
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message, data: null });
    }
}

let verifyOtp = async (req, res) => {
    const { phone, otp, role } = req.body;

    try {

        if (!phone || !otp || !role) {
            return res.status(400).json({ status: 'error', data: null, message: "Phone, role and OTP are required" });
        }
        if (!phone || !/^(\+91[\-\s]?)?[6-9]\d{9}$/.test(phone)) {
            throw new Error("Invalid phone number");
        }
        // Find OTP record
        const otpRecord = await Otp.findOne({ phone });

        if (!otpRecord) {
            return res.status(404).json({ status: 'error', data: null, message: "No OTP found for this phone number" });
        }

        // Check OTP and expiry
        if (otpRecord.otp !== otp) {
            return res.status(400).json({ status: 'error', data: null, message: "Invalid OTP" });
        }

        if (otpRecord.otpExpires < Date.now()) {
            // Remove expired OTP
            await Otp.deleteOne({ phone });
            return res.status(400).json({ status: 'error', data: null, message: "OTP has expired" });
        }
        let fcmToken = otpRecord.fcmToken;
        let userResp = await saveUser(phone, fcmToken, role);
        await Otp.deleteOne({ phone }); // Clean up OTP record after verification
        // TODO: Generate and return a token (e.g., JWT)
        res.status(200).json({ status: 'ok', data: { ...userResp }, message: "Phone verified successfully" });
    } catch (error) {
        res.status(500).json({ status: 'error', data: null, message: error.message });
    }
}
let resetPassword = async (req, res) => {
    try {
        const { email, phone } = req.body;
        let data = {};
        if (email) {
            data.email = email;
        }
        if (phone) {
            data.phone = phone;
        }
        return res.status(200).json({ status: 'ok', message: "Reset Password is in progress", data: data });

    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message, data: null });

    }
}


module.exports = { loginWithEmail, registerWithEmail, sendOtp, verifyOtp, resetPassword }