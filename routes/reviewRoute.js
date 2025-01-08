const express = require('express');
const router = express.Router();
const {
    addReview,
    getReviewsByTip,
    flagReview,
    getReviewSummary,
    deleteReview,
} = require('../controllers/reviewController')



router.post('/', addReview);
router.get('/:tipId', getReviewsByTip);


router.get('/reviewSummery', getReviewSummary);
router.post('/:reviewId/flag', flagReview);
router.delete('/delete', deleteReview);

module.exports = router;