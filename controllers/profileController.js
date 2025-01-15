// @ts-nocheck
const User = require('../models/userModel');
const { sendResponse } = require('../utils/sendResponse');

const getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select('-otp -otpExpires -__v');
        
        if (user?.role?.toLowerCase() !== "employee") {
            let EmUser = { ...user._doc }; 
            if (EmUser?.employeeDetails) {
                EmUser.employeeDetails = undefined; }

                return    sendResponse(res, 200, 'ok', 'Profile retrieved', EmUser);
        }
        // @ts-ignore
    return    sendResponse(res, 200, 'ok', 'Profile retrieved', user);
    } catch (error) {
        sendResponse(res, 500, 'error', 'Failed to retrieve profile', error.message);
    }
};

const updateProfile = async (req, res) => {
    try {
        const userEx = await User.findById(req.user.id);
        if (!userEx) {
            throw new Error("user Not Found with given id");
        }
        // const { name, age, title, picture } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            req.body,
            { new: true }
        ).select('-otp -otpExpires');

        // @ts-ignore
        sendResponse(res, 200, 'ok', 'Profile updated', user);
    } catch (error) {
        sendResponse(res, 500, 'error', 'Failed to update profile ', error.message);
    }
};
module.exports = { updateProfile, getProfile }