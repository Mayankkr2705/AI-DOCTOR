const express = require('express');
const router = express.Router();
const reportController = require('../controller/report.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All report routes require authentication
router.use(authMiddleware);

router.post('/upload', reportController.uploadReport);
router.post('/:reportId/analyze', reportController.analyzeReport);
router.get('/', reportController.getReports);
router.get('/:reportId', reportController.getReport);
router.delete('/:reportId', reportController.deleteReport);

module.exports = router;
