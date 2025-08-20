import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  photos: [{
    type: String,
    required: true
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']
  },
  maxGuests: {
    type: Number,
    required: [true, 'Maximum guests is required'],
    min: [1, 'Maximum guests must be at least 1'],
    max: [20, 'Maximum guests cannot exceed 20']
  },
  bedrooms: {
  type: Number,
  default: 1,
  min: [0, 'Bedrooms cannot be negative']
  },
  beds: {
  type: Number,
  default: 1,
  min: [1, 'Must have at least 1 bed']
  },
  bathrooms: {
  type: Number,
  default: 1,
  min: [0.5, 'Must have at least 0.5 bathrooms'],
  max: [10, 'Cannot have more than 10 bathrooms']
  },
  propertyType: {
  type: String,
  default: 'apartment',
    enum: [
      'apartment',
      'house',
      'villa',
      'condo',
      'cottage',
      'cabin',
      'loft',
      'townhouse',
      'studio',
      'chalet',
      'castle',
      'treehouse',
      'boat',
      'tent',
      'other'
    ]
  },
  roomType: {
  type: String,
  default: 'entire_place',
    enum: ['entire_place', 'private_room', 'shared_room']
  },
  amenities: [{
    type: String,
    enum: [
      'wifi',
      'kitchen',
      'parking',
      'pool',
      'hot_tub',
      'gym',
      'air_conditioning',
      'heating',
      'washer',
      'dryer',
      'tv',
      'fireplace',
      'balcony',
      'garden',
      'bbq_grill',
      'beach_access',
      'ski_access',
      'pet_friendly',
      'smoking_allowed',
      'events_allowed',
      'accessibility_features',
      'baby_safety_gates',
      'high_chair',
      'travel_crib',
      'bathtub',
      'ocean_view',
      'mountain_view',
      'city_view',
      'lake_view'
    ]
  }],
  houseRules: {
    checkIn: {
      type: String,
      default: '15:00'
    },
    checkOut: {
      type: String,
      default: '11:00'
    },
    smoking: {
      type: Boolean,
      default: false
    },
    pets: {
      type: Boolean,
      default: false
    },
    parties: {
      type: Boolean,
      default: false
    },
    quietHours: {
      start: {
        type: String,
        default: '22:00'
      },
      end: {
        type: String,
        default: '08:00'
      }
    },
    additionalRules: [String]
  },
  availability: {
    calendar: [{
      date: {
        type: Date,
        required: true
      },
      available: {
        type: Boolean,
        default: true
      },
      price: Number // Optional custom price for specific dates
    }],
    minStay: {
      type: Number,
      default: 1,
      min: [1, 'Minimum stay must be at least 1 night']
    },
    maxStay: {
      type: Number,
      default: 365,
      max: [365, 'Maximum stay cannot exceed 365 nights']
    },
    instantBook: {
      type: Boolean,
      default: false
    }
  },
  ratings: {
    overall: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    cleanliness: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    accuracy: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    communication: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    location: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    checkIn: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    value: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'suspended'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
placeSchema.index({ location: '2dsphere' });
placeSchema.index({ owner: 1 });
placeSchema.index({ status: 1 });
placeSchema.index({ propertyType: 1 });
placeSchema.index({ price: 1 });
placeSchema.index({ 'ratings.overall': -1 });
placeSchema.index({ createdAt: -1 });
placeSchema.index({ featured: -1 });

// Text search index
placeSchema.index({
  title: 'text',
  description: 'text',
  address: 'text',
  'location.city': 'text',
  'location.country': 'text'
});

// Virtual for review count
placeSchema.virtual('reviewCount').get(function() {
  return this.reviews?.length || 0;
});

// Virtual for favorite count
placeSchema.virtual('favoriteCount').get(function() {
  return this.favorites?.length || 0;
});

// Virtual for booking count
placeSchema.virtual('bookingCount').get(function() {
  return this.bookings?.length || 0;
});

// Virtual for formatted price
placeSchema.virtual('formattedPrice').get(function() {
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$'
  };
  const symbol = currencySymbols[this.currency] || '$';
  return `${symbol}${this.price}`;
});

// Backward-compatible availability alias used by controllers
placeSchema.methods.checkAvailability = function(checkIn, checkOut) {
  return this.isAvailable(checkIn, checkOut);
};

// Calculate total price for a stay, including simple fees/taxes
// Returns: { nights, basePrice, subtotal, serviceFee, cleaningFee, taxes, total, currency }
placeSchema.methods.calculateTotalPrice = function(checkIn, checkOut, guests = 1) {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const msPerDay = 1000 * 60 * 60 * 24;
  const nights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / msPerDay));

  const basePrice = this.price || 0;
  const subtotal = basePrice * nights;

  // Simple fee model; adjust as needed
  const cleaningFee = 0; // Could be a field later
  const serviceFee = Math.round(subtotal * 0.12 * 100) / 100; // 12%
  const taxes = Math.round(subtotal * 0.15 * 100) / 100; // 15%

  const total = Math.round((subtotal + cleaningFee + serviceFee + taxes) * 100) / 100;

  return {
    nights,
    basePrice,
    subtotal,
    cleaningFee,
    serviceFee,
    taxes,
    total,
    currency: this.currency || 'USD'
  };
};

// Static method to find places by location
placeSchema.statics.findByLocation = function(longitude, latitude, radius = 10) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: radius * 1000 // Convert km to meters
      }
    },
    status: 'active'
  });
};

// Static method to search places
placeSchema.statics.searchPlaces = function(query, filters = {}) {
  const searchQuery = {
    status: 'active',
    ...filters
  };

  if (query) {
    searchQuery.$text = { $search: query };
  }

  return this.find(searchQuery);
};

// Method to check availability for date range
placeSchema.methods.isAvailable = function(checkIn, checkOut) {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Check if there are any bookings that overlap with the requested dates
  return this.populate('bookings').then(() => {
    return !this.bookings.some(booking => {
      const bookingCheckIn = new Date(booking.checkIn);
      const bookingCheckOut = new Date(booking.checkOut);
      
      return (checkInDate < bookingCheckOut && checkOutDate > bookingCheckIn);
    });
  });
};

// Method to update ratings
placeSchema.methods.updateRatings = function() {
  return this.populate('reviews').then(() => {
    if (this.reviews.length === 0) {
      this.ratings = {
        overall: 0,
        cleanliness: 0,
        accuracy: 0,
        communication: 0,
        location: 0,
        checkIn: 0,
        value: 0,
        count: 0
      };
      return this.save();
    }

    const totalReviews = this.reviews.length;
    const ratings = this.reviews.reduce((acc, review) => {
      acc.overall += review.ratings.overall;
      acc.cleanliness += review.ratings.cleanliness;
      acc.accuracy += review.ratings.accuracy;
      acc.communication += review.ratings.communication;
      acc.location += review.ratings.location;
      acc.checkIn += review.ratings.checkIn;
      acc.value += review.ratings.value;
      return acc;
    }, {
      overall: 0,
      cleanliness: 0,
      accuracy: 0,
      communication: 0,
      location: 0,
      checkIn: 0,
      value: 0
    });

    this.ratings = {
      overall: Math.round((ratings.overall / totalReviews) * 10) / 10,
      cleanliness: Math.round((ratings.cleanliness / totalReviews) * 10) / 10,
      accuracy: Math.round((ratings.accuracy / totalReviews) * 10) / 10,
      communication: Math.round((ratings.communication / totalReviews) * 10) / 10,
      location: Math.round((ratings.location / totalReviews) * 10) / 10,
      checkIn: Math.round((ratings.checkIn / totalReviews) * 10) / 10,
      value: Math.round((ratings.value / totalReviews) * 10) / 10,
      count: totalReviews
    };

    return this.save();
  });
};

const Place = mongoose.model('Place', placeSchema);

export default Place;
