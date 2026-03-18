const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc    Get user conversations
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user.id] }
    })
    .populate('participants', 'name profileImage')
    .sort('-updatedAt');

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Start or get a conversation with a specific user
// @route   POST /api/chat/conversations
// @access  Private
exports.startConversation = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    // Find existing conversation between these two users
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, userId], $size: 2 }
    }).populate('participants', 'name profileImage');

    // Create new conversation if none found
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, userId]
      });
      conversation = await Conversation.findById(conversation._id).populate('participants', 'name profileImage');
    }

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get message history for a conversation
// @route   GET /api/chat/messages/:conversationId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversation: req.params.conversationId
    })
    .populate('sender', 'name')
    .sort('createdAt');

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Send a message (Create conversation if not exists)
// @route   POST /api/chat/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, text } = req.body;

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, receiverId]
      });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user.id,
      text
    });

    // Update conversation last message
    conversation.lastMessage = text;
    conversation.updatedAt = Date.now();
    await conversation.save();

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (err) {
    next(err);
  }
};
