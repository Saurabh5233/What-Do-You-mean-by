const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  word: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// To prevent duplicate history entries for the same user and word
HistorySchema.index({ user: 1, word: 1 }, { unique: true });

module.exports = mongoose.model('History', HistorySchema);
