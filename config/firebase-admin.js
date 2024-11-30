// @ts-nocheck

var admin = require("firebase-admin");

var serviceAccount = require("./tippay-7cfe2-firebase-adminsdk-xnjsn-c70fdf490e.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
