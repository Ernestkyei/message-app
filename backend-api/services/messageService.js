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

    conversation.lastMessage = message._id;
    await conversation.save();

    return message;
};

// Get all messages in a conversation
exports.getMessages = async (conversationId) => {
    const messages = await Message.find({ 
        conversation: conversationId, 
        isDeleted: false 
    })
    .populate('sender', 'name email')
    .sort('createdAt');

    return messages;
};

// Delete a message
exports.deleteMessage = async (messageId, userId) => {
    const message = await Message.findById(messageId);
    if (!message) {
        throw new ApiError(404, 'Message not found');
    }

    if (message.sender.toString() !== userId.toString()) {
        throw new ApiError(403, 'You can only delete your own messages');
    }

    message.isDeleted = true;
    await message.save();

    return message;
};