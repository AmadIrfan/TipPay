const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const Tip = require('../models/tipModels');
const { Payout } = require('../models/paymentModel');
const { sendMsg } = require('./notificationController');


const getEmployeePerformance = async (req, res) => {
    try {
        // Fetch all employees
        const employees = await User.find({ role: 'employee' });

        // For each employee, calculate the performance metrics (total tips, average rating, total customers served)
        const performanceData = await Promise.all(employees.map(async (employee) => {
            // Total tips (Assuming you have a 'Tip' model related to the user)
            const totalTips = await Tip.aggregate([
                { $match: { employeeId: employee._id } },
                { $group: { _id: '$employeeId', totalTips: { $sum: '$amount' } } }
            ]);

            // Average rating (Reviews model assumed)
            const avgRating = await Review.aggregate([
                { $match: { userId: employee._id } },
                { $group: { _id: '$userId', avgRating: { $avg: '$rating' } } }
            ]);

            // Total customers served (Assumed: 1 review per customer)
            const totalCustomers = await Review.countDocuments({ userId: employee._id });

            return {
                employee: employee,
                totalTips: totalTips.length > 0 ? totalTips[0].totalTips : 0,
                averageRating: avgRating.length > 0 ? avgRating[0].avgRating : 0,
                totalCustomers: totalCustomers
            };
        }));

        res.status(200).json({
            status: 'ok',
            message: 'Performance data fetched successfully',
            data: performanceData
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: `Error fetching performance data: ${error.message}`
        });
    }
};

const getTopAndLowPerformers = async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' });

        const performanceData = await Promise.all(employees.map(async (employee) => {
            // Similar logic for performance data as in getEmployeePerformance API
            const totalTips = await Tip.aggregate([
                { $match: { employeeId: employee._id } },
                { $group: { _id: '$employeeId', totalTips: { $sum: '$amount' } } }
            ]);

            const avgRating = await Review.aggregate([
                { $match: { userId: employee._id } },
                { $group: { _id: '$userId', avgRating: { $avg: '$rating' } } }
            ]);

            const totalCustomers = await Review.countDocuments({ userId: employee._id });

            return {
                employee: employee,
                totalTips: totalTips.length > 0 ? totalTips[0].totalTips : 0,
                averageRating: avgRating.length > 0 ? avgRating[0].avgRating : 0,
                totalCustomers: totalCustomers
            };
        }));

        const lowPerformers = performanceData.filter(emp => emp.averageRating < 3); // Assuming below 3 is low performance
        const topPerformers = performanceData.filter(emp => emp.averageRating >= 4); // Assuming 4 and above is top performance

        res.status(200).json({
            status: 'ok',
            message: 'Top performers and low performance employees fetched successfully',
            topPerformers: topPerformers,
            lowPerformers: lowPerformers
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: `Error fetching top performers: ${error.message}`
        });
    }
};

const getEmployeePayoutHistory = async (req, res) => {
    try {
        const employee = await User.findById(req.body.userId);
        if (!employee) return res.status(404).json({ status: 'error', message: 'Employee not found' });

        const payoutHistory = await Payout.find({ employeeId: employee._id });

        return res.status(200).json({
            status: 'ok',
            message: 'success',
            data: payoutHistory
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: `Error fetching payout history: ${error.message}` });
    }
};

const sendLowPerformanceNotification = async (req, res) => {
    try {
        const employee = await User.findById(req.body.userId);
        if (!employee) return res.status(404).json({ status: 'error', message: 'Employee not found' });

        const { message, title } = req.body;

        if (!employee.fcm_token || employee.fcm_token === "") {
            return res.status(404).json({
                status: 'error',
                message: 'No token provided',
                data: null
            });
        }
        const response = await sendMsg(employee.fcm_token, message, title);

        return res.status(200).json({
            status: 'ok',
            message: 'Notification sent successfully',
            response: response
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: `Error sending notification: ${error.message}` });
    }
};

const sendPayoutApprovalNotification = async (req, res) => {
    try {
        const employee = await User.findById(req.body.userId);
        if (!employee) return res.status(404).json({ status: 'error', message: 'Employee not found' });

        const { message, title } = req.body;

        // Send notification
        if (!employee.fcm_token || employee.fcm_token === "") {
            return res.status(404).json({
                status: 'error',
                message: 'No token provided',
                data: null
            });
        }
        const response = await sendMsg(employee.fcm_token, message, title);

        return res.status(200).json({
            status: 'ok',
            message: 'Payout approval notification sent successfully',
            data: response
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: `Error sending notification: ${error.message}` });
    }
};

const sendSystemUpdateNotification = async (req, res) => {
    try {
        const { message, title } = req.body;

        const employees = await User.find({ role: 'employee' });
        const notifications = employees.map(async (employee) => {
            if (!employee.fcm_token || employee.fcm_token === "") {
                return "no token provided";
            }
            return await sendMsg(employee.fcm_token, message, title);
        });

        const responses = await Promise.all(notifications);

        return res.status(200).json({
            status: 'ok',
            message: 'System update notification sent successfully',
            responses: responses
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: `Error sending notification: ${error.message}` });
    }
};

module.exports = {
    sendLowPerformanceNotification,
    sendPayoutApprovalNotification,
    sendSystemUpdateNotification,
    getEmployeePerformance,
    getTopAndLowPerformers,
    getEmployeePayoutHistory,
}

