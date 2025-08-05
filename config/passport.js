db = require('../models/db');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// here we will define the authentication
passport.use(new LocalStrategy({usernameField: 'email'}, async function verify(email, password, cb) {
  // get the user by its email (async function needed for bcrypt - password encryption)
  try {
  [row] = await db.query('SELECT * FROM users WHERE email = ?', [ email ])
    // some sort of error (could be the database doesnt connect or something)
    console.log(row[0]);
    // no email match 
    if (!row[0]) {
      console.log(row[0]);
      // cb is a function defined by passport that tells it the result of authentication
      return cb(null, false, { message: 'Incorrect Details'});
    }

    // check passwords

      if (await bcrypt.compare(password, row[0].hashedPassword)) {
        // cb success returns user
        console.log('correct');
        return cb(null, row[0]);

      } else {
        // cb failure returns false and a message
        console.log('incorrect');
        return cb(null, false, { message: 'Incorrect Details'});
      }
    } catch (err) {
        return cb(err)
    }
}));

passport.serializeUser(function(user, cb) {
  cb(null, {id: user.id})
});

// function that uses the id from serialize user to get the user object
// allows me to call req.user.walletAddress etc.
passport.deserializeUser(async function(id, cb) {
  // console.log(id);
  [user] = await db.query('SELECT * FROM users WHERE id = ?', [ id.id ])

  try {
    if (user[0]) {
      return cb(null, user[0]);
    } 
    // this had to be added in case deserialisation fails (the else statement specifically)
    else {
      return cb(null, false);
    }
  } catch (err) {

    return cb(err);

  }




});

module.exports = passport