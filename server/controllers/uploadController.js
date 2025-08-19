import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Place from '../models/Place.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

// Multer configuration for memory storage
const multerStorage = multer.memoryStorage();

// File filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files at once
  }
});

// Upload middleware
export const uploadUserAvatar = upload.single('avatar');
export const uploadPlacePhotos = upload.array('photos', 10);
export const uploadSinglePhoto = upload.single('photo');

// Resize and save user avatar
export const resizeUserAvatar = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const uploadsDir = path.join(__dirname, '../uploads/avatars');
  await ensureDirectoryExists(uploadsDir);

  req.file.filename = `avatar-${req.user.id}-${Date.now()}.jpeg`;
  const filePath = path.join(uploadsDir, req.file.filename);

  await sharp(req.file.buffer)
    .resize(200, 200)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(filePath);

  req.file.path = `/uploads/avatars/${req.file.filename}`;
  next();
});

// Resize and save place photos
export const resizePlacePhotos = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  const uploadsDir = path.join(__dirname, '../uploads/places');
  await ensureDirectoryExists(uploadsDir);

  req.files = await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `place-${req.params.id || 'new'}-${Date.now()}-${i + 1}.jpeg`;
      const filePath = path.join(uploadsDir, filename);

      await sharp(file.buffer)
        .resize(1200, 800)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(filePath);

      return {
        ...file,
        filename,
        path: `/uploads/places/${filename}`
      };
    })
  );

  next();
});

// Update user avatar
export const updateUserAvatar = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload an avatar image', 400));
  }

  // Delete old avatar if exists
  const user = await User.findById(req.user.id);
  if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
    const oldAvatarPath = path.join(__dirname, '../', user.avatar);
    try {
      await fs.unlink(oldAvatarPath);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  }

  // Update user avatar
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: req.file.path },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Avatar updated successfully',
    data: {
      user: updatedUser
    }
  });
});

// Upload place photos
export const uploadPhotosToPlace = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError('Please upload at least one photo', 400));
  }

  const place = await Place.findById(req.params.id);
  if (!place) {
    return next(new AppError('Place not found', 404));
  }

  // Check ownership
  if (place.owner.toString() !== req.user.id && !req.user.isAdmin) {
    return next(new AppError('You do not have permission to upload photos to this place', 403));
  }

  // Process uploaded files: store as string URLs to match Place.photos schema
  const newPhotos = req.files.map(file => file.path);

  // Add photos to place (string URLs)
  place.photos.push(...newPhotos);
  await place.save();

  res.status(200).json({
    status: 'success',
    message: 'Photos uploaded successfully',
    data: {
      photos: newPhotos,
      totalPhotos: place.photos.length
    }
  });
});

// Delete place photo
export const deletePlacePhoto = asyncHandler(async (req, res, next) => {
  const { placeId, photoId } = req.params; // photoId is filename or encoded url

  const place = await Place.findById(placeId);
  if (!place) {
    return next(new AppError('Place not found', 404));
  }

  // Check ownership
  if (place.owner.toString() !== req.user.id && !req.user.isAdmin) {
    return next(new AppError('You do not have permission to delete photos from this place', 403));
  }

  // Find photo by matching url or basename
  const photoIndex = place.photos.findIndex((photo) => {
    const url = photo;
    return (
      url === photoId ||
      url === `/uploads/places/${photoId}` ||
      path.basename(url) === photoId
    );
  });
  if (photoIndex === -1) {
    return next(new AppError('Photo not found', 404));
  }

  const photo = place.photos[photoIndex];

  // Delete file from filesystem
  if (photo && photo.startsWith('/uploads/places/')) {
    const filePath = path.join(__dirname, '../', photo);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // File might already be deleted, continue
    }
  }

  // Remove photo from array
  place.photos.splice(photoIndex, 1);
  await place.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Reorder place photos
export const reorderPlacePhotos = asyncHandler(async (req, res, next) => {
  const { photoOrder } = req.body;

  if (!photoOrder || !Array.isArray(photoOrder)) {
    return next(new AppError('Please provide photo order array', 400));
  }

  const place = await Place.findById(req.params.id);
  if (!place) {
    return next(new AppError('Place not found', 404));
  }

  // Check ownership
  if (place.owner.toString() !== req.user.id && !req.user.isAdmin) {
    return next(new AppError('You do not have permission to reorder photos for this place', 403));
  }

  // Validate provided order using filenames or full urls
  const byBasename = new Map(place.photos.map((p) => [path.basename(p), p]));
  const inSet = new Set(place.photos);
  const resolved = photoOrder
    .map((id) => (byBasename.get(id) || (inSet.has(id) ? id : `/uploads/places/${id}`)))
    .filter((p) => inSet.has(p));
  if (resolved.length !== place.photos.length) {
    return next(new AppError('Invalid photo order provided', 400));
  }

  place.photos = resolved;
  await place.save();

  res.status(200).json({
    status: 'success',
    message: 'Photos reordered successfully',
    data: {
  photos: place.photos
    }
  });
});

// Set place cover photo
export const setPlaceCoverPhoto = asyncHandler(async (req, res, next) => {
  const { photoId } = req.body; // filename or url

  if (!photoId) {
    return next(new AppError('Please provide photo ID', 400));
  }

  const place = await Place.findById(req.params.id);
  if (!place) {
    return next(new AppError('Place not found', 404));
  }

  // Check ownership
  if (place.owner.toString() !== req.user.id && !req.user.isAdmin) {
    return next(new AppError('You do not have permission to set cover photo for this place', 403));
  }

  // Resolve target url
  const resolveMatch = (p) => p === photoId || p === `/uploads/places/${photoId}` || path.basename(p) === photoId;
  const photoIndex = place.photos.findIndex(resolveMatch);
  if (photoIndex === -1) {
    return next(new AppError('Photo not found', 404));
  }
  const [coverPhoto] = place.photos.splice(photoIndex, 1);
  place.photos.unshift(coverPhoto);

  await place.save();

  res.status(200).json({
    status: 'success',
    message: 'Cover photo set successfully',
    data: {
  coverPhoto: coverPhoto,
  photos: place.photos
    }
  });
});

// Get upload statistics
export const getUploadStats = asyncHandler(async (req, res, next) => {
  const uploadsDir = path.join(__dirname, '../uploads');
  
  const getDirectorySize = async (dirPath) => {
    try {
      const files = await fs.readdir(dirPath, { withFileTypes: true });
      let size = 0;
      let count = 0;

      for (const file of files) {
        const filePath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
          const subStats = await getDirectorySize(filePath);
          size += subStats.size;
          count += subStats.count;
        } else {
          const stats = await fs.stat(filePath);
          size += stats.size;
          count++;
        }
      }

      return { size, count };
    } catch (error) {
      return { size: 0, count: 0 };
    }
  };

  const avatarsStats = await getDirectorySize(path.join(uploadsDir, 'avatars'));
  const placesStats = await getDirectorySize(path.join(uploadsDir, 'places'));

  res.status(200).json({
    status: 'success',
    data: {
      avatars: {
        count: avatarsStats.count,
        size: avatarsStats.size,
        sizeFormatted: `${(avatarsStats.size / 1024 / 1024).toFixed(2)} MB`
      },
      places: {
        count: placesStats.count,
        size: placesStats.size,
        sizeFormatted: `${(placesStats.size / 1024 / 1024).toFixed(2)} MB`
      },
      total: {
        count: avatarsStats.count + placesStats.count,
        size: avatarsStats.size + placesStats.size,
        sizeFormatted: `${((avatarsStats.size + placesStats.size) / 1024 / 1024).toFixed(2)} MB`
      }
    }
  });
});

// Clean up orphaned files (admin only)
export const cleanupOrphanedFiles = asyncHandler(async (req, res, next) => {
  const uploadsDir = path.join(__dirname, '../uploads');
  let deletedFiles = 0;
  let freedSpace = 0;

  // Check avatars
  const avatarsDir = path.join(uploadsDir, 'avatars');
  try {
    const avatarFiles = await fs.readdir(avatarsDir);
    const usersWithAvatars = await User.find({ 
      avatar: { $regex: '^/uploads/avatars/' } 
    }).select('avatar');
    
    const usedAvatars = usersWithAvatars.map(user => 
      path.basename(user.avatar)
    );

    for (const file of avatarFiles) {
      if (!usedAvatars.includes(file)) {
        const filePath = path.join(avatarsDir, file);
        const stats = await fs.stat(filePath);
        await fs.unlink(filePath);
        deletedFiles++;
        freedSpace += stats.size;
      }
    }
  } catch (error) {
    // Directory might not exist
  }

  // Check place photos
  const placesDir = path.join(uploadsDir, 'places');
  try {
    const placeFiles = await fs.readdir(placesDir);
    const placesWithPhotos = await Place.find({ 
      'photos.url': { $regex: '^/uploads/places/' } 
    }).select('photos.url');
    
    const usedPhotos = placesWithPhotos.flatMap(place => 
      place.photos
        .filter(photo => photo.url.startsWith('/uploads/places/'))
        .map(photo => path.basename(photo.url))
    );

    for (const file of placeFiles) {
      if (!usedPhotos.includes(file)) {
        const filePath = path.join(placesDir, file);
        const stats = await fs.stat(filePath);
        await fs.unlink(filePath);
        deletedFiles++;
        freedSpace += stats.size;
      }
    }
  } catch (error) {
    // Directory might not exist
  }

  res.status(200).json({
    status: 'success',
    message: 'Cleanup completed successfully',
    data: {
      deletedFiles,
      freedSpace,
      freedSpaceFormatted: `${(freedSpace / 1024 / 1024).toFixed(2)} MB`
    }
  });
});

// Return uploaded photo paths (for new places before an id exists)
export const returnUploadedPhotoPaths = asyncHandler(async (req, res, next) => {
  // Expect req.files to be populated by uploadPlacePhotos + resizePlacePhotos
  if (!req.files || req.files.length === 0) {
    return next(new AppError('Please upload at least one photo', 400));
  }

  const photos = req.files.map((file) => file.path);

  res.status(200).json({
    status: 'success',
    data: {
      photos
    }
  });
});
