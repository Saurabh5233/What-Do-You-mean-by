const mongoose = require('mongoose');

const SavedWordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  word: {
    type: String,
    required: true,
  },
  synonyms: {
    type: String,
  },
  meaning: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// To prevent a user from saving the same word multiple times
SavedWordSchema.index({ user: 1, word: 1 }, { unique: true });

module.exports = mongoose.model('SavedWord', SavedWordSchema);
