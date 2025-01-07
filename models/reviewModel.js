const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, 
    tipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tip',
        required: true
    }, 
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewText: {
        type: String,
        trim: true, 
        maxlength: 500
    },
    flagged: {
        type: Boolean,
        default: false
    }, 
    flaggedReason: {
        type: String,
        trim: true,
        default: null
    }, 
    isActive: {
        type: Boolean,
        default: true
    }, 
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
