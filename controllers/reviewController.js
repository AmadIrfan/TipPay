const User = require('../models/userModel');
const Review = require('../models/reviewModel');


let newReviews = async (req, res) => {
    try {
        const { userId, rating, reviewText } = req.body;

        // Validate that the user exists and is an employee
        const user = await User.findById(userId);
        if (!user || user.role !== 'employee') {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }

        // Create a new review
        const newReview = new Review({ userId, rating, reviewText });
        await newReview.save();

        res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (err) {
        res.status(500).json({ message: 'Error adding review', error: err.message });
    }
}
let reviewsById=async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch reviews and populate user details
        const reviews = await Review.find({ userId }).populate('userId', 'name email');
        const activeReviews = reviews.filter(review => review.isActive);
        // Calculate average rating
        const totalReviews = activeReviews.length;
        const averageRating = totalReviews ? activeReviews.reduce((sum, review) => sum + review.rating, 0) / activeReviews.length // Divide by the number of active reviews
            : 0;

        res.status(200).json({
            message: `Reviews sent `, status: "ok",
            data: {
                averageRating: averageRating.toFixed(2),
                totalReviews,
                activeReviews
            }
        });
    } catch (err) {
        res.status(500).json({ data: null, message: `Error fetching reviews ${err.message}`, status: "error" });
    }
}


const flaggedReview=async (req, res) => {
    try {
        const { reviewId } = req.params;

        // Update the review's flagged status
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { flagged: true },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({ message: 'Review flagged successfully', updatedReview });
    } catch (err) {
        res.status(500).json({ message: 'Error flagging review', error: err.message });
    }
}


const deleteReview=async (req, res) => {
    try {
        const { reviewId } = req.body;

        // Update the review's flagged status
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { isActive: false },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({status:'ok', message: 'Review Deleted successfully',data: updatedReview });
    } catch (err) {
        res.status(500).json({ status:'error',message: `Error Deleted review ${err.message}`, data:null });
    }
}
module.exports = {
    deleteReview,
    newReviews,
    flaggedReview,
    reviewsById,
}