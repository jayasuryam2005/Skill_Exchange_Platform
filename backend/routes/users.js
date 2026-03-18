const express = require('express');
const { updateProfile, getUser, getUsers } = require('../controllers/users');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/', getUsers);
router.put('/profile', protect, updateProfile);  // MUST be before /:id
router.get('/:id', getUser);

module.exports = router;
