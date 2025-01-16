const express = require('express');
const { sendLowPerformanceNotification, sendSystemUpdateNotification, getTopAndLowPerformers, getEmployeePerformance, sendPayoutApprovalNotification, getEmployeePayoutHistory } = require('../controllers/employeeController');
const { approvePayout, processPayouts } = require('../controllers/payoutController');
const { verifyToken } = require('../utils/token');
const router = express.Router()


router.get("/send/notification/lowPerformance", verifyToken, sendLowPerformanceNotification);
router.get("/send/notification/systemUpdates", verifyToken, sendSystemUpdateNotification);
router.get("/send/notification/payOutApproved", verifyToken, sendPayoutApprovalNotification);
router.get("/TopAndLowPerformers", verifyToken, getTopAndLowPerformers);
router.get("/employeePerformers", verifyToken, getEmployeePerformance);
router.get("/payOutHistory", verifyToken, getEmployeePayoutHistory);
router.patch('/payouts/:id', verifyToken, approvePayout)
router.post('/payouts/auto', verifyToken, processPayouts)

module.exports = router;