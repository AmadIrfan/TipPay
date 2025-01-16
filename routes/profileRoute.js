const express = require('express');
const { updateProfile, getProfile, getEmployees, toggleEmployeeStatus,getAllUsers } = require('../controllers/profileController');
const { verifyToken } = require('../utils/token');
const { verifyId } = require('../utils/userUtils');

const router = express.Router();

router.post('/updateProfile/', verifyToken, updateProfile);
router.get('/profile/', verifyToken, getProfile);
router.get('/Profile/:id', verifyId, getProfile);
router.post('/updateProfile/:id', verifyId, updateProfile);
router.post('/getEmployee', verifyToken, getEmployees)
router.post('/getAllUsers', verifyToken, getAllUsers)
router.post('/activateEmployee', verifyToken, toggleEmployeeStatus)
module.exports = router;
