const adminService = require('../services/adminService');

// ========== USER MANAGEMENT ==========

exports.getAllUsers = async (req, res, next) => {
    try {
        const result = await adminService.getAllUsers(req.query);
        res.status(200).json({
            success: true,
            count: result.users.length,
            pagination: result.pagination,
            data: result.users
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const user = await adminService.getUserById(req.params.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const user = await adminService.updateUser(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'user updated successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const result = await adminService.deleteUser(req.params.id);
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserStats = async (req, res, next) => {
    try {
        const stats = await adminService.getUserStats();
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

// ========== USER CONVERSATION STATS ==========

exports.getUserConversationStats = async (req, res, next) => {
    try {
        const stats = await adminService.getUserConversationStats();
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

// ========== CONVERSATION MANAGEMENT ==========

exports.getAllConversations = async (req, res, next) => {
    try {
        const result = await adminService.getAllConversations(req.query);
        res.status(200).json({
            success: true,
            count: result.conversations.length,
            pagination: result.pagination,
            data: result.conversations
        });
    } catch (error) {
        next(error);
    }
};

exports.getConversationById = async (req, res, next) => {
    try {
        const result = await adminService.getConversationById(req.params.id);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteConversation = async (req, res, next) => {
    try {
        const result = await adminService.deleteConversation(req.params.id);
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

// ========== MESSAGE MANAGEMENT ==========

exports.getAllMessages = async (req, res, next) => {
    try {
        const result = await adminService.getAllMessages(req.query);
        res.status(200).json({
            success: true,
            count: result.messages.length,
            pagination: result.pagination,
            data: result.messages
        });
    } catch (error) {
        next(error);
    }
};

exports.getMessageById = async (req, res, next) => {
    try {
        const message = await adminService.getMessageById(req.params.id);
        res.status(200).json({
            success: true,
            data: message
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteMessage = async (req, res, next) => {
    try {
        const result = await adminService.deleteMessage(req.params.id);
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

exports.getMessageStats = async (req, res, next) => {
    try {
        const stats = await adminService.getMessageStats();
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};