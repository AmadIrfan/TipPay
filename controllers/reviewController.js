const User = require('../models/userModel');
const Review = require('../models/reviewModel');

// Add a new review
const addReview = async (req, res) => {
    try {
        const { tipId, rating, reviewText } = req.body;
        const userId = req.user.id;
        // Validate that the user exists and is an employee
        const user = await User.findById(userId);
        if (!user || user.role !== 'employee') {
            return res.status(400).json({ status: 'error', message: 'Invalid employee ID', data: null });
        }

        // Create a new review
        const review = new Review({ userId, tipId, rating, reviewText });
        await review.save();

        res.status(201).json({ status: 'ok', message: 'Review added successfully', data: review });
    } catch (err) {
        res.status(500).json({ status: 'error', message: `Error adding review: ${err.message}`, data: null });
    }
};

// Fetch reviews for a specific tip and calculate average rating
const getReviewsByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
    
        // Fetch reviews for the given tip
        const reviews = await Review.find({ userId, isActive: true });
    
        const totalReviews = reviews.length;

        // Calculate average rating
        const averageRating = totalReviews
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(2)
            : 0;

        // Categorize reviews into positive (rating >= 4) and negative (rating <= 2)
        const positiveReviews = reviews.filter((review) => review.rating >= 4);
        const negativeReviews = reviews.filter((review) => review.rating <= 2);

        res.status(200).json({
            status: 'ok',
            message: 'Reviews fetched successfully',
            data: {
                averageRating,
                totalReviews,
                positiveReviews,
                negativeReviews,
                reviews,
            },
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: `Error fetching reviews: ${err.message}`, data: null });
    }
};
const getReviewsByTipId = async (req, res) => {
    try {
        const { tipId } = req.body;
        const userId = req.user.id;
        if (!tipId || tipId === '') {
            return res.status(400).json({ status: 'error', message: `provide valid tip id`, data: null });

        }
        // Fetch reviews for the given tip
        const reviews = await Review.find({ tipId, userId, isActive: true });
        res.status(200).json({
            status: 'ok',
            message: 'Reviews fetched successfully',
            data: {
                reviews,
            },
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: `Error fetching reviews: ${err.message}`, data: null });
    }
};

// Fetch overall summary of reviews
const getReviewSummary = async (req, res) => {
    try {
        // Fetch all active reviews
    
        const reviews = await Review.find({ isActive: true });
        const totalReviews = reviews.length;
        // Calculate overall average rating
        const averageRating = totalReviews
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(2)
            : 0;

        // Categorize reviews into positive, neutral, and negative
        const positiveReviews = reviews.filter((review) => review.rating >= 4);
        const neutralReviews = reviews.filter((review) => review.rating < 4 && review.rating >= 3);
        const negativeReviews = reviews.filter((review) => review.rating < 3);

        res.status(200).json({
            status: 'ok',
            message: 'Review summary fetched successfully',
            data: {
                totalReviews,
                averageRating,
                positiveReviewCount: positiveReviews.length,
                positiveReview: positiveReviews,
                neutralReviewCount: neutralReviews.length,
                neutralReview: neutralReviews,
                negativeReviewCount: negativeReviews.length,
                negativeReview: negativeReviews,
            },
        });
    } catch (err) {
    
        res.status(500).json({ status: 'error', message: `Error fetching review summary: ${err.message}`, data: null });
    }
};

// Flag a review
const flagReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { flaggedReason } = req.body; // Optional reason for flagging

        // Update the review's flagged status
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { flagged: true, flaggedReason },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ status: 'error', message: 'Review not found', data: null });
        }

        res.status(200).json({
            status: 'ok',
            message: 'Review flagged successfully',
            data: updatedReview,
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: `Error flagging review: ${err.message}`, data: null });
    }
};

// Soft delete a review
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.body;

        // Soft delete the review by marking it as inactive
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { isActive: false },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ status: 'error', message: 'Review not found', data: null });
        }

        res.status(200).json({
            status: 'ok',
            message: 'Review deleted successfully',
            data: updatedReview,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: `Error deleting review: ${err.message}`,
            data: null,
        });
    }
};

module.exports = {
    addReview,
    getReviewsByUserId,
    getReviewSummary,
    flagReview,
    deleteReview,
    getReviewsByTipId
};
