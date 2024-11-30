const admin = require('../config/firebase-admin');


const sendNotification = async (req, res) => {
    try {
        let token = req.body.fcmToken;
        let msg = req.body.message;
        console.log(msg);

        // let token = ''
        await sendMsg(token, 'this is my msg from node')
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

const sendMsg = async (registrationToken, msg) => {
    const message = {
        token: registrationToken,
        notification: {
            title: "this is title",
            body: "this is body",
        },
        // data: {},
        // android: {},
        // apns: {
        //     payload: {
        //         aps: {
        //             badge: 42
        //         },
        //     },
        // },
    };
    // Send notification via Firebase Admin SDK
    const response = await admin.messaging().send(message);
    return await response;

}

module.exports = { sendNotification }