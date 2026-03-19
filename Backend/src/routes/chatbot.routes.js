const express = require('express');
const router = express.Router();
const chatbotController = require('../controller/chatbot.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All chatbot routes require authentication
router.use(authMiddleware);

router.post('/chat', chatbotController.chat);
router.post('/health-score', chatbotController.analyzeHealthScore);
router.get('/history', chatbotController.getHistory);
router.get('/history/:conversationId', chatbotController.getHistory);
router.delete('/history/:conversationId', chatbotController.deleteConversation);

module.exports = router;
