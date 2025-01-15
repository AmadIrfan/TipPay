// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithPhoneNumber, signOut } = require('firebase/auth')


const firebaseConfig = {
    appId: process.env.appId,
    apiKey: process.env.apiKey,
    projectId: process.env.projectId,
    authDomain: process.env.authDomain,
    measurementId: process.env.measurementId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

module.exports = { auth, signInWithPhoneNumber, signOut };
