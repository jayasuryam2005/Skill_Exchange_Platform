const express = require('express');
const {
  getNotifications,
  markAsRead
} = require('../controllers/notifications');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getNotifications);

router.route('/:id')
  .put(markAsRead);

module.exports = router;
