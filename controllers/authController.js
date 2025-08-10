const authModel = require('../models/authModel');

exports.getLoginPage = (req, res) => {
  // if user is logged in then redirect to home page
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('authentication/login/index', {pageTitle: 'Login to WatchNow'});
  }
}

exports.getRegisterPage = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('authentication/register/index', {pageTitle: 'Register to WatchNow'})
  }
}

exports.registerUser = async (req, res) => {
    try {
      await authModel.registerUserToDB(req.body.username, req.body.email, req.body.password);
      res.redirect('/login');
    } catch (err) {
        req.flash('error', 'User Details Taken');
        res.redirect('/register');
  }
}

exports.logOut = (req, res) => {
    req.logout(function(err) {
    res.redirect('/');
  })
}

exports.getSessionUserUsername = (req, res) => {
  try {
    if(req.isAuthenticated()) {
      console.log('userid memey', req.user.username)
      res.json({success: true, channelName: req.user.username});
    } else {
      res.status(404).json({success: false, error: 'Error getting session user'});
    }
  } catch (err) {
    res.status(500).json({success: false, error: 'Server error'})
  }

}