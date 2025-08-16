const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { protect } = require('../middlewares/authMiddleware');

const {login, register, logout, googleCallback, getMe}  =  require('../controllers/authController');


router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/me', protect, getMe);

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/google/callback', passport.authenticate('google', {failureRedirect:'/login'}), googleCallback);


module.exports = router;