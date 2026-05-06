const conversationService = require('../services/conversationService');

// Create a new conversation
exports.createConversation = async (req, res, next) => {
    try {
        const { participantId } = req.body; // ✅ Changed from receiverId to participantId
        
        if (!participantId) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Participant ID is required' 
            });
        }
        
        const conversation = await conversationService.createConversation(
            req.user.id,
            participantId  // ✅ Changed from receiverId to participantId
        );
        res.status(201).json({ status: 'success', data: conversation });
    } catch (error) {
        console.error('Create conversation error:', error);
        next(error);
    }
};

// Get all conversations for logged in user
exports.getConversations = async (req, res, next) => {
    try {
        const conversations = await conversationService.getConversations(req.user.id);
        res.status(200).json({ status: 'success', data: conversations });
    } catch (error) {
        console.error('Get conversations error:', error);
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
        console.error('Get conversation error:', error);
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
        console.error('Delete conversation error:', error);
        next(error);
    }
};