import Stripe from 'stripe';
import Place from '../models/Place.js';
import Booking from '../models/Booking.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

const toStripeCurrency = (c) => (c || 'USD').toLowerCase();

const normalizeGuests = (guests) => {
  return typeof guests === 'number'
    ? { adults: guests, children: 0, infants: 0, pets: 0 }
    : {
        adults: Number(guests?.adults || 1),
        children: Number(guests?.children || 0),
        infants: Number(guests?.infants || 0),
        pets: Number(guests?.pets || 0)
      };
};

export const createPaymentIntent = asyncHandler(async (req, res, next) => {
  if (!stripe) {
    return next(new AppError('Payments are not configured on the server', 500));
  }

  const { placeId, checkIn, checkOut, guests } = req.body;
  if (!placeId || !checkIn || !checkOut) {
    return next(new AppError('Missing required fields', 400));
  }

  const place = await Place.findById(placeId);
  if (!place) return next(new AppError('Place not found', 404));

  const normalizedGuests = normalizeGuests(guests);

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  if (isNaN(checkInDate) || isNaN(checkOutDate) || checkInDate >= checkOutDate) {
    return next(new AppError('Invalid dates', 400));
  }

  const totalGuests = normalizedGuests.adults + normalizedGuests.children + normalizedGuests.infants;
  if (totalGuests > place.maxGuests) {
    return next(new AppError(`Max guests exceeded: ${place.maxGuests}`, 400));
  }

  // Optional: availability check (final check happens when booking is created)
  const isAvailable = await place.checkAvailability(checkInDate, checkOutDate);
  if (!isAvailable) {
    return next(new AppError('Place is not available for the selected dates', 409));
  }

  const calc = place.calculateTotalPrice(checkInDate, checkOutDate, totalGuests);
  const amount = Math.round(calc.total * 100); // cents
  const currency = toStripeCurrency(calc.currency);

  const metadata = {
    userId: req.user._id.toString(),
    placeId: place._id.toString(),
    checkIn: checkInDate.toISOString(),
    checkOut: checkOutDate.toISOString(),
    guests: JSON.stringify(normalizedGuests),
    total: String(calc.total),
    currency
  };

  const intent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
    metadata
  });

  res.status(200).json({
    status: 'success',
    data: {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amount,
      currency,
      breakdown: calc
    }
  });
});

export const confirmAndCreateBooking = asyncHandler(async (req, res, next) => {
  if (!stripe) {
    return next(new AppError('Payments are not configured on the server', 500));
  }

  const { paymentIntentId, name, phone } = req.body;
  if (!paymentIntentId) return next(new AppError('paymentIntentId is required', 400));

  const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (!pi) return next(new AppError('PaymentIntent not found', 404));
  if (pi.status !== 'succeeded') {
    return next(new AppError('Payment not completed', 400));
  }

  // Validate metadata and ownership
  const md = pi.metadata || {};
  if (!md.userId || md.userId !== req.user._id.toString()) {
    return next(new AppError('Payment does not belong to this user', 403));
  }

  const place = await Place.findById(md.placeId);
  if (!place) return next(new AppError('Place not found', 404));

  const checkIn = new Date(md.checkIn);
  const checkOut = new Date(md.checkOut);
  const guests = JSON.parse(md.guests || '{}');

  // Recalculate total to verify
  const totalGuests = Number(guests.adults || 1) + Number(guests.children || 0) + Number(guests.infants || 0);
  const calc = place.calculateTotalPrice(checkIn, checkOut, totalGuests);
  const expectedAmount = Math.round(calc.total * 100);
  if (expectedAmount !== pi.amount) {
    return next(new AppError('Paid amount does not match booking total', 400));
  }

  // Create booking with paid status
  const booking = await Booking.create({
    place: place._id,
    guest: req.user._id,
    host: place.owner,
    checkIn,
    checkOut,
    guests,
    pricing: {
      basePrice: calc.basePrice,
      nights: calc.nights,
      subtotal: calc.subtotal,
      fees: { cleaning: calc.cleaningFee, service: calc.serviceFee, tax: calc.taxes, other: [] },
      total: calc.total,
      currency: calc.currency
    },
    payment: {
      method: 'card',
      provider: 'stripe',
      status: 'paid',
      reference: pi.id,
      amount: pi.amount / 100,
      currency: pi.currency.toUpperCase()
    },
    contact: {
      name: name || req.user.name,
      phone: phone || req.user.phone || ''
    },
    status: 'confirmed'
  });

  await booking.populate([
    { path: 'place', select: 'title photos address' },
    { path: 'guest', select: 'name email phone' },
    { path: 'host', select: 'name email phone' }
  ]);

  res.status(201).json({
    status: 'success',
    message: 'Payment confirmed and booking created',
    data: { booking }
  });
});
