const express = require('express');
const {
  sendRequest,
  respondToRequest,
  getSentRequests,
  getReceivedRequests
} = require('../controllers/requests');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', sendRequest);
router.put('/:id', respondToRequest);
router.get('/sent', getSentRequests);
router.get('/received', getReceivedRequests);

module.exports = router;
