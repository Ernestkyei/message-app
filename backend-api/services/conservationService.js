const Conversation = require('../models/conversationModel');
const ApiError = require('../utils/apiError');




// Create a new conversation
exports.createConversation = async (senderId, receiverId) => {
    const existing = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
        isGroup: false
    });

    if (existing) return existing;
    const conversation = await Conversation.create({
        participants: [senderId, receiverId]
    });
    return conversation;
};



// Get all conversations for a user
exports.getConversations = async (userId) => {
    const conversations = await Conversation.find({
        participants: userId,
    })
    .populate('participants', 'name email')
    .populate('lastMessage')
    .sort('-updatedAt');
    return conversations;

};



// Get a single conversation
exports.getConversation = async (conversationId, userId) => {
    const conversation = await Conversation.findById(conversationId)
        .populate('participants', 'name email')
        .populate('lastMessage');
    if (!conversation) {
        throw new ApiError(404, 'Conversation not found');
    }

    // Make sure user is part of this conversation
    const isMember = conversation.participants.some(
        p => p._id.toString() === userId.toString()
    );

    if (!isMember) {
        throw new ApiError(403, 'You are not part of this conversation');
    }

    return conversation;
};


// Delete a conversation
exports.deleteConversation = async (conversationId, userId) => {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new ApiError(404, 'Conversation not found');
    }

    // Make sure user is part of this conversation
    const isMember = conversation.participants.some(
        p => p.toString() === userId.toString()
    );

    if (!isMember) {
        throw new ApiError(403, 'You are not part of this conversation');
    }

    await conversation.deleteOne();
    return { message: 'Conversation deleted successfully' };
};