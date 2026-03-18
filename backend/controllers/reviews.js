const Review = require('../models/Review');
const Session = require('../models/Session');

// @desc    Add review for a session
// @route   POST /api/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const { sessionId, revieweeId, rating, comment } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    // Check if session is completed
    if (session.status !== 'completed') {
      return res.status(400).json({ success: false, error: 'Cannot review an incomplete session' });
    }

    // Check if user was part of the session
    if (!session.users.includes(req.user.id)) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    const review = await Review.create({
      session: sessionId,
      reviewer: req.user.id,
      reviewee: revieweeId,
      rating,
      comment
    });

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId }).populate('reviewer', 'name');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
};
