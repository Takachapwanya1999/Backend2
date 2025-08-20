import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Place from '../models/Place.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

// Create new review
export const createReview = asyncHandler(async (req, res, next) => {
  const { place: placeId, booking: bookingId, rating, comment } = req.body;

  // Validate required fields
  if (!placeId || !rating) {
    return next(new AppError('Place ID and rating are required', 400));
  }

  // Validate rating
  if (rating < 1 || rating > 5) {
    return next(new AppError('Rating must be between 1 and 5', 400));
  }

  // Check if place exists
  const place = await Place.findById(placeId);
  if (!place) {
    return next(new AppError('Place not found', 404));
  }

  // If booking ID is provided, verify the booking
  if (bookingId) {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check if user was the guest in this booking
    if (booking.guest.toString() !== req.user.id) {
      return next(new AppError('You can only review places you have booked', 403));
    }

    // Check if booking is completed
    if (booking.status !== 'checked-out') {
      return next(new AppError('You can only review after your stay is completed', 400));
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return next(new AppError('You have already reviewed this booking', 400));
    }
  } else {
    // If no booking ID, check if user has stayed at this place
    const userBooking = await Booking.findOne({
      place: placeId,
      guest: req.user.id,
      status: 'checked-out'
    });

    if (!userBooking) {
      return next(new AppError('You can only review places where you have completed a stay', 403));
    }

    // Check if user has already reviewed this place
    const existingReview = await Review.findOne({
      place: placeId,
      user: req.user.id
    });

    if (existingReview) {
      return next(new AppError('You have already reviewed this place', 400));
    }
  }

  // Create review
  const review = await Review.create({
    place: placeId,
    user: req.user.id,
    booking: bookingId,
    rating,
    comment: comment?.trim(),
    categories: req.body.categories || {}
  });

  // Populate review details
  await review.populate([
    { path: 'user', select: 'name avatar' },
    { path: 'place', select: 'title' }
  ]);

  res.status(201).json({
    status: 'success',
    message: 'Review created successfully',
    data: {
      review
    }
  });
});

// Get reviews for a place
export const getPlaceReviews = asyncHandler(async (req, res, next) => {
  const { placeId } = req.params;
  const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

  // Check if place exists
  const place = await Place.findById(placeId);
  if (!place) {
    return next(new AppError('Place not found', 404));
  }

  const skip = (page - 1) * limit;

  const reviews = await Review.find({ place: placeId })
    .populate('user', 'name avatar')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments({ place: placeId });

  // Get rating distribution
  const ratingStats = await Review.aggregate([
    { $match: { place: place._id } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } }
  ]);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: {
      reviews,
      ratingStats,
      averageRating: place.averageRating,
      totalReviews: place.reviewCount
    }
  });
});

// Get user's reviews
export const getMyReviews = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  
  const skip = (page - 1) * limit;

  const reviews = await Review.find({ user: req.user.id })
    .populate('place', 'title photos address')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: {
      reviews
    }
  });
});

// Get reviews for host's places
export const getHostReviews = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  
  // Get all places owned by the host
  const hostPlaces = await Place.find({ owner: req.user.id }).select('_id');
  const placeIds = hostPlaces.map(place => place._id);

  const skip = (page - 1) * limit;

  const reviews = await Review.find({ place: { $in: placeIds } })
    .populate('user', 'name avatar')
    .populate('place', 'title photos')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments({ place: { $in: placeIds } });

  // Get average rating across all places
  const avgRating = await Review.aggregate([
    { $match: { place: { $in: placeIds } } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: {
      reviews,
      stats: avgRating[0] || { averageRating: 0, totalReviews: 0 }
    }
  });
});

// Get single review
export const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate('user', 'name avatar')
    .populate('place', 'title photos address owner')
    .populate('booking', 'checkIn checkOut');

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

// Update review
export const updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  // Check if user owns the review
  if (review.user.toString() !== req.user.id && !req.user.isAdmin) {
    return next(new AppError('You can only update your own reviews', 403));
  }

  // Check if review can be updated (within 30 days)
  const daysSinceCreation = (new Date() - review.createdAt) / (1000 * 60 * 60 * 24);
  if (daysSinceCreation > 30 && !req.user.isAdmin) {
    return next(new AppError('Reviews can only be updated within 30 days of creation', 400));
  }

  // Update allowed fields
  const allowedFields = ['rating', 'comment', 'categories'];
  const updateData = {};
  
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  // Validate rating if provided
  if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
    return next(new AppError('Rating must be between 1 and 5', 400));
  }

  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).populate('user', 'name avatar');

  res.status(200).json({
    status: 'success',
    message: 'Review updated successfully',
    data: {
      review: updatedReview
    }
  });
});

// Delete review
export const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  // Check permissions
  const isOwner = review.user.toString() === req.user.id;
  const isPlaceOwner = await Place.findOne({ _id: review.place, owner: req.user.id });
  
  if (!isOwner && !isPlaceOwner && !req.user.isAdmin) {
    return next(new AppError('You do not have permission to delete this review', 403));
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Host reply to review
export const replyToReview = asyncHandler(async (req, res, next) => {
  const { reply } = req.body;

  if (!reply || !reply.trim()) {
    return next(new AppError('Reply content is required', 400));
  }

  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  // Check if user is the place owner
  const place = await Place.findById(review.place);
  if (place.owner.toString() !== req.user.id && !req.user.isAdmin) {
    return next(new AppError('Only the place owner can reply to reviews', 403));
  }

  // Check if reply already exists
  if (review.hostReply) {
    return next(new AppError('You have already replied to this review', 400));
  }

  review.hostReply = {
    content: reply.trim(),
    createdAt: new Date()
  };

  await review.save();

  res.status(200).json({
    status: 'success',
    message: 'Reply added successfully',
    data: {
      review
    }
  });
});

// Update host reply
export const updateReply = asyncHandler(async (req, res, next) => {
  const { reply } = req.body;

  if (!reply || !reply.trim()) {
    return next(new AppError('Reply content is required', 400));
  }

  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  // Check if user is the place owner
  const place = await Place.findById(review.place);
  if (place.owner.toString() !== req.user.id && !req.user.isAdmin) {
    return next(new AppError('Only the place owner can update replies', 403));
  }

  if (!review.hostReply) {
    return next(new AppError('No reply exists to update', 404));
  }

  review.hostReply.content = reply.trim();
  review.hostReply.updatedAt = new Date();

  await review.save();

  res.status(200).json({
    status: 'success',
    message: 'Reply updated successfully',
    data: {
      review
    }
  });
});

// Delete host reply
export const deleteReply = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  // Check if user is the place owner
  const place = await Place.findById(review.place);
  if (place.owner.toString() !== req.user.id && !req.user.isAdmin) {
    return next(new AppError('Only the place owner can delete replies', 403));
  }

  if (!review.hostReply) {
    return next(new AppError('No reply exists to delete', 404));
  }

  review.hostReply = undefined;
  await review.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Flag review as inappropriate
export const flagReview = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;

  if (!reason) {
    return next(new AppError('Please provide a reason for flagging', 400));
  }

  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  // Check if user has already flagged this review
  const existingFlag = review.flags.find(flag => 
    flag.flaggedBy.toString() === req.user.id
  );

  if (existingFlag) {
    return next(new AppError('You have already flagged this review', 400));
  }

  review.flags.push({
    flaggedBy: req.user.id,
    reason,
    createdAt: new Date()
  });

  await review.save();

  res.status(200).json({
    status: 'success',
    message: 'Review flagged successfully',
    data: {
      review
    }
  });
});

// Get review statistics
export const getReviewStats = asyncHandler(async (req, res, next) => {
  // Overall stats
  const overallStats = await Review.aggregate([
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        flaggedReviews: {
          $sum: { $cond: [{ $gt: [{ $size: '$flags' }, 0] }, 1, 0] }
        }
      }
    }
  ]);

  // Rating distribution
  const ratingDistribution = await Review.aggregate([
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Monthly review trends
  const monthlyTrends = await Review.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      overall: overallStats[0] || {},
      ratingDistribution,
      monthlyTrends
    }
  });
});

// Admin: Get all reviews
export const getAllReviews = asyncHandler(async (req, res, next) => {
  const { flagged, page = 1, limit = 10 } = req.query;
  
  let query = {};
  
  // Filter flagged reviews
  if (flagged === 'true') {
    query['flags.0'] = { $exists: true };
  }

  const skip = (page - 1) * limit;

  const reviews = await Review.find(query)
    .populate('user', 'name avatar email')
    .populate('place', 'title address owner')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: {
      reviews
    }
  });
});
