// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithPhoneNumber, signOut } = require('firebase/auth')
const firebaseConfig = {
    apiKey: "AIzaSyDIFl_-CSEqNwR8nOUSuO4R-HjDwfKMlXk",
    authDomain: "tippay-7cfe2.firebaseapp.com",
    projectId: "tippay-7cfe2",
    storageBucket: "tippay-7cfe2.firebasestorage.app",
    messagingSenderId: "1028081141289",
    appId: "1:1028081141289:web:899f6e4ced810eb33e7e38",
    measurementId: "G-V2SWC4YB3X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

module.exports = { auth, signInWithPhoneNumber, signOut };
