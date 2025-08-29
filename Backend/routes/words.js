const express = require('express');
const router = express.Router();
const {
  getSavedWords,
  saveWord,
  deleteSavedWords,
  getHistory,
  saveHistory,
  deleteHistoryItems,
} = require('../controllers/wordController');
const { protect } = require('../middlewares/authMiddleware');

// @route   GET api/words/saved
// @desc    Get all saved words for a user
// @access  Private
router.get('/saved', protect, getSavedWords);

// @route   POST api/words/saved
// @desc    Save a word
// @access  Private
router.post('/saved', protect, saveWord);

// @route   DELETE api/words/saved
// @desc    Delete saved words
// @access  Private
router.delete('/saved', protect, deleteSavedWords);

// @route   GET api/words/history
// @desc    Get all history for a user
// @access  Private
router.get('/history', protect, getHistory);

// @route   POST api/words/history
// @desc    Save a history entry
// @access  Private
router.post('/history', protect, saveHistory);

// @route   DELETE api/words/history
// @desc    Delete history items
// @access  Private
router.delete('/history', protect, deleteHistoryItems);

module.exports = router;