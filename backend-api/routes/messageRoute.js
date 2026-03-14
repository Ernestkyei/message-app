const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const protect = require('../middlewares/protect');

// Message routes only
router.post('/conversations/:conversationId/messages', protect, messageController.sendMessage);
router.get('/conversations/:conversationId/messages', protect, messageController.getMessages);
router.delete('/messages/:messageId', protect, messageController.deleteMessage);

module.exports = router;