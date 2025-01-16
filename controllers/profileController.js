// @ts-nocheck
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const { sendResponse } = require('../utils/sendResponse');
const getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select('-otp -otpExpires -__v');

        if (user?.role?.toLowerCase() !== "employee") {
            let EmUser = { ...user._doc };
            if (EmUser?.employeeDetails) {
                EmUser.employeeDetails = undefined;
            }

            return sendResponse(res, 200, 'ok', 'Profile retrieved', EmUser);
        }
        // @ts-ignore
        return sendResponse(res, 200, 'ok', 'Profile retrieved', user);
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

const getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' }).lean();
        const employeeRatings = await Promise.all(employees.map(async (employee) => {
            const avgRating = await Review.aggregate([
                { $match: { userId: employee._id } },
                { $group: { _id: '$userId', avgRating: { $avg: '$rating' } } }
            ]);

            return {
                ...employee,
                averageRating: avgRating.length > 0 ? avgRating[0].avgRating : null
            };
        }));

        res.status(200).json({ status: 'ok', message: "success", data: employeeRatings });
    } catch (error) {
        res.status(500).json({ status: 'error', data: null, message: `Error fetching employees ${error.message}` });
    }
};

const getAllUsers = async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find(); // Empty filter retrieves all users
        console.log(`Fetched ${users.length} users from the database.`);

        // Send the response
        res.status(200).json({
            status: 'ok',
            message: 'Successfully fetched all users.',
            data: users,
        });
    } catch (error) {
        console.error('Error fetching users:', error.message);

        // Send error response
        res.status(500).json({
            status: 'error',
            message: `Error fetching users: ${error.message}`,
            data: null,
        });
    }
};

const toggleEmployeeStatus = async (req, res) => {
    try {
        const { userId } = req.body;
        const { isActive } = req.body;

        const updatedEmployee = await User.findByIdAndUpdate(userId, { isActive }, { new: true });
        console.log(updatedEmployee);

        if (!updatedEmployee) return res.status(404).json({ status: 'error', data: null, message: 'Employee not found' });

        res.status(200).json({ status: 'ok', message: 'Employee status updated', data: updatedEmployee });
    } catch (error) {
        res.status(500).json({ status: 'error', message: `Error updating employee status ${error.message}`, data: null });
    }
};



module.exports = { updateProfile, getProfile, getEmployees, toggleEmployeeStatus, toggleEmployeeStatus, getAllUsers }