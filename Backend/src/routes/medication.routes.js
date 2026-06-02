import express from 'express';
import * as medicationController from '../controller/medication.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// All medication routes require authentication
router.use(authMiddleware);

router.post('/', medicationController.addMedication);
router.get('/', medicationController.getMedications);
router.put('/:id', medicationController.updateMedication);
router.delete('/:id', medicationController.deleteMedication);
router.patch('/:id/toggle', medicationController.toggleMedicationActive);
router.post('/:id/take-dose', medicationController.takeDose);

export default router;
