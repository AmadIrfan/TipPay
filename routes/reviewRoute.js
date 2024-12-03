const express = require('express');
const router = express.Router();
const {
    newReviews,
    reviewsById,
    flaggedReview,
    deleteReview,
} = require('../controllers/reviewController')



router.post('/', newReviews);
router.get('/:userId', reviewsById);
router.post('/:reviewId/flag', flaggedReview);
router.delete('/delete', deleteReview);

module.exports = router;