const messageService = require('../services/messageService');
const Conversation = require('../models/conversationModel');

// Send a message
exports.sendMessage = async (req, res, next) => {
    try {
        const result = await messageService.sendMessage(
            req.user.id,
            req.params.conversationId,
            req.body.content
        );

        // Update unread counts in conversation
        const conversation = await Conversation.findById(req.params.conversationId);
        if (conversation) {
            if (!conversation.unreadCount) {
                conversation.unreadCount = [];
            }

            for (const participant of conversation.participants) {
                const participantId = participant._id || participant;
                if (participantId.toString() !== req.user.id) {
                    const unreadEntry = conversation.unreadCount.find(
                        u => (u.user?._id || u.user)?.toString() === participantId.toString()
                    );
                    if (unreadEntry) {
                        unreadEntry.count += 1;
                    } else {
                        conversation.unreadCount.push({ user: participantId, count: 1 });
                    }
                }
            }
            await conversation.save();
        }

        const io = req.app.get('io');

        // Emit message to all participants
        if (io && result.participants?.length) {
            result.participants.forEach(participant => {
                const participantId = participant?._id || participant?.toString() || participant;
                if (participantId) {
                    io.to(participantId.toString()).emit('newMessage', {
                        status: 'success',
                        data: result.message
                    });

                    const unreadEntry = conversation?.unreadCount?.find(
                        u => (u.user?._id || u.user)?.toString() === participantId.toString()
                    );
                    io.to(participantId.toString()).emit('unreadCountUpdate', {
                        conversationId: req.params.conversationId,
                        count: unreadEntry?.count || 0
                    });
                }
            });
        }

        res.status(201).json({ 
            status: 'success', 
            data: result.message
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
};

// Get all messages in a conversation (with hidden messages filtered)
exports.getMessages = async (req, res, next) => {
    try {
        const messages = await messageService.getMessages(
            req.params.conversationId,
            req.user.id
        );
        res.status(200).json({ status: 'success', data: messages });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
};

// Permanent delete a message (only for message owner)
exports.deleteMessage = async (req, res, next) => {
    try {
        const message = await messageService.deleteMessage(
            req.params.messageId,
            req.user.id
        );
        res.status(200).json({ status: 'success', data: message });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
};

// ✅ NEW - Hide message for current user (soft delete - like WhatsApp "Delete for Me")
exports.hideMessageForUser = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.id;
        
        const result = await messageService.hideMessageForUser(messageId, userId);
        
        res.status(200).json({
            status: 'success',
            message: 'Message hidden from your view',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// ✅ NEW - Unhide message (restore hidden message to view)
exports.unhideMessageForUser = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.id;
        
        const result = await messageService.unhideMessageForUser(messageId, userId);
        
        res.status(200).json({
            status: 'success',
            message: 'Message restored to your view',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Mark messages as read
exports.markAsRead = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;
        const Message = require('../models/messageModel');

        await Message.updateMany(
            { conversation: conversationId, readBy: { $ne: userId } },
            { $addToSet: { readBy: userId } }
        );

        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
            if (!conversation.unreadCount) {
                conversation.unreadCount = [];
            }

            const unreadEntry = conversation.unreadCount.find(
                u => (u.user?._id || u.user)?.toString() === userId
            );
            if (unreadEntry) {
                unreadEntry.count = 0;
            } else {
                conversation.unreadCount.push({ user: userId, count: 0 });
            }
            await conversation.save();
        }

        const io = req.app.get('io');
        if (io) {
            io.to(userId).emit('unreadCountUpdate', {
                conversationId,
                count: 0
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Messages marked as read'
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
};

// Get total unread count for the user
exports.getTotalUnreadCount = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        });

        let totalUnread = 0;
        conversations.forEach(conversation => {
            if (conversation.unreadCount?.length) {
                const unreadEntry = conversation.unreadCount.find(
                    u => (u.user?._id || u.user)?.toString() === userId
                );
                if (unreadEntry) {
                    totalUnread += unreadEntry.count;
                }
            }
        });

        res.status(200).json({
            status: 'success',
            data: { totalUnread }
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
};