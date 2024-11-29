const express = require('express');
const { updateProfile, getProfile } = require('../controllers/profileController');
const {verifyToken } = require('../utils/token');
const { verifyId } = require('../utils/userUtils');

const router = express.Router();

router.post('/updateProfile/',verifyToken, updateProfile);
router.get('/profile/',verifyToken, getProfile);
router.get('/Profile/:id',verifyId, getProfile);
router.post('/updateProfile/:id',verifyId, updateProfile);

module.exports = router;
