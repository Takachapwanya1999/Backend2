import Booking from '../models/Booking.js';
import Place from '../models/Place.js';
import User from '../models/User.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

// Create new booking
export const createBooking = asyncHandler(async (req, res, next) => {
  const { place: placeId, checkIn, checkOut, guests, totalPrice, payment } = req.body;

  // Validate required fields
  if (!placeId || !checkIn || !checkOut) {
    return next(new AppError('Please provide place, check-in and check-out dates', 400));
  }

  // Normalize guests (support number or object)
  const normalizedGuests = typeof guests === 'number'
    ? { adults: guests, children: 0, infants: 0, pets: 0 }
    : {
        adults: Number(guests?.adults || 1),
        children: Number(guests?.children || 0),
        infants: Number(guests?.infants || 0),
        pets: Number(guests?.pets || 0)
      };

  const totalGuests = normalizedGuests.adults + normalizedGuests.children + normalizedGuests.infants;
  if (totalGuests < 1) normalizedGuests.adults = 1;

  // Convert dates
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Validate dates
  if (checkInDate >= checkOutDate) {
    return next(new AppError('Check-out date must be after check-in date', 400));
  }

  if (checkInDate < new Date()) {
    return next(new AppError('Check-in date cannot be in the past', 400));
  }

  // Get place details
  const place = await Place.findById(placeId);
  if (!place) {
    return next(new AppError('Place not found', 404));
  }

  // Check if user is trying to book their own place
  if (place.owner.toString() === req.user.id) {
    return next(new AppError('You cannot book your own place', 400));
  }

  // Validate guest count
  if (totalGuests > place.maxGuests) {
    return next(new AppError(`This place can accommodate maximum ${place.maxGuests} guests`, 400));
  }

  // Check availability
  const isAvailable = await place.checkAvailability(checkInDate, checkOutDate);
  if (!isAvailable) {
    return next(new AppError('Place is not available for the selected dates', 409));
  }

  // Calculate pricing via Place method
  const calculated = place.calculateTotalPrice(checkInDate, checkOutDate, totalGuests);

  // Validate provided price (allow 5% tolerance for currency conversion differences)
  if (
    totalPrice && Math.abs(Number(totalPrice) - calculated.total) > calculated.total * 0.05
  ) {
    return next(new AppError('Price mismatch. Please refresh and try again', 400));
  }

  // Require payment method
  const paymentMethod = payment?.method;
  if (!paymentMethod) {
    return next(new AppError('Payment method is required', 400));
  }

  // Create booking matching Booking schema
  const booking = await Booking.create({
    place: placeId,
    guest: req.user.id,
    host: place.owner,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    guests: normalizedGuests,
    pricing: {
      basePrice: calculated.basePrice,
      nights: calculated.nights,
      subtotal: calculated.subtotal,
      fees: {
        cleaning: calculated.cleaningFee,
        service: calculated.serviceFee,
        tax: calculated.taxes,
        other: []
      },
      total: calculated.total,
      currency: calculated.currency
    },
    payment: {
      method: paymentMethod,
      status: 'pending'
    }
  });

  // Populate booking details
  await booking.populate([
    { path: 'place', select: 'title photos address' },
    { path: 'guest', select: 'name email phone' },
    { path: 'host', select: 'name email phone' }
  ]);

  res.status(201).json({
    status: 'success',
    message: 'Booking created successfully',
    data: {
      booking
    }
  });
});

// Get all bookings for user
export const getMyBookings = asyncHandler(async (req, res, next) => {
  const { status, upcoming, past } = req.query;
  
  let query = { guest: req.user.id };
  
  // Filter by status
  if (status) {
    query.status = status;
  }
  
  // Filter by time
  if (upcoming === 'true') {
    query.checkIn = { $gte: new Date() };
  } else if (past === 'true') {
    query.checkOut = { $lt: new Date() };
  }

  const bookings = await Booking.find(query)
    .populate('place', 'title photos address owner')
    .populate('host', 'name email phone avatar')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

// Get bookings for host's places
export const getHostBookings = asyncHandler(async (req, res, next) => {
  const { status, upcoming, past, placeId } = req.query;
  
  let query = { host: req.user.id };
  
  // Filter by specific place
  if (placeId) {
    query.place = placeId;
  }
  
  // Filter by status
  if (status) {
    query.status = status;
  }
  
  // Filter by time
  if (upcoming === 'true') {
    query.checkIn = { $gte: new Date() };
  } else if (past === 'true') {
    query.checkOut = { $lt: new Date() };
  }

  const bookings = await Booking.find(query)
    .populate('place', 'title photos address')
    .populate('guest', 'name email phone avatar')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

// Get single booking
export const getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('place')
    .populate('guest', 'name email phone avatar')
    .populate('host', 'name email phone avatar');

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Check if user has access to this booking
  const userId = req.user.id;
  if (!req.user.isAdmin && 
      booking.guest._id.toString() !== userId && 
      booking.host._id.toString() !== userId) {
    return next(new AppError('You do not have permission to view this booking', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

// Update booking status
export const updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  
  if (!status) {
    return next(new AppError('Please provide booking status', 400));
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Check permissions
  const userId = req.user.id;
  const isGuest = booking.guest.toString() === userId;
  const isHost = booking.host.toString() === userId;
  
  if (!req.user.isAdmin && !isGuest && !isHost) {
    return next(new AppError('You do not have permission to update this booking', 403));
  }

  // Validate status transitions
  const validTransitions = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['checked-in', 'cancelled'],
    'checked-in': ['checked-out'],
    'checked-out': [],
    'cancelled': []
  };

  if (!validTransitions[booking.status] || !validTransitions[booking.status].includes(status)) {
    return next(new AppError(`Cannot change booking status from ${booking.status} to ${status}`, 400));
  }

  // Check user permissions for specific status changes
  if (status === 'confirmed' && !isHost && !req.user.isAdmin) {
    return next(new AppError('Only the host can confirm a booking', 403));
  }

  if (status === 'cancelled') {
    // Guests can cancel anytime, hosts can cancel with restrictions
    if (isGuest) {
      // Check cancellation policy
      const hoursUntilCheckIn = (booking.checkIn - new Date()) / (1000 * 60 * 60);
      if (hoursUntilCheckIn < 24) {
        booking.cancellationReason = 'Guest cancelled within 24 hours';
        // Apply cancellation fees if needed
      }
    } else if (isHost) {
      // Hosts need a reason to cancel
      if (!req.body.cancellationReason) {
        return next(new AppError('Host must provide cancellation reason', 400));
      }
      booking.cancellationReason = req.body.cancellationReason;
    }
  }

  // Update booking
  booking.status = status;
  booking.statusHistory.push({
    status,
    updatedBy: req.user.id,
    updatedAt: new Date(),
    reason: req.body.reason || req.body.cancellationReason
  });

  await booking.save();

  res.status(200).json({
    status: 'success',
    message: `Booking ${status} successfully`,
    data: {
      booking
    }
  });
});

// Cancel booking
export const cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Check permissions
  const userId = req.user.id;
  const isGuest = booking.guest.toString() === userId;
  const isHost = booking.host.toString() === userId;
  
  if (!req.user.isAdmin && !isGuest && !isHost) {
    return next(new AppError('You do not have permission to cancel this booking', 403));
  }

  // Check if booking can be cancelled
  if (!['pending', 'confirmed'].includes(booking.status)) {
    return next(new AppError('This booking cannot be cancelled', 400));
  }

  // Calculate refund based on cancellation policy and timing
  const hoursUntilCheckIn = (booking.checkIn - new Date()) / (1000 * 60 * 60);
  let refundAmount = 0;
  
  if (isGuest) {
    if (hoursUntilCheckIn > 48) {
      refundAmount = booking.totalPrice; // Full refund
    } else if (hoursUntilCheckIn > 24) {
      refundAmount = booking.totalPrice * 0.5; // 50% refund
    }
    // No refund for cancellations within 24 hours
  } else if (isHost) {
    // Host cancellations usually result in full refund to guest
    refundAmount = booking.totalPrice;
  }

  // Update booking
  booking.status = 'cancelled';
  booking.cancellationReason = req.body.reason || (isGuest ? 'Cancelled by guest' : 'Cancelled by host');
  booking.refundAmount = refundAmount;
  booking.statusHistory.push({
    status: 'cancelled',
    updatedBy: req.user.id,
    updatedAt: new Date(),
    reason: booking.cancellationReason
  });

  await booking.save();

  res.status(200).json({
    status: 'success',
    message: 'Booking cancelled successfully',
    data: {
      booking,
      refundAmount
    }
  });
});

// Check-in
export const checkIn = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Only host or admin can check-in guests
  if (!req.user.isAdmin && booking.host.toString() !== req.user.id) {
    return next(new AppError('Only the host can check-in guests', 403));
  }

  if (booking.status !== 'confirmed') {
    return next(new AppError('Booking must be confirmed before check-in', 400));
  }

  // Check if it's check-in day
  const today = new Date();
  const checkInDate = new Date(booking.checkIn);
  
  if (today < checkInDate.setHours(0, 0, 0, 0)) {
    return next(new AppError('Check-in is not available yet', 400));
  }

  booking.status = 'checked-in';
  booking.actualCheckIn = new Date();
  booking.statusHistory.push({
    status: 'checked-in',
    updatedBy: req.user.id,
    updatedAt: new Date()
  });

  await booking.save();

  res.status(200).json({
    status: 'success',
    message: 'Guest checked in successfully',
    data: {
      booking
    }
  });
});

// Check-out
export const checkOut = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Host or guest can initiate check-out
  const userId = req.user.id;
  const isGuest = booking.guest.toString() === userId;
  const isHost = booking.host.toString() === userId;
  
  if (!req.user.isAdmin && !isGuest && !isHost) {
    return next(new AppError('You do not have permission to check-out', 403));
  }

  if (booking.status !== 'checked-in') {
    return next(new AppError('Booking must be checked-in before check-out', 400));
  }

  booking.status = 'checked-out';
  booking.actualCheckOut = new Date();
  booking.statusHistory.push({
    status: 'checked-out',
    updatedBy: req.user.id,
    updatedAt: new Date()
  });

  await booking.save();

  res.status(200).json({
    status: 'success',
    message: 'Checked out successfully',
    data: {
      booking
    }
  });
});

// Get booking statistics (for admin and hosts)
export const getBookingStats = asyncHandler(async (req, res, next) => {
  let matchStage = {};
  
  // If not admin, only show stats for user's bookings
  if (!req.user.isAdmin) {
    if (req.user.isHost) {
      matchStage.host = req.user._id;
    } else {
      matchStage.guest = req.user._id;
    }
  }

  const stats = await Booking.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        totalRevenue: { $sum: '$totalPrice' },
        avgBookingValue: { $avg: '$totalPrice' },
        completedBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'checked-out'] }, 1, 0] }
        },
        cancelledBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        }
      }
    }
  ]);

  const monthlyStats = await Booking.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        bookings: { $sum: 1 },
        revenue: { $sum: '$totalPrice' }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 }
  ]);

  const statusStats = await Booking.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      overall: stats[0] || {},
      monthly: monthlyStats,
      byStatus: statusStats
    }
  });
});

// Admin: Get all bookings
export const getAllBookings = asyncHandler(async (req, res, next) => {
  const { status, page = 1, limit = 10 } = req.query;
  
  let query = {};
  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;
  
  const bookings = await Booking.find(query)
    .populate('place', 'title address')
    .populate('guest', 'name email')
    .populate('host', 'name email')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  const total = await Booking.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: {
      bookings
    }
  });
});

// Delete booking (admin only)
export const deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
