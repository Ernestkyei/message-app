const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const protect = require('../middlewares');


//Conservation routes
router.post('/consersation', protect, messageController.createConversation);
router.get('/conversation', messageController.getConversations);


//Message routes
router.post('/conversations/:conversationId/messages', protect, messageController.sendMessage);
router.get('/conversations/:conversationId/messages', protect, messageController.getConversations);
router.delete('/messages/:messageId', protect, messageController.deleteMessage);


module.exports =router;