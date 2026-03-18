const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.ObjectId,
    ref: 'Session',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from submitting more than one review per session
ReviewSchema.index({ session: 1, reviewer: 1 }, { unique: true });

// Static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function(userId) {
  const obj = await this.aggregate([
    {
      $match: { reviewee: userId }
    },
    {
      $group: {
        _id: '$reviewee',
        averageRating: { $avg: '$rating' },
        numReviews: { $count: {} }
      }
    }
  ]);

  try {
    if (obj[0]) {
      await this.model('User').findByIdAndUpdate(userId, {
        rating: obj[0].averageRating.toFixed(1),
        numReviews: obj[0].numReviews
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.reviewee);
});

module.exports = mongoose.model('Review', ReviewSchema);
