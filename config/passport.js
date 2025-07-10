db = require('../models/db');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// here we will define the authentication
passport.use(new LocalStrategy({usernameField: 'email'}, function verify(email, password, cb) {
  // get the user by its email (async function needed for bcrypt - password encryption)
  db.get('SELECT * FROM users WHERE email = ?', [ email ], async function(err, row) {
    // console.log(row.email);
    // some sort of error (could be the database doesnt connect or something)
    if (err) {
      return cb(err);
    }
    // no email match 
    if (!row) {
      console.log(row);
      // cb is a function defined by passport that tells it the result of authentication
      return cb(null, false, { message: 'Incorrect Details'});
    }

    // check passwords
    try {
      if (await bcrypt.compare(password, row.hashedPassword)) {
        // cb success returns user
        console.log('correct');
        return cb(null, row);

      } else {
        // cb failure returns false and a message
        console.log('incorrect');
        return cb(null, false, { message: 'Incorrect Password'});
      }
    } catch (err) {
        return cb(err)
    }
  });
}));

passport.serializeUser(function(user, cb) {
  cb(null, {id: user.id})
});

// function that uses the id from serialize user to get the user object
// allows me to call req.user.walletAddress etc.
passport.deserializeUser(function(id, cb) {
  // console.log(id);
  db.get('SELECT * FROM users WHERE id = ?', [ id.id ], function(err, user) {
    if (err) {
      return cb(err);
    }
    // this had to be added in case deserialisation fails (the else statement specifically)
    if (user) {
      return cb(null, user);
    } else {
      return cb(null, false);
    }

  })
});

module.exports = passport