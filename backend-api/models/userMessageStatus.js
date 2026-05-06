const mongoose = require('mongoose');

const userMessageStatusSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    },
    hidden: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Compound index to ensure unique user-message pair
userMessageStatusSchema.index({ user: 1, message: 1 }, { unique: true });

module.exports = mongoose.model('UserMessageStatus', userMessageStatusSchema);