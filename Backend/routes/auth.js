const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { protect } = require('../middlewares/authMiddleware');

const {login, register, logout, googleCallback, getMe, loginWithGoogleToken}  =  require('../controllers/authController');


router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/me', protect, getMe);

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.post('/google', loginWithGoogleToken); // for mobiles
router.get('/google/callback', passport.authenticate('google', {failureRedirect:'/login'}), googleCallback);

module.exports = router;