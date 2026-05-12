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

// ========== ANALYTICS FOR CHARTS ==========

exports.getSystemAnalytics = async (req, res, next) => {
    try {
        const analytics = await adminService.getSystemAnalytics(req.query);
        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        next(error);
    }
};

// ========== DIRECT MESSAGING ==========

exports.sendDirectMessage = async (req, res, next) => {
    try {
        const { userId, message, subject } = req.body;
        const adminId = req.user.id;
        
        if (!userId || !message || message.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'User ID and message are required'
            });
        }
        
        // Check if user exists
        const User = require('../models/userModel');
        const targetUser = await User.findById(userId).select('name email');
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Get admin info
        const admin = await User.findById(adminId).select('name email');
        
        // Send real-time notification via Socket.IO if user is online
        const io = req.app.get('io');
        if (io) {
            // Emit to multiple room formats to ensure delivery
            io.to(userId.toString()).emit('adminDirectMessage', {
                from: adminId,
                fromName: admin.name,
                fromEmail: admin.email,
                message: message,
                subject: subject || 'Message from Admin',
                timestamp: new Date(),
                type: 'admin'
            });
            
            io.to(`user_${userId}`).emit('adminDirectMessage', {
                from: adminId,
                fromName: admin.name,
                fromEmail: admin.email,
                message: message,
                subject: subject || 'Message from Admin',
                timestamp: new Date(),
                type: 'admin'
            });
            
            io.to(String(userId)).emit('newMessage', {
                type: 'admin',
                from: admin.name,
                fromId: adminId,
                content: message,
                subject: subject || 'Message from Admin',
                timestamp: new Date()
            });
            
            console.log(`📡 Socket emitted to rooms: ${userId}, user_${userId}, ${String(userId)}`);
        } else {
            console.log('⚠️ Socket.io not available');
        }
        
        // Try to save message to database if Message model exists
        try {
            const Message = require('../models/messageModel');
            if (Message) {
                const savedMessage = await Message.create({
                    sender: adminId,
                    senderModel: 'Admin',
                    recipient: userId,
                    recipientModel: 'User',
                    subject: subject || 'Message from Admin',
                    content: message,
                    isRead: false,
                    createdAt: new Date()
                });
                console.log('💾 Message saved to database:', savedMessage._id);
            }
        } catch (dbError) {
            // Message model might not exist yet, that's okay
            console.log('Note: Message not saved to database (model may not exist):', dbError.message);
        }
        
        console.log(`📨 Admin ${admin.name} sent message to ${targetUser.name}`);
        console.log(`   Subject: ${subject || 'No subject'}`);
        console.log(`   Message: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`);
        
        res.status(200).json({
            success: true,
            message: `Message sent to ${targetUser.name}`,
            data: {
                to: targetUser.name,
                toEmail: targetUser.email,
                from: admin.name,
                subject: subject || 'Message from Admin',
                message: message,
                sentAt: new Date()
            }
        });
        
    } catch (error) {
        console.error('Send message error:', error);
        next(error);
    }
};