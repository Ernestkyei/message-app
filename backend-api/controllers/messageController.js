const messageService = require('../services/messageService');

// Send a message
exports.sendMessage = async (req, res, next) => {
    try {
        const message = await messageService.sendMessage(
            req.user.id,
            req.params.conversationId,
            req.body.content
        );
        res.status(201).json({ status: 'success', data: message });
    } catch (error) {
        next(error);
    }
};

// Get all messages in a conversation
exports.getMessages = async (req, res, next) => {
    try {
        const messages = await messageService.getMessages(req.params.conversationId);
        res.status(200).json({ status: 'success', data: messages });
    } catch (error) {
        next(error);
    }
};

// Delete a message
exports.deleteMessage = async (req, res, next) => {
    try {
        const message = await messageService.deleteMessage(
            req.params.messageId,
            req.user.id
        );
        res.status(200).json({ status: 'success', data: message });
    } catch (error) {
        next(error);
    }
};