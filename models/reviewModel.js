const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // Refers to the User schema
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewText: { type: String, required: true },
    flagged: { type: Boolean, default: false }, // Indicates if the review is flagged
    date: { type: Date, default: Date.now },  // Timestamp for the review
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
