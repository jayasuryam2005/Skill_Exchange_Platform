const express = require('express');
const {
  addReview,
  getUserReviews
} = require('../controllers/reviews');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', protect, addReview);
router.get('/user/:userId', getUserReviews);

module.exports = router;
