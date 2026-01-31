const express = require('express');
const router = express.Router();
const newsController = require('../controller/news.controller');
const authMiddleware = require('../middleware/auth.middleware');

// News routes (protected)
router.use(authMiddleware);

router.get('/', newsController.getNews);
router.get('/search', newsController.searchNews);

module.exports = router;
