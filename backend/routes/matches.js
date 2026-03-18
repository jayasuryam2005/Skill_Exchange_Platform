const express = require('express');
const { getMatches, searchUsers } = require('../controllers/matches');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/', protect, getMatches);
router.get('/search', searchUsers);

module.exports = router;
