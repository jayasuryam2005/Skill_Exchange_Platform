const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.ObjectId,
    ref: 'Request',
    required: true
  },
  users: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }],
  dateTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  details: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Session', SessionSchema);
