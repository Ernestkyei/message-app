const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    isGroup: {
        type: Boolean,
        default: false,
    },
    groupName: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

// Clean up null participants before saving - CORRECTED VERSION
conversationSchema.pre('save', function() {
    if (this.participants && Array.isArray(this.participants)) {
        this.participants = this.participants.filter(p => p != null);
    }
});

module.exports = mongoose.model('Conversation', conversationSchema);