import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: [true, 'Place is required']
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Guest is required']
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Host is required']
  },
  checkIn: {
    type: Date,
    required: [true, 'Check-in date is required'],
    validate: {
      validator: function(date) {
        return date >= new Date();
      },
      message: 'Check-in date must be in the future'
    }
  },
  checkOut: {
    type: Date,
    required: [true, 'Check-out date is required'],
    validate: {
      validator: function(date) {
        return date > this.checkIn;
      },
      message: 'Check-out date must be after check-in date'
    }
  },
  guests: {
    adults: {
      type: Number,
      required: [true, 'Number of adults is required'],
      min: [1, 'Must have at least 1 adult'],
      max: [20, 'Cannot exceed 20 adults']
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Children cannot be negative'],
      max: [10, 'Cannot exceed 10 children']
    },
    infants: {
      type: Number,
      default: 0,
      min: [0, 'Infants cannot be negative'],
      max: [5, 'Cannot exceed 5 infants']
    },
    pets: {
      type: Number,
      default: 0,
      min: [0, 'Pets cannot be negative'],
      max: [5, 'Cannot exceed 5 pets']
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Base price cannot be negative']
    },
    nights: {
      type: Number,
      required: [true, 'Number of nights is required'],
      min: [1, 'Must be at least 1 night']
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required']
    },
    fees: {
      cleaning: {
        type: Number,
        default: 0,
        min: [0, 'Cleaning fee cannot be negative']
      },
      service: {
        type: Number,
        default: 0,
        min: [0, 'Service fee cannot be negative']
      },
      tax: {
        type: Number,
        default: 0,
        min: [0, 'Tax cannot be negative']
      },
      other: [{
        name: String,
        amount: {
          type: Number,
          min: [0, 'Fee amount cannot be negative']
        }
      }]
    },
    total: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']
    }
  },
  status: {
    type: String,
    enum: [
      'pending',        // Waiting for host approval
      'confirmed',      // Host approved, payment pending
      'paid',          // Payment completed
      'active',        // Currently checked in
      'completed',     // Checkout completed
      'cancelled_guest', // Cancelled by guest
      'cancelled_host', // Cancelled by host
      'cancelled_admin', // Cancelled by admin
      'refunded',      // Refund processed
      'disputed'       // Under dispute
    ],
    default: 'pending'
  },
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash'],
      required: [true, 'Payment method is required']
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    refundAmount: {
      type: Number,
      default: 0,
      min: [0, 'Refund amount cannot be negative']
    },
    refundedAt: Date
  },
  communication: {
    guestMessage: {
      type: String,
      maxlength: [1000, 'Guest message cannot exceed 1000 characters']
    },
    hostMessage: {
      type: String,
      maxlength: [1000, 'Host message cannot exceed 1000 characters']
    },
    specialRequests: [String]
  },
  checkin: {
    instructions: String,
    keyLocation: String,
    contactInfo: String,
    checkedInAt: Date,
    checkedOutAt: Date
  },
  review: {
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  },
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    reason: String,
    refundPolicy: {
      type: String,
      enum: ['flexible', 'moderate', 'strict', 'super_strict']
    },
    refundAmount: Number
  },
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    },
    userAgent: String,
    ipAddress: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
bookingSchema.index({ place: 1 });
bookingSchema.index({ guest: 1 });
bookingSchema.index({ host: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ 'payment.status': 1 });

// Compound indexes
bookingSchema.index({ place: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ guest: 1, status: 1 });
bookingSchema.index({ host: 1, status: 1 });

// Virtual for total guests
bookingSchema.virtual('totalGuests').get(function() {
  return this.guests.adults + this.guests.children + this.guests.infants;
});

// Virtual for duration in nights
bookingSchema.virtual('duration').get(function() {
  const timeDiff = this.checkOut.getTime() - this.checkIn.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Virtual for booking status display
bookingSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    pending: 'Pending Approval',
    confirmed: 'Confirmed',
    paid: 'Paid',
    active: 'Active',
    completed: 'Completed',
    cancelled_guest: 'Cancelled by Guest',
    cancelled_host: 'Cancelled by Host',
    cancelled_admin: 'Cancelled by Admin',
    refunded: 'Refunded',
    disputed: 'Disputed'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for formatted dates
bookingSchema.virtual('formattedCheckIn').get(function() {
  return this.checkIn.toLocaleDateString();
});

bookingSchema.virtual('formattedCheckOut').get(function() {
  return this.checkOut.toLocaleDateString();
});

// Virtual for formatted total price
bookingSchema.virtual('formattedTotal').get(function() {
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$'
  };
  const symbol = currencySymbols[this.pricing.currency] || '$';
  return `${symbol}${this.pricing.total.toFixed(2)}`;
});

// Pre-save middleware to calculate pricing
bookingSchema.pre('save', function(next) {
  if (this.isModified('checkIn') || this.isModified('checkOut') || this.isModified('pricing.basePrice')) {
    // Calculate nights
    const timeDiff = this.checkOut.getTime() - this.checkIn.getTime();
    this.pricing.nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Calculate subtotal
    this.pricing.subtotal = this.pricing.basePrice * this.pricing.nights;
    
    // Calculate total (subtotal + all fees)
    const totalFees = this.pricing.fees.cleaning + 
                     this.pricing.fees.service + 
                     this.pricing.fees.tax + 
                     (this.pricing.fees.other?.reduce((sum, fee) => sum + fee.amount, 0) || 0);
    
    this.pricing.total = this.pricing.subtotal + totalFees;
  }
  next();
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  if (['completed', 'cancelled_guest', 'cancelled_host', 'cancelled_admin'].includes(this.status)) {
    return false;
  }
  
  // Check if check-in is in the past
  if (this.checkIn <= new Date()) {
    return false;
  }
  
  return true;
};

// Method to calculate refund amount based on policy
bookingSchema.methods.calculateRefund = function(policy = 'moderate') {
  const now = new Date();
  const checkIn = new Date(this.checkIn);
  const hoursUntilCheckIn = (checkIn - now) / (1000 * 60 * 60);
  
  let refundPercentage = 0;
  
  switch (policy) {
    case 'flexible':
      if (hoursUntilCheckIn >= 24) refundPercentage = 1.0;
      else refundPercentage = 0.5;
      break;
    case 'moderate':
      if (hoursUntilCheckIn >= 120) refundPercentage = 1.0; // 5 days
      else if (hoursUntilCheckIn >= 24) refundPercentage = 0.5;
      else refundPercentage = 0;
      break;
    case 'strict':
      if (hoursUntilCheckIn >= 168) refundPercentage = 1.0; // 7 days
      else if (hoursUntilCheckIn >= 48) refundPercentage = 0.5;
      else refundPercentage = 0;
      break;
    case 'super_strict':
      if (hoursUntilCheckIn >= 720) refundPercentage = 1.0; // 30 days
      else if (hoursUntilCheckIn >= 168) refundPercentage = 0.5; // 7 days
      else refundPercentage = 0;
      break;
  }
  
  return Math.round(this.pricing.total * refundPercentage * 100) / 100;
};

// Static method to find overlapping bookings
bookingSchema.statics.findOverlapping = function(placeId, checkIn, checkOut, excludeBookingId = null) {
  const query = {
    place: placeId,
    status: { $in: ['confirmed', 'paid', 'active'] },
    $or: [
      { checkIn: { $lt: checkOut, $gte: checkIn } },
      { checkOut: { $gt: checkIn, $lte: checkOut } },
      { checkIn: { $lte: checkIn }, checkOut: { $gte: checkOut } }
    ]
  };
  
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }
  
  return this.find(query);
};

// Static method to get booking statistics
bookingSchema.statics.getStats = function(hostId, startDate, endDate) {
  const matchQuery = {
    host: hostId
  };
  
  if (startDate && endDate) {
    matchQuery.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        totalNights: { $sum: '$pricing.nights' }
      }
    }
  ]);
};

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
