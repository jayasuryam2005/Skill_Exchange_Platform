const express = require('express');
const {
  createSession,
  getSessions,
  updateSession
} = require('../controllers/sessions');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(createSession)
  .get(getSessions);

router.route('/:id')
  .put(updateSession);

module.exports = router;
