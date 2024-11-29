const User = require('../models/userModel');
const { sendResponse } = require('../utils/sendResponse');

const getProfile = async (req, res) => {
    try {
        
        const user = await User.findById(req.user.id).select('-otp -otpExpires -__v');
        // @ts-ignore
        sendResponse(res,200, 'ok', 'Profile retrieved', user);
    } catch (error) {
        sendResponse(res,500, 'error', 'Failed to retrieve profile', error.message);
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, age, title, picture } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, age, title, picture },
            { new: true }
        ).select('-otp -otpExpires');

        // @ts-ignore
        sendResponse(res,200, 'ok', 'Profile updated', user);
    } catch (error) {
        sendResponse(res, 500,'error', 'Failed to update profile', error.message);
    }
};
module.exports = { updateProfile, getProfile }