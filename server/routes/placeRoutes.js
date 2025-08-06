import express from 'express';
import * as placeController from '../controllers/placeController.js';
import * as uploadController from '../controllers/uploadController.js';
import { protect, optionalAuth, restrictTo, checkPlaceOwnership } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, placeController.getAllPlaces);
router.get('/search', placeController.searchPlaces);
router.get('/category/:category', placeController.searchPlacesByCategory);
router.get('/featured', placeController.getFeaturedPlaces);
router.get('/:id', optionalAuth, placeController.getPlace);
router.get('/:id/availability', placeController.getPlaceAvailability);

// Protected routes (require authentication)
router.use(protect);

// User routes (authenticated users)
router.get('/user/my-places', placeController.getMyPlaces);
router.post('/', placeController.createPlace);

// Place-specific routes (require place ownership)
router.patch('/:id', checkPlaceOwnership, placeController.updatePlace);
router.delete('/:id', checkPlaceOwnership, placeController.deletePlace);

// Photo upload routes
router.post(
  '/:id/photos',
  uploadController.uploadPlacePhotos,
  uploadController.resizePlacePhotos,
  uploadController.uploadPhotosToPlace
);
router.delete('/:placeId/photos/:photoId', uploadController.deletePlacePhoto);
router.patch('/:id/photos/reorder', uploadController.reorderPlacePhotos);
router.patch('/:id/photos/cover', uploadController.setPlaceCoverPhoto);

// Admin routes
router.use(restrictTo('admin'));

router.get('/admin/stats', placeController.getPlacesStats);

export default router;
