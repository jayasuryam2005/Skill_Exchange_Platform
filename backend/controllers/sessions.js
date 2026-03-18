const Session = require('../models/Session');
const Request = require('../models/Request');

// @desc    Create session (After request acceptance)
// @route   POST /api/sessions
// @access  Private
exports.createSession = async (req, res, next) => {
  try {
    const { requestId, dateTime, details } = req.body;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    if (request.status !== 'accepted') {
      return res.status(400).json({ success: false, error: 'Request must be accepted before scheduling' });
    }

    // Check if user is part of the request
    if (request.sender.toString() !== req.user.id && request.receiver.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    const session = await Session.create({
      request: requestId,
      users: [request.sender, request.receiver],
      dateTime,
      details
    });

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user sessions (Upcoming/Completed)
// @route   GET /api/sessions
// @access  Private
exports.getSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({
      users: { $in: [req.user.id] }
    })
    .populate('users', 'name email')
    .populate({
      path: 'request',
      select: 'skillOffered skillWanted'
    })
    .sort('-dateTime');

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update session status (e.g. mark as completed)
// @route   PUT /api/sessions/:id
// @access  Private
exports.updateSession = async (req, res, next) => {
  try {
    const { status } = req.body;

    let session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    // Check if user is part of the session
    if (!session.users.includes(req.user.id)) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    session = await Session.findByIdAndUpdate(req.params.id, { status }, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (err) {
    next(err);
  }
};
