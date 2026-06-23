import express from 'express';
import { 
  getOrders, 
  createWebQROrder, 
  createWebLinkOrder, 
  createManualOrder, 
  updateOrderStatus, 
  assignRiderToOrder 
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for the customer web app (No authentication required to order food)
router.post('/web/qr', createWebQROrder);
router.post('/web/link', createWebLinkOrder);

// Protected routes (Requires a valid staff/rider JWT bearer token in the headers)
router.get('/', protect, getOrders);
router.post('/manual', protect, createManualOrder);
router.patch('/:id/status', protect, updateOrderStatus);
router.patch('/:id/assign', protect, assignRiderToOrder);

export default router;