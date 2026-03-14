const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');
const ApiError = require('../utils/apiError');

// Send a message
exports.sendMessage = async (senderId, conversationId, content) => {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        throw new ApiError(404, 'Conversation not found');
    }

    const message = await Message.create({
        conversation: conversationId,
        sender: senderId,
        content
    });

    // Update last message in conversation
    conversation.lastMessage = message._id;
    await conversation.save();

    return message;
};  // <-- sendMessage ends here






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