import express from 'express';
import * as newsController from '../controller/news.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// News routes (protected)
router.use(authMiddleware);

router.get('/', newsController.getNews);
router.get('/search', newsController.searchNews);

export default router;
