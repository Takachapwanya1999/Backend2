import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/place/:placeId', reviewController.getPlaceReviews);
router.get('/:id', reviewController.getReview);

// Protected routes (require authentication)
router.use(protect);

// User review routes
router.post('/', reviewController.createReview);
router.get('/user/my-reviews', reviewController.getMyReviews);
router.get('/host/my-reviews', reviewController.getHostReviews);

// Single review routes
router.patch('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

// Host reply routes
router.post('/:id/reply', reviewController.replyToReview);
router.patch('/:id/reply', reviewController.updateReply);
router.delete('/:id/reply', reviewController.deleteReply);

// Flag review
router.post('/:id/flag', reviewController.flagReview);

// Admin routes
router.use(restrictTo('admin'));

router.get('/', reviewController.getAllReviews);
router.get('/admin/stats', reviewController.getReviewStats);

export default router;
