const express = require('express');
const router = express.Router();
const {
    addReview,
    flagReview,
    getReviewsByUserId,
    getReviewSummary,

    deleteReview,
    getReviewsByTipId,
} = require('../controllers/reviewController');
const { verifyToken } = require('../utils/token');



router.post('/', verifyToken, addReview);
router.get('/getUserReviewSummery', verifyToken, getReviewsByUserId);
router.get('/get/reviewSummery', verifyToken, getReviewSummary);
router.get('/get/byTips', verifyToken, getReviewsByTipId);
router.post('/:reviewId/flag', verifyToken, flagReview);
router.delete('/delete', verifyToken, deleteReview);

module.exports = router;