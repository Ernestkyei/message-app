const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const protect = require('../middlewares/protect');

router.use(protect);

// Specific routes
router.get('/unread/count', messageController.getTotalUnreadCount);
router.patch('/:conversationId/read', messageController.markAsRead);

// Hide/Unhide routes - MAKE SURE THESE EXIST
router.delete('/messages/:messageId/hide', messageController.hideMessageForUser);
router.patch('/messages/:messageId/unhide', messageController.unhideMessageForUser);

// Delete route
router.delete('/messages/:messageId', messageController.deleteMessage);

// Message routes
router.post('/:conversationId/messages', messageController.sendMessage);
router.get('/:conversationId/messages', messageController.getMessages);

module.exports = router;