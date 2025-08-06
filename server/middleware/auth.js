import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError, asyncHandler } from './errorHandler.js';

// Generate JWT token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Protect routes middleware
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  // Check if token exists
  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id).select('+loginAttempts +lockUntil');
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Check if user account is locked
    if (currentUser.isLocked) {
      return next(new AppError('Account is temporarily locked due to too many failed login attempts.', 423));
    }

    // Check if user is verified (optional, depending on your app requirements)
    if (!currentUser.isVerified) {
      return next(new AppError('Please verify your email address before accessing this resource.', 403));
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
});

// Optional authentication (doesn't fail if no token)
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      const decoded = verifyToken(token);
      const currentUser = await User.findById(decoded.id);
      if (currentUser && !currentUser.isLocked) {
        req.user = currentUser;
      }
    } catch (error) {
      // Ignore token errors for optional auth
    }
  }

  next();
});

// Restrict to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // Check if user has required role
    const userRoles = [];
    if (req.user.isAdmin) userRoles.push('admin');
    if (req.user.isHost) userRoles.push('host');
    userRoles.push('user'); // All users have 'user' role

    const hasRequiredRole = roles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }

    next();
  };
};

// Check if user owns the resource
export const checkOwnership = (Model, paramName = 'id') => {
  return asyncHandler(async (req, res, next) => {
    const resource = await Model.findById(req.params[paramName]);
    
    if (!resource) {
      return next(new AppError('Resource not found.', 404));
    }

    // Admin can access any resource
    if (req.user.isAdmin) {
      req.resource = resource;
      return next();
    }

    // Check ownership
    const ownerId = resource.owner || resource.user || resource.guest || resource.host;
    if (!ownerId || ownerId.toString() !== req.user._id.toString()) {
      return next(new AppError('You do not have permission to access this resource.', 403));
    }

    req.resource = resource;
    next();
  });
};

// Check if user is host of the place
export const checkPlaceOwnership = asyncHandler(async (req, res, next) => {
  const Place = (await import('../models/Place.js')).default;
  const place = await Place.findById(req.params.placeId || req.params.id);
  
  if (!place) {
    return next(new AppError('Place not found.', 404));
  }

  // Admin can access any place
  if (req.user.isAdmin) {
    req.place = place;
    return next();
  }

  // Check if user owns the place
  if (place.owner.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to access this place.', 403));
  }

  req.place = place;
  next();
});

// Check if user is involved in the booking (guest or host)
export const checkBookingAccess = asyncHandler(async (req, res, next) => {
  const Booking = (await import('../models/Booking.js')).default;
  const booking = await Booking.findById(req.params.bookingId || req.params.id);
  
  if (!booking) {
    return next(new AppError('Booking not found.', 404));
  }

  // Admin can access any booking
  if (req.user.isAdmin) {
    req.booking = booking;
    return next();
  }

  // Check if user is guest or host of the booking
  const userId = req.user._id.toString();
  if (booking.guest.toString() !== userId && booking.host.toString() !== userId) {
    return next(new AppError('You do not have permission to access this booking.', 403));
  }

  req.booking = booking;
  next();
});

// Rate limiting for login attempts
export const loginLimiter = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return next(new AppError('Email is required.', 400));
  }

  const user = await User.findByEmail(email).select('+loginAttempts +lockUntil');
  
  if (user && user.isLocked) {
    return next(new AppError('Account is temporarily locked due to too many failed login attempts. Please try again later.', 423));
  }

  req.targetUser = user;
  next();
});

// Cookie options
export const cookieOptions = {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
};
