import express from 'express';
import { registerStaff, loginStaff, registerRider, loginRider } from '../controllers/authController.js';

const router = express.Router();

router.post('/staff/register', registerStaff);
router.post('/staff/login', loginStaff);
router.post('/rider/register', registerRider);
router.post('/rider/login', loginRider);

export default router;