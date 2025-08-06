import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking is required']
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: [true, 'Place is required']
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewer is required']
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewee is required']
  },
  type: {
    type: String,
    enum: ['guest_to_host', 'host_to_guest'],
    required: [true, 'Review type is required']
  },
  ratings: {
    overall: {
      type: Number,
      required: [true, 'Overall rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    cleanliness: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    accuracy: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    communication: {
      type: Number,
      required: [true, 'Communication rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    location: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    checkIn: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    value: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    }
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [2000, 'Comment cannot exceed 2000 characters']
  },
  pros: [String],
  cons: [String],
  response: {
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Response cannot exceed 1000 characters']
    },
    createdAt: Date
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: true // Reviews from actual bookings are automatically verified
  },
  helpfulVotes: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  reportedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['inappropriate', 'spam', 'fake', 'offensive', 'other']
    },
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'hidden', 'flagged', 'removed'],
    default: 'active'
  },
  language: {
    type: String,
    default: 'en'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
reviewSchema.index({ place: 1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ booking: 1 });
reviewSchema.index({ type: 1 });
reviewSchema.index({ 'ratings.overall': -1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ status: 1 });

// Compound indexes
reviewSchema.index({ place: 1, status: 1, isPublic: 1 });
reviewSchema.index({ reviewer: 1, place: 1 });

// Ensure one review per booking per reviewer
reviewSchema.index({ booking: 1, reviewer: 1 }, { unique: true });

// Virtual for formatted date
reviewSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for relative date
reviewSchema.virtual('relativeDate').get(function() {
  const now = new Date();
  const reviewDate = this.createdAt;
  const diffTime = Math.abs(now - reviewDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }
  const years = Math.floor(diffDays / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
});

// Virtual for average rating (excluding overall)
reviewSchema.virtual('averageRating').get(function() {
  const ratings = [];
  if (this.ratings.cleanliness) ratings.push(this.ratings.cleanliness);
  if (this.ratings.accuracy) ratings.push(this.ratings.accuracy);
  if (this.ratings.communication) ratings.push(this.ratings.communication);
  if (this.ratings.location) ratings.push(this.ratings.location);
  if (this.ratings.checkIn) ratings.push(this.ratings.checkIn);
  if (this.ratings.value) ratings.push(this.ratings.value);
  
  if (ratings.length === 0) return this.ratings.overall;
  
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
});

// Virtual for is recent
reviewSchema.virtual('isRecent').get(function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return this.createdAt >= thirtyDaysAgo;
});

// Pre-save middleware to set default ratings for guest-to-host reviews
reviewSchema.pre('save', function(next) {
  if (this.type === 'guest_to_host') {
    // For guest reviews, set missing ratings to overall rating
    if (!this.ratings.cleanliness) this.ratings.cleanliness = this.ratings.overall;
    if (!this.ratings.accuracy) this.ratings.accuracy = this.ratings.overall;
    if (!this.ratings.location) this.ratings.location = this.ratings.overall;
    if (!this.ratings.checkIn) this.ratings.checkIn = this.ratings.overall;
    if (!this.ratings.value) this.ratings.value = this.ratings.overall;
  }
  next();
});

// Post-save middleware to update place ratings
reviewSchema.post('save', async function() {
  if (this.type === 'guest_to_host' && this.isPublic && this.status === 'active') {
    try {
      const Place = mongoose.model('Place');
      const place = await Place.findById(this.place);
      if (place) {
        await place.updateRatings();
      }
    } catch (error) {
      console.error('Error updating place ratings:', error);
    }
  }
});

// Post-remove middleware to update place ratings
reviewSchema.post('remove', async function() {
  if (this.type === 'guest_to_host') {
    try {
      const Place = mongoose.model('Place');
      const place = await Place.findById(this.place);
      if (place) {
        await place.updateRatings();
      }
    } catch (error) {
      console.error('Error updating place ratings after review removal:', error);
    }
  }
});

// Method to mark as helpful
reviewSchema.methods.markAsHelpful = function(userId) {
  if (!this.helpfulVotes.users.includes(userId)) {
    this.helpfulVotes.users.push(userId);
    this.helpfulVotes.count = this.helpfulVotes.users.length;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to unmark as helpful
reviewSchema.methods.unmarkAsHelpful = function(userId) {
  const index = this.helpfulVotes.users.indexOf(userId);
  if (index > -1) {
    this.helpfulVotes.users.splice(index, 1);
    this.helpfulVotes.count = this.helpfulVotes.users.length;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to add response
reviewSchema.methods.addResponse = function(comment) {
  this.response = {
    comment: comment,
    createdAt: new Date()
  };
  return this.save();
};

// Method to report review
reviewSchema.methods.reportReview = function(userId, reason) {
  const existingReport = this.reportedBy.find(report => 
    report.user.toString() === userId.toString()
  );
  
  if (!existingReport) {
    this.reportedBy.push({
      user: userId,
      reason: reason
    });
    
    // Auto-flag if reported by 3+ users
    if (this.reportedBy.length >= 3) {
      this.status = 'flagged';
    }
    
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Static method to get review statistics
reviewSchema.statics.getStats = function(placeId) {
  return this.aggregate([
    {
      $match: {
        place: mongoose.Types.ObjectId(placeId),
        type: 'guest_to_host',
        status: 'active',
        isPublic: true
      }
    },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageOverall: { $avg: '$ratings.overall' },
        averageCleanliness: { $avg: '$ratings.cleanliness' },
        averageAccuracy: { $avg: '$ratings.accuracy' },
        averageCommunication: { $avg: '$ratings.communication' },
        averageLocation: { $avg: '$ratings.location' },
        averageCheckIn: { $avg: '$ratings.checkIn' },
        averageValue: { $avg: '$ratings.value' },
        ratingDistribution: {
          $push: '$ratings.overall'
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalReviews: 1,
        averageOverall: { $round: ['$averageOverall', 1] },
        averageCleanliness: { $round: ['$averageCleanliness', 1] },
        averageAccuracy: { $round: ['$averageAccuracy', 1] },
        averageCommunication: { $round: ['$averageCommunication', 1] },
        averageLocation: { $round: ['$averageLocation', 1] },
        averageCheckIn: { $round: ['$averageCheckIn', 1] },
        averageValue: { $round: ['$averageValue', 1] },
        ratingDistribution: 1
      }
    }
  ]);
};

// Static method to find reviews for a place with pagination
reviewSchema.statics.findForPlace = function(placeId, page = 1, limit = 10, sort = '-createdAt') {
  const skip = (page - 1) * limit;
  
  return this.find({
    place: placeId,
    type: 'guest_to_host',
    status: 'active',
    isPublic: true
  })
  .populate('reviewer', 'name avatar')
  .sort(sort)
  .skip(skip)
  .limit(limit);
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;
