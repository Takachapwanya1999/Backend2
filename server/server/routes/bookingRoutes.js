import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { protect, restrictTo, checkBookingAccess } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User booking routes
router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getMyBookings);
router.get('/host-bookings', bookingController.getHostBookings);
router.get('/stats', bookingController.getBookingStats);

// Single booking routes (require booking access)
router.get('/:id', checkBookingAccess, bookingController.getBooking);
router.patch('/:id/status', checkBookingAccess, bookingController.updateBookingStatus);
router.patch('/:id/cancel', checkBookingAccess, bookingController.cancelBooking);
router.patch('/:id/check-in', bookingController.checkIn);
router.patch('/:id/check-out', bookingController.checkOut);

// Admin routes
router.use(restrictTo('admin'));

router.get('/', bookingController.getAllBookings);
router.delete('/:id', bookingController.deleteBooking);

export default router;
