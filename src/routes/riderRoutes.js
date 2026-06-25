import express from 'express';
import { updateRiderStatus, getMyDeliveries } from '../controllers/riderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All rider logistical endpoints require authorization
router.patch('/status', protect, updateRiderStatus);
router.get('/my-deliveries', protect, getMyDeliveries);

export default router;