import express from 'express';
import * as reportController from '../controller/report.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import reportUpload from '../middleware/reportUpload.middleware.js';

const router = express.Router();

// All report routes require authentication
router.use(authMiddleware);

router.post('/upload', reportUpload.single('reportFile'), reportController.uploadReport);
router.post('/:reportId/analyze', reportController.analyzeReport);
router.get('/', reportController.getReports);
router.get('/:reportId', reportController.getReport);
router.delete('/:reportId', reportController.deleteReport);

export default router;
