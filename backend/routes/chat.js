const express = require('express');
const {
  getConversations,
  startConversation,
  getMessages,
  sendMessage
} = require('../controllers/chat');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/conversations', getConversations);
router.post('/conversations', startConversation);
router.get('/messages/:conversationId', getMessages);
router.post('/messages', sendMessage);

module.exports = router;
