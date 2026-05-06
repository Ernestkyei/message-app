const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');
const UserMessageStatus = require('../models/userMessageStatus');
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

    const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'name email');

    let participants = [];
    if (conversation.participants && Array.isArray(conversation.participants)) {
        participants = conversation.participants
            .filter(p => p !== null && p !== undefined)
            .map(p => p._id || p);
    }

    return {
        message: populatedMessage,
        participants
    };
};

// Get all messages in a conversation (filter out hidden messages)
exports.getMessages = async (conversationId, userId) => {
    // Get all messages in conversation
    const messages = await Message.find({ 
        conversation: conversationId, 
        isDeleted: false 
    })
    .populate('sender', 'name email')
    .sort('createdAt');
    
    // Get hidden message IDs for this user
    const hiddenMessages = await UserMessageStatus.find({
        user: userId,
        hidden: true
    }).select('message');
    
    const hiddenMessageIds = hiddenMessages.map(h => h.message.toString());
    
    // Filter out hidden messages
    const visibleMessages = messages.filter(
        msg => !hiddenMessageIds.includes(msg._id.toString())
    );
    
    return visibleMessages;
};

// Permanent delete (owner only)
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

// Hide message for user (soft delete - like "Delete for Me")
exports.hideMessageForUser = async (messageId, userId) => {
    // Check if message exists
    const message = await Message.findById(messageId);
    if (!message) {
        throw new ApiError(404, 'Message not found');
    }
    
    // Check if status already exists
    let status = await UserMessageStatus.findOne({
        user: userId,
        message: messageId
    });
    
    if (status) {
        status.hidden = true;
        status.deletedAt = new Date();
        await status.save();
    } else {
        status = await UserMessageStatus.create({
            user: userId,
            message: messageId,
            hidden: true,
            deletedAt: new Date()
        });
    }
    
    return status;
};

// Unhide message (restore hidden message)
exports.unhideMessageForUser = async (messageId, userId) => {
    const status = await UserMessageStatus.findOne({
        user: userId,
        message: messageId
    });
    
    if (!status) {
        throw new ApiError(404, 'Message status not found');
    }
    
    status.hidden = false;
    status.deletedAt = null;
    await status.save();
    
    return status;
};