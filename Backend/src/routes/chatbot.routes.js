import express from 'express';
import * as chatbotController from '../controller/chatbot.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// All chatbot routes require authentication
router.use(authMiddleware);

router.post('/chat', chatbotController.chat);
router.post('/health-score', chatbotController.analyzeHealthScore);
router.get('/history', chatbotController.getHistory);
router.get('/history/:conversationId', chatbotController.getHistory);
router.delete('/history/:conversationId', chatbotController.deleteConversation);

export default router;
