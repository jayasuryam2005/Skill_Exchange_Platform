const User = require('../models/User');

// @desc    Match users (Find users whose skillsOffered match current user's skillsWanted)
// @route   GET /api/matches
// @access  Private
exports.getMatches = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.skillsWanted || user.skillsWanted.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    // Find users who offer what I want, excluding myself
    const matches = await User.find({
      _id: { $ne: req.user.id },
      skillsOffered: { $in: user.skillsWanted }
    });

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search and filter users
// @route   GET /api/matches/search
// @access  Public
exports.searchUsers = async (req, res, next) => {
  try {
    const { skill, rating } = req.query;
    let query = {};

    if (skill) {
      query.$or = [
        { skillsOffered: { $regex: skill, $options: 'i' } },
        { skillsWanted: { $regex: skill, $options: 'i' } }
      ];
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    const users = await User.find(query);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};
