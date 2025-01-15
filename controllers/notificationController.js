const admin = require('../config/firebase-admin');
const notificationModel = require('../models/notificationModel');

const sendNotification = async (req, res) => {
    try {
        let uid = req.body.userId;
        let token = req.body.fcmToken;
        let msg = req.body.message;
        let title = req.body.title;
    

        await sendMsg(token, 'this is my msg from node')
        let notification = await notificationModel.create({
            userId: uid,
            title: title,
            message: msg,
            
        });
        res.status(200).json({
            status: 'ok',
            message: 'Notification sent successfully',
            data: {},
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to send notification',
            error: error.message,
        });
    }
}
const sendMsg = async (registrationToken, msg,title) => {
    const message = {
        token: registrationToken,
        notification: {
            title: title,
            body: msg,
        },
    };
    // Send notification via Firebase Admin SDK
    const response = await admin.messaging().send(message);
    return await response;


}

module.exports = { sendNotification,sendMsg }