import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { generateToken, cookieOptions } from '../middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';

// Create and send token response
const createSendToken = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id);
  
  // Remove password from output
  user.password = undefined;
  user.loginAttempts = undefined;
  user.lockUntil = undefined;
  
  res.cookie('jwt', token, cookieOptions);
  
  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    data: {
      user
    }
  });
};

// Register user
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if passwords match
  // if (password !== passwordConfirm) {
  //   return next(new AppError('Passwords do not match.', 400));
  // }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('User with this email already exists.', 400));
  }

  // Create new user
  const newUser = await User.create({
    name,
    email,
    password
  });

  const autoVerify = process.env.AUTO_VERIFY_USERS === 'true' || process.env.NODE_ENV === 'development';
  if (autoVerify) {
    newUser.isVerified = true;
    newUser.emailVerificationToken = undefined;
    newUser.emailVerificationExpires = undefined;
    await newUser.save({ validateBeforeSave: false });
    return createSendToken(newUser, 201, res, 'User registered successfully.');
  }

  // Otherwise, create an email verification token (email sending still TODO)
  const verifyToken = newUser.createEmailVerificationToken();
  await newUser.save({ validateBeforeSave: false });
  // TODO: Send verification email with verifyToken
  createSendToken(newUser, 201, res, 'User registered successfully. Please check your email for verification.');
});

// Login user
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  // Check if user exists and get password
  const user = await User.findByEmail(email).select('+password +loginAttempts +lockUntil');
  
  if (!user) {
    return next(new AppError('Invalid email or password.', 401));
  }

  // Check if account is inactive (banned/deleted)
  if (user.active === false) {
    return next(new AppError('Your account is deactivated. Contact support.', 403));
  }

  // Check if account is locked
  if (user.isLocked) {
    return next(new AppError('Account is temporarily locked due to too many failed login attempts.', 423));
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password);
  
  if (!isPasswordCorrect) {
    // Increment login attempts
    await user.incLoginAttempts();
    return next(new AppError('Invalid email or password.', 401));
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await User.updateOne(
      { _id: user._id },
      { $unset: { loginAttempts: 1, lockUntil: 1 } }
    );
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res, 'Logged in successfully.');
});

// Google OAuth login
export const googleAuth = asyncHandler(async (req, res, next) => {
  // Support either a raw Google credential (ID token) or the old object payload
  const { credential } = req.body;
  let { googleId, email, name, picture } = req.body;

  if (credential) {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    try {
      if (!clientId) {
        // Soft fallback: decode without verification when no clientId is configured (dev only)
        const decoded = jwt.decode(credential);
        if (!decoded) {
          return next(new AppError('Invalid Google credential.', 400));
        }
        googleId = decoded.sub;
        email = decoded.email;
        name = decoded.name || [decoded.given_name, decoded.family_name].filter(Boolean).join(' ');
        picture = decoded.picture;
      } else {
        const client = new OAuth2Client(clientId);
        const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
        const payload = ticket.getPayload();
        googleId = payload.sub;
        email = payload.email;
        name = payload.name || [payload.given_name, payload.family_name].filter(Boolean).join(' ');
        picture = payload.picture;
      }
    } catch (e) {
      return next(new AppError('Failed to verify Google credential.', 401));
    }
  }

  if (!googleId || !email || !name) {
    return next(new AppError('Missing required Google OAuth data.', 400));
  }

  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    // Update Google ID/avatar and mark verified
    let changed = false;
    if (!user.googleId) { user.googleId = googleId; changed = true; }
    if (picture && user.avatar !== picture) { user.avatar = picture; changed = true; }
    if (!user.isVerified) { user.isVerified = true; changed = true; }
    if (changed) await user.save({ validateBeforeSave: false });
  } else {
    // Create new user
    user = await User.create({
      name,
      email,
      googleId,
      avatar: picture,
      isVerified: true,
      password: crypto.randomBytes(32).toString('hex') // Random password for Google users
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res, 'Google authentication successful.');
});

// Logout user
export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully.'
  });
};

// Get current user
export const getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

// Update current user profile
export const updateMe = asyncHandler(async (req, res, next) => {
  // Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /update-password.', 400));
  }

  // Allowed fields to update
  const allowedFields = ['name', 'email', 'phone', 'bio', 'preferences'];
  const filteredBody = {};
  
  Object.keys(req.body).forEach(el => {
    if (allowedFields.includes(el)) {
      filteredBody[el] = req.body[el];
    }
  });

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully.',
    data: {
      user: updatedUser
    }
  });
});

// Update password
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;

  if (!currentPassword || !password || !passwordConfirm) {
    return next(new AppError('Please provide current password, new password, and password confirmation.', 400));
  }

  // Check if passwords match
  if (password !== passwordConfirm) {
    return next(new AppError('New passwords do not match.', 400));
  }

  // Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // Check if current password is correct
  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Your current password is incorrect.', 401));
  }

  // If so, update password
  user.password = password;
  await user.save();

  // Log user in, send JWT
  createSendToken(user, 200, res, 'Password updated successfully.');
});

// Forgot password
export const forgotPassword = asyncHandler(async (req, res, next) => {
  // Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }

  // Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // TODO: Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

  try {
    // TODO: Send email with reset URL
    
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later.', 500));
  }
});

// Reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm) {
    return next(new AppError('Please provide password and password confirmation.', 400));
  }

  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match.', 400));
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Log the user in, send JWT
  createSendToken(user, 200, res, 'Password reset successful.');
});

// Verify email
export const verifyEmail = asyncHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully.'
  });
});

// Resend verification email
export const resendVerification = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user) {
    return next(new AppError('No user found with that email address.', 404));
  }

  if (user.isVerified) {
    return next(new AppError('Email is already verified.', 400));
  }

  const verifyToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // TODO: Send verification email

  res.status(200).json({
    status: 'success',
    message: 'Verification email sent successfully.',
    token: process.env.NODE_ENV === 'development' ? verifyToken : undefined
  });
});

// Delete account
export const deleteMe = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next(new AppError('Please provide your password to delete your account.', 400));
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check password
  if (!(await user.comparePassword(password))) {
    return next(new AppError('Incorrect password.', 401));
  }

  // Soft delete - set account as inactive
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    message: 'Account deleted successfully.',
    data: null
  });
});

// Admin: Get all users
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({})
    .select('-__v')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

// Admin: Get single user
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Admin: Update user
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Admin: Delete user
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Admin: Ban user (set active:false)
export const banUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true }
  );

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({ status: 'success', message: 'User banned', data: { user } });
});

// Admin: Unban user (set active:true)
export const unbanUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { active: true },
    { new: true }
  );

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({ status: 'success', message: 'User unbanned', data: { user } });
});
