// @ts-nocheck
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const mongoose=require("mongoose")
const { generateToken } = require('../utils/token');


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
        const newUser = new User({ email, password: hashedPassword, role });
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
        const user = await User.findOne({ email });
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
        let { id, phoneNumber,role } = req.body;
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
        const newUser = new User({firebase_id:id, phone: phoneNumber, role: role });

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
const loginWithPhone = async (req, res) => {
}

module.exports = { loginWithEmail, registerWithEmail, authWithPhone, loginWithPhone }