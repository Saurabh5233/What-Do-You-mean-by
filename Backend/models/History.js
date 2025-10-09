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
    trim: true,
  },
  date: { // <--- ADD THIS FIELD
    type: Date,
    default: Date.now, // Set a default value for new entries
  }
}, {
  // `timestamps: true` will add `createdAt` and `updatedAt` fields.
  // `createdAt` can represent the first time a word was searched.
  // `updatedAt` can be used to track the most recent search time for sorting.
  timestamps: true
});

// To prevent duplicate history entries for the same user and word
// The unique index prevents duplicate history entries for the same user and word.
// To update the search date when a user searches for the same word again (a common UX pattern),
// the controller responsible for saving history should use an `upsert` operation.
// Using `findOneAndUpdate` will automatically update the `updatedAt` timestamp.
// Example: `History.findOneAndUpdate({ user: userId, word }, {}, { upsert: true });`
HistorySchema.index({ user: 1, word: 1 }, { unique: true });

module.exports = mongoose.model('History', HistorySchema);
