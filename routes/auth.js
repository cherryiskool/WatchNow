const express = require('express');

// library for creating passports (session remembers user etc)
const passport = require('passport');
// allows us to define authentication
const LocalStrategy = require('passport-local').Strategy;
// encrypting the passports
const bcrypt = require('bcrypt');

// runs the db file which creates the database
const db = require('../models/db');//

const router = express.Router();

// here we will define the authentication
passport.use(new LocalStrategy({usernameField: 'email'}, function verify(email, password, cb) {
  console.log("hi")
  // get the user by its email (async function needed for bcrypt - password encryption)
  db.get('SELECT * FROM users WHERE email = ?', [ email ], async function(err, row) {
    console.log(email);
    // console.log(row.email);
    // some sort of error (could be the database doesnt connect or something)
    if (err) {
      console.log(err);
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
        console.log(row.hashedPassword);
        console.log('incorrect');
        return cb(null, false, { message: 'Incorrect Password'});
      }
    } catch (err) {
        return cb(err)
    }
  });
}));

// function that is called when a login occurs, i told it to just store the user id in the session
passport.serializeUser(function(user, cb) {
  cb(null, {id: user.id})
});

// function that uses the id from serialize user to get the user object
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

router.get('/login', (req, res) => {
  console.log('login', req.user)
  // if user is logged in then redirect to home page
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('authentication/login/index');
  }

});

// if the login attempt is successful then go home, if not stay on login
// will update with error message display
router.post('/login/attempt', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.get('/register', (req, res) => {

  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('authentication/register/index')
  }

   
});

router.post('/register/attempt', async (req, res) => {
  // insert registration details into database (hash the password as well)
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    db.run('INSERT INTO users (username, email, hashedPassword) VALUES (?, ?, ?)', [
      req.body.username,
      req.body.email,
      hashedPassword
    ], () => {
      const user = {id: this.lastID}
    })
    console.log(hashedPassword);
    res.redirect('/login');
  } catch (err) {
    res.redirect('/register');
  }
})

// this logs the user out
router.post('/logout', (req, res) => {
  req.logout(function(err) {
    res.redirect('/');
  })
});

// this gets the current users profile
router.get('/myprofile/:username', (req, res) => {
  res.render('authentication/profile');
});

//will change this to update later
router.post('/myprofile/:username', (req, res) => {
  walletAddress = req.body.walletAddress;
  db.run('UPDATE users SET walletAddress = ? WHERE id = ?', [
    walletAddress,
    req.user.id
  ]);
  // req.flash('Wallet updated to', walletAddress, 'successfully');
  res.redirect('/')
})

router.get('/viewprofile/:username', (req, res) => {
  username = req.params.username;
  db.all('SELECT * FROM users JOIN videos ON users.id = videos.uploaderId WHERE users.username = ?',[
    username
  ], (req, row) => {
    console.log('yup',row);
    res.render('authentication/profile/foreignProfile', {row: row});
  })

})


module.exports = router;