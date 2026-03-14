const conversationService = require('../services/conservationService');

// Create a new conversation
exports.createConversation = async (req, res, next) => {
    try {
        const conversation = await conversationService.createConversation(
            req.user.id,
            req.body.receiverId
        );
        res.status(201).json({ status: 'success', data: conversation });
    } catch (error) {
        next(error);
    }
};

// Get all conversations for logged in user
exports.getConversations = async (req, res, next) => {
    try {
        const conversations = await conversationService.getConversations(req.user.id);
        res.status(200).json({ status: 'success', data: conversations });
    } catch (error) {
        next(error);
    }
};

// Get a single conversation
exports.getConversation = async (req, res, next) => {
    try {
        const conversation = await conversationService.getConversation(
            req.params.conversationId,
            req.user.id
        );
        res.status(200).json({ status: 'success', data: conversation });
    } catch (error) {
        next(error);
    }
};

// Delete a conversation
exports.deleteConversation = async (req, res, next) => {
    try {
        const result = await conversationService.deleteConversation(
            req.params.conversationId,
            req.user.id
        );
        res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        next(error);
    }
};