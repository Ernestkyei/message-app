const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const protect = require('../middlewares/protect');

router.post('/', protect, conversationController.createConversation);
router.get('/', protect, conversationController.getConversations);
router.get('/:conversationId', protect, conversationController.getConversation);
router.delete('/:conversationId', protect, conversationController.deleteConversation);

module.exports = router;