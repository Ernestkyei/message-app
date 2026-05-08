const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const protect = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/restrictTo');

// All Admin routes require authentication and admin role
router.use(protect);
router.use(restrictTo('admin'));

// ========== USER MANAGEMENT ==========
router.get('/users', adminController.getAllUsers);
router.get('/user/stats', adminController.getUserStats);
router.get('/user/:id', adminController.getUserById);
router.patch('/user/:id', adminController.updateUser);
router.delete('/user/:id', adminController.deleteUser);

// ========== USER CONVERSATION STATS ==========
router.get('/users/conversation-stats', adminController.getUserConversationStats);

// ========== CONVERSATION MANAGEMENT ==========
router.get('/conversations', adminController.getAllConversations);
router.get('/conversations/:id', adminController.getConversationById);
router.delete('/conversations/:id', adminController.deleteConversation);

// ========== MESSAGE MANAGEMENT ==========
router.get('/messages', adminController.getAllMessages);
router.get('/messages/stats', adminController.getMessageStats);
router.get('/messages/:id', adminController.getMessageById);
router.delete('/messages/:id', adminController.deleteMessage);

// ========== ANALYTICS FOR CHARTS ==========
router.get('/analytics', adminController.getSystemAnalytics);

module.exports = router;