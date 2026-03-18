const Request = require('../models/Request');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Send skill exchange request
// @route   POST /api/requests
// @access  Private
exports.sendRequest = async (req, res, next) => {
  try {
    const { receiver, skillOffered, skillWanted, message } = req.body;

    // Check if receiver exists
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({ success: false, error: 'Receiver user not found' });
    }

    const request = await Request.create({
      sender: req.user.id,
      receiver,
      skillOffered,
      skillWanted,
      message
    });

    // Create notification for receiver
    await Notification.create({
      user: receiver,
      sender: req.user.id,
      type: 'request_received',
      message: `${req.user.name} sent you a skill exchange request.`
    });

    res.status(201).json({
      success: true,
      data: request
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Respond to request (Accept/Reject)
// @route   PUT /api/requests/:id
// @access  Private
exports.respondToRequest = async (req, res, next) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    let request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    // Make sure user is the receiver
    if (request.receiver.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    request = await Request.findByIdAndUpdate(req.params.id, { status }, {
      new: true,
      runValidators: true
    });

    // Create notification for sender
    await Notification.create({
      user: request.sender,
      sender: req.user.id,
      type: status === 'accepted' ? 'request_accepted' : 'request_rejected',
      message: `${req.user.name} ${status} your skill exchange request.`
    });

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get sent requests
// @route   GET /api/requests/sent
// @access  Private
exports.getSentRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ sender: req.user.id }).populate('receiver', 'name email');
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get received requests
// @route   GET /api/requests/received
// @access  Private
exports.getReceivedRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ receiver: req.user.id }).populate('sender', 'name email');
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    next(err);
  }
};
