const express = require('express');
const router = express.Router();
const { sendFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, sendFeedback);

module.exports = router;
