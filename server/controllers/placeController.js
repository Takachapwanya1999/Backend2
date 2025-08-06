import Place from '../models/Place.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

// Get all places with filtering, sorting, and pagination
export const getAllPlaces = asyncHandler(async (req, res, next) => {
  // Build query
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'location', 'minPrice', 'maxPrice'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  let query = Place.find(JSON.parse(queryStr));

  // Text search
  if (req.query.search) {
    query = query.find({ $text: { $search: req.query.search } });
  }

  // Location-based search
  if (req.query.location) {
    const { lat, lng, radius = 10 } = req.query.location;
    if (lat && lng) {
      query = query.find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [lng, lat] },
            $maxDistance: radius * 1000 // Convert km to meters
          }
        }
      });
    }
  }

  // Price range filtering
  if (req.query.minPrice || req.query.maxPrice) {
    const priceFilter = {};
    if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
    query = query.find({ price: priceFilter });
  }

  // Availability filtering
  if (req.query.checkIn && req.query.checkOut) {
    const checkIn = new Date(req.query.checkIn);
    const checkOut = new Date(req.query.checkOut);
    
    // Find places that are available for the requested dates
    const unavailablePlaces = await Booking.find({
      $or: [
        {
          checkIn: { $lte: checkOut },
          checkOut: { $gte: checkIn }
        }
      ]
    }).distinct('place');

    query = query.find({ _id: { $nin: unavailablePlaces } });
  }

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // Execute query with population
  const places = await query.populate('owner', 'name avatar');

  // Get total count for pagination
  const total = await Place.countDocuments();

  res.status(200).json({
    status: 'success',
    results: places.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: {
      places
    }
  });
});

// Get single place
export const getPlace = asyncHandler(async (req, res, next) => {
  const place = await Place.findById(req.params.id)
    .populate('owner', 'name avatar email phone isHost')
    .populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'name avatar'
      }
    });

  if (!place) {
    return next(new AppError('No place found with that ID', 404));
  }

  // Increment view count
  place.views += 1;
  await place.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      place
    }
  });
});

// Create new place
export const createPlace = asyncHandler(async (req, res, next) => {
  // Add owner to req.body
  req.body.owner = req.user.id;

  // Validate coordinates if provided
  if (req.body.address && req.body.address.coordinates) {
    const [lng, lat] = req.body.address.coordinates;
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      return next(new AppError('Invalid coordinates. Longitude must be between -180 and 180, latitude between -90 and 90.', 400));
    }
  }

  const newPlace = await Place.create(req.body);

  // Update user to host status
  await User.findByIdAndUpdate(req.user.id, { isHost: true });

  res.status(201).json({
    status: 'success',
    message: 'Place created successfully.',
    data: {
      place: newPlace
    }
  });
});

// Update place
export const updatePlace = asyncHandler(async (req, res, next) => {
  // Check if place exists and user owns it
  const place = await Place.findById(req.params.id);
  
  if (!place) {
    return next(new AppError('No place found with that ID', 404));
  }

  // Check ownership (unless admin)
  if (!req.user.isAdmin && place.owner.toString() !== req.user.id) {
    return next(new AppError('You do not have permission to update this place', 403));
  }

  // Validate coordinates if provided
  if (req.body.address && req.body.address.coordinates) {
    const [lng, lat] = req.body.address.coordinates;
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      return next(new AppError('Invalid coordinates. Longitude must be between -180 and 180, latitude between -90 and 90.', 400));
    }
  }

  const updatedPlace = await Place.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Place updated successfully.',
    data: {
      place: updatedPlace
    }
  });
});

// Delete place
export const deletePlace = asyncHandler(async (req, res, next) => {
  const place = await Place.findById(req.params.id);

  if (!place) {
    return next(new AppError('No place found with that ID', 404));
  }

  // Check ownership (unless admin)
  if (!req.user.isAdmin && place.owner.toString() !== req.user.id) {
    return next(new AppError('You do not have permission to delete this place', 403));
  }

  // Check for active bookings
  const activeBookings = await Booking.find({
    place: req.params.id,
    status: { $in: ['confirmed', 'checked-in'] },
    checkOut: { $gte: new Date() }
  });

  if (activeBookings.length > 0) {
    return next(new AppError('Cannot delete place with active bookings', 400));
  }

  await Place.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get user's places
export const getMyPlaces = asyncHandler(async (req, res, next) => {
  const places = await Place.find({ owner: req.user.id })
    .sort('-createdAt')
    .populate('reviews');

  res.status(200).json({
    status: 'success',
    results: places.length,
    data: {
      places
    }
  });
});

// Upload place photos
export const uploadPlacePhotos = asyncHandler(async (req, res, next) => {
  const place = await Place.findById(req.params.id);

  if (!place) {
    return next(new AppError('No place found with that ID', 404));
  }

  // Check ownership (unless admin)
  if (!req.user.isAdmin && place.owner.toString() !== req.user.id) {
    return next(new AppError('You do not have permission to upload photos for this place', 403));
  }

  if (!req.files || req.files.length === 0) {
    return next(new AppError('Please upload at least one photo', 400));
  }

  // Process uploaded files
  const photos = req.files.map(file => ({
    url: `/uploads/places/${file.filename}`,
    filename: file.filename,
    originalName: file.originalname
  }));

  // Add photos to place
  place.photos.push(...photos);
  await place.save();

  res.status(200).json({
    status: 'success',
    message: 'Photos uploaded successfully.',
    data: {
      photos: photos,
      place: place
    }
  });
});

// Delete place photo
export const deletePlacePhoto = asyncHandler(async (req, res, next) => {
  const { id: placeId, photoId } = req.params;
  
  const place = await Place.findById(placeId);

  if (!place) {
    return next(new AppError('No place found with that ID', 404));
  }

  // Check ownership (unless admin)
  if (!req.user.isAdmin && place.owner.toString() !== req.user.id) {
    return next(new AppError('You do not have permission to delete photos from this place', 403));
  }

  // Find and remove photo
  const photoIndex = place.photos.findIndex(photo => photo._id.toString() === photoId);
  
  if (photoIndex === -1) {
    return next(new AppError('Photo not found', 404));
  }

  place.photos.splice(photoIndex, 1);
  await place.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Search places by category with specific filtering
export const searchPlacesByCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.params;
  let query = Place.find({ status: 'active' });

  // Define category-specific filters
  const categoryFilters = {
    'beachfront': {
      amenities: { $in: ['beach_access', 'ocean_view'] },
      propertyType: { $in: ['house', 'villa', 'apartment', 'cottage'] }
    },
    'cabins': {
      propertyType: { $in: ['cabin', 'cottage'] }
    },
    'trending': {
      featured: true,
      'ratings.overall': { $gte: 4.5 }
    },
    'countryside': {
      $or: [
        { amenities: { $in: ['garden', 'mountain_view'] } },
        { propertyType: { $in: ['house', 'cottage', 'cabin'] } }
      ]
    },
    'amazing-pools': {
      amenities: { $in: ['pool', 'hot_tub'] }
    },
    'rooms': {
      roomType: 'private_room'
    },
    'tiny-homes': {
      propertyType: { $in: ['studio', 'tiny_house'] },
      maxGuests: { $lte: 3 }
    },
    'lakefront': {
      amenities: { $in: ['lake_view'] }
    },
    'design': {
      propertyType: { $in: ['loft', 'villa', 'modern'] },
      'ratings.overall': { $gte: 4.5 }
    },
    'omg': {
      propertyType: { $in: ['castle', 'treehouse', 'boat', 'unique'] }
    },
    'mansions': {
      propertyType: { $in: ['villa', 'house', 'mansion'] },
      maxGuests: { $gte: 8 },
      price: { $gte: 200 }
    },
    'treehouses': {
      propertyType: 'treehouse'
    },
    'islands': {
      amenities: { $in: ['ocean_view', 'beach_access'] },
      propertyType: { $in: ['villa', 'house'] }
    }
  };

  // Apply category-specific filter
  if (categoryFilters[category]) {
    query = query.find(categoryFilters[category]);
  }

  // Apply additional query parameters
  const {
    minPrice,
    maxPrice,
    guests,
    checkIn,
    checkOut,
    amenities,
    sort = '-ratings.overall',
    page = 1,
    limit = 12
  } = req.query;

  // Price range
  if (minPrice || maxPrice) {
    const priceFilter = {};
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);
    query = query.find({ price: priceFilter });
  }

  // Guest capacity
  if (guests) {
    query = query.find({ maxGuests: { $gte: Number(guests) } });
  }

  // Additional amenities
  if (amenities) {
    const amenityList = amenities.split(',');
    query = query.find({ amenities: { $all: amenityList } });
  }

  // Availability check
  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    const unavailablePlaces = await Booking.find({
      $or: [
        {
          checkIn: { $lte: checkOutDate },
          checkOut: { $gte: checkInDate }
        }
      ],
      status: { $in: ['confirmed', 'checked-in'] }
    }).distinct('place');

    query = query.find({ _id: { $nin: unavailablePlaces } });
  }

  // Sorting
  query = query.sort(sort);

  // Pagination
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(Number(limit));

  // Execute query
  const places = await query.populate('owner', 'name avatar');
  
  // Get total count for this category
  const totalQuery = Place.find({ status: 'active' });
  if (categoryFilters[category]) {
    totalQuery.find(categoryFilters[category]);
  }
  const total = await totalQuery.countDocuments();

  res.status(200).json({
    status: 'success',
    results: places.length,
    category: category,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: {
      places
    }
  });
});

// Get place availability
export const getPlaceAvailability = asyncHandler(async (req, res, next) => {
  const place = await Place.findById(req.params.id);

  if (!place) {
    return next(new AppError('No place found with that ID', 404));
  }

  const { year, month } = req.query;
  
  let startDate, endDate;
  
  if (year && month) {
    startDate = new Date(year, month - 1, 1);
    endDate = new Date(year, month, 0);
  } else {
    startDate = new Date();
    endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Next year
  }

  // Get bookings for the period
  const bookings = await Booking.find({
    place: req.params.id,
    status: { $in: ['confirmed', 'checked-in'] },
    $or: [
      {
        checkIn: { $gte: startDate, $lte: endDate }
      },
      {
        checkOut: { $gte: startDate, $lte: endDate }
      },
      {
        checkIn: { $lte: startDate },
        checkOut: { $gte: endDate }
      }
    ]
  }).select('checkIn checkOut');

  // Check availability
  const availability = await place.checkAvailability(startDate, endDate);

  res.status(200).json({
    status: 'success',
    data: {
      available: availability,
      bookings: bookings,
      period: {
        startDate,
        endDate
      }
    }
  });
});

// Search places with advanced filters
export const searchPlaces = asyncHandler(async (req, res, next) => {
  const {
    q, // Search query
    location,
    checkIn,
    checkOut,
    guests,
    minPrice,
    maxPrice,
    propertyType,
    amenities,
    rating,
    instantBook,
    page = 1,
    limit = 10,
    sort = '-createdAt'
  } = req.query;

  // Build search query
  let query = Place.find();

  // Text search
  if (q) {
    query = query.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { 'address.city': { $regex: q, $options: 'i' } },
        { 'address.country': { $regex: q, $options: 'i' } }
      ]
    });
  }

  // Location search
  if (location) {
    query = query.find({
      $or: [
        { 'address.city': { $regex: location, $options: 'i' } },
        { 'address.state': { $regex: location, $options: 'i' } },
        { 'address.country': { $regex: location, $options: 'i' } }
      ]
    });
  }

  // Guest capacity
  if (guests) {
    query = query.find({ maxGuests: { $gte: Number(guests) } });
  }

  // Price range
  if (minPrice || maxPrice) {
    const priceFilter = {};
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);
    query = query.find({ price: priceFilter });
  }

  // Property type
  if (propertyType) {
    query = query.find({ type: propertyType });
  }

  // Amenities
  if (amenities) {
    const amenityList = amenities.split(',');
    query = query.find({ amenities: { $all: amenityList } });
  }

  // Rating
  if (rating) {
    query = query.find({ averageRating: { $gte: Number(rating) } });
  }

  // Instant book
  if (instantBook === 'true') {
    query = query.find({ instantBook: true });
  }

  // Availability check
  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    const unavailablePlaces = await Booking.find({
      $or: [
        {
          checkIn: { $lte: checkOutDate },
          checkOut: { $gte: checkInDate }
        }
      ],
      status: { $in: ['confirmed', 'checked-in'] }
    }).distinct('place');

    query = query.find({ _id: { $nin: unavailablePlaces } });
  }

  // Sorting
  query = query.sort(sort);

  // Pagination
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(Number(limit));

  // Execute query
  const places = await query.populate('owner', 'name avatar');
  const total = await Place.countDocuments();

  res.status(200).json({
    status: 'success',
    results: places.length,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: {
      places
    }
  });
});

// Get featured places
export const getFeaturedPlaces = asyncHandler(async (req, res, next) => {
  const places = await Place.find({ featured: true })
    .limit(8)
    .populate('owner', 'name avatar')
    .sort('-averageRating');

  res.status(200).json({
    status: 'success',
    results: places.length,
    data: {
      places
    }
  });
});

// Get places statistics (for admin)
export const getPlacesStats = asyncHandler(async (req, res, next) => {
  const stats = await Place.aggregate([
    {
      $group: {
        _id: null,
        totalPlaces: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        avgRating: { $avg: '$averageRating' },
        totalViews: { $sum: '$views' }
      }
    }
  ]);

  const typeStats = await Place.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      overall: stats[0] || {},
      byType: typeStats
    }
  });
});
