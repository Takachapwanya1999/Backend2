import express from 'express';
import * as uploadController from '../controllers/uploadController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User avatar upload
router.post(
  '/avatar',
  uploadController.uploadUserAvatar,
  uploadController.resizeUserAvatar,
  uploadController.updateUserAvatar
);

// Place photo uploads (handled in place routes)
// These routes are for additional upload functionality

// Admin routes
router.use(restrictTo('admin'));

router.get('/stats', uploadController.getUploadStats);
router.delete('/cleanup', uploadController.cleanupOrphanedFiles);

export default router;
