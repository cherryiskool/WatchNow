const express = require('express');

// library for creating passports (session remembers user etc)
const passport = require('passport');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/login', authController.getLoginPage);

// if the login attempt is successful then go home, if not stay on login
router.post('/login/attempt', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/register', authController.getRegisterPage);

router.post('/register/attempt', authController.registerUser)

// this logs the user out
router.post('/logout', authController.logOut);

router.get('/getSessionUsername', authController.getSessionUserUsername);


module.exports = router;