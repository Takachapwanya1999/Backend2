import express from 'express';
import { protect } from '../middleware/auth.js';
import { createPaymentIntent, confirmAndCreateBooking } from '../controllers/paymentController.js';

const router = express.Router();

router.use(protect);

router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmAndCreateBooking);

export default router;
