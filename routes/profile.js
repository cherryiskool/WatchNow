const express = require('express');
const router = express.Router();
const db = require('../models/db');
const multer = require('multer');
const path = require('path')

// sets up storage for profile picture and banner
const storage = multer.diskStorage({
    destination: (req, file, cb) => {

      console.log(file.fieldname)

      if (file.fieldname === 'pfp') { 
        console.log('suo')
        cb(null, './public/profilePictures')
      } 
      else if (file.fieldname === 'banner') {
        cb(null, './public/banners')
      }

    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage});


// this gets the current users profile
router.get('/myprofile/:username', (req, res) => {

    if (req.isAuthenticated()) {
      // has to be left join in the case that the user has no videos
      db.all('SELECT users.id as "userId", users.username as "username", users.walletAddress as "walletAddress", users.bio as "bio", users.banner as "banner", users.pfp as "pfp", videos.id as "videoID", videos.title as "title", videos.filename as "filename" FROM users LEFT JOIN videos ON users.id = videos.uploaderId WHERE users.id = ?',[ req.user.id ], (err, user) => {
        
        console.log('user user user',user[0]);
        
        if (user[0].username === req.params.username) {
          console.log('req.user check meme',req.user)
          res.render('profile/index', {user: user});
          
        } else {
          res.redirect('/')
        }
      })
  } else {
    res.redirect('/login/');
  }
  // res.render('profile/index', req.user);
});

//will change this to update later
router.post('/myprofile/:username', upload.fields([
  {name: 'pfp', maxCount : 1},
  {name:'banner', maxCount : 1}]),

  (req, res) => {
  
    // console.log('req for the profile edit', req.files[0].pfp)

    let bannerFileName;
    let pfpFileName;
    // there may be a better way to do this
    // this makes sure not to set user details as empty if they did not want to change anything
    walletAddress = req.body.walletAddress;

    // if the file upload is empty then set the new pfp to be the old one
    if(!req.files.pfp) {
      pfpFileName = req.user.pfp;
    } else {
      pfpFileName = req.files.pfp[0].filename
    }
    // same as above
    if (!req.files.banner) {
      bannerFileName = req.user.banner;
    } else {
      bannerFileName = req.files.banner[0].filename
    }
    bio = req.body.bio
    
    console.log('pfpFilename', pfpFileName);
    console.log('bannerFilename', bannerFileName);

    console.log('bannerrrrrrrrrrrrrrr', req.files.banner)
    db.run('UPDATE users SET walletAddress = ?, bio = ?, banner = ?, pfp = ? WHERE id = ?', [
      walletAddress,
      bio,
      bannerFileName,
      pfpFileName,
      req.user.id
    ]);

  res.redirect(`/myprofile/${req.user.username}`)
  // req.flash('Wallet updated to', walletAddress, 'successfully');

})

// route to subscribe
router.post('/subscribe/:username', (req, res) => {
  backURL = req.header('Referer') || '/'
  if (req.isAuthenticated()) {
    subscribedTo = req.params.username;
    console.log('subsub', subscribedTo)
    // get the id of the user that the protagonist wants to subscribe to
    db.get('SELECT * FROM users WHERE username = ?', [ subscribedTo ], (requ, row) => {
      // set that they are subscribed only if it does not violate the necessity for both values to be unique as stated in db.js
      db.run('INSERT OR IGNORE INTO subscribed (subscriberId, subscribedToId) VALUES (?, ?)',[req.user.id, row.id])
      
      // console.log('subsubsub', req.user.id, row.id)
      
      res.redirect(backURL)
    })
  } 
// need to display error message if they are not subscribed
  else {

  }
})


// route to unsub
router.post('/unsubscribe/:username', (req, res) => {
  backURL = req.header('Referer') || '/'
  if (req.isAuthenticated()) {
    subscribedTo = req.params.username;
    db.get('SELECT * FROM users WHERE username = ?', [ subscribedTo ], (requ, row) => {
      db.run('DELETE FROM subscribed WHERE subscriberId = ? and subscribedToId = ?', [req.user.id, row.id])

      res.redirect(backURL)

    })
  }
  // need to send an error to say they need to be logged in
  else {

  }

})

// allows user to view a channels page, for now this only shows their videos
router.get('/viewprofile/:username', (req, res) => {
  username = req.params.username;

  // get all rows (same user but all their videos) from user ':username'
  db.all('SELECT * FROM users JOIN videos ON users.id = videos.uploaderId WHERE users.username = ?',[
    username
  ], (requ, row) => {

    // get a row from subscribed based on the current user and profile user
    // this is to check if the protagonist user is subscribed
    db.get('SELECT * FROM subscribed WHERE subscriberId = ? and subscribedToId = ?', [req.user.id, row[0].id], (requ, subRow) => {
      
      // console.log('checking id match',req.user.id, row.id)
      let subbed;
      // console.log("subrowsubrow")

      // if this row exists it must mean that the user is subscribed
      if (subRow) {
        console.log('subrow exists!')

        // return orignal row of the profile user details as well as all their videos
        // return subbed to be false (protagonist user is  subscribed to profile user)
        res.render('profile/foreignProfile', {user: row, subbed: true});
      } 
      
      // if the row does not exist then the user is not subscribed
      else {
        // console.log('subrow does not exist!')
        // return orignal row of the profile user details as well as all their videos
        // return subbed to be false (protagonist user is  subscribed to profile user)
        res.render('profile/foreignProfile', {user: row, subbed: false});
      }

    })
    // send basically all user info to the page, will remove sending the hashed password though for obvious security reasons

  })

})

// get request for form
router.get('/myprofile/:username/edit', (req, res) => {
  if (req.isAuthenticated()) {
    db.get('SELECT * FROM users WHERE id = ?',[ req.user.id ], (err, user) => {
      if (user.username === req.params.username) {
        res.render("partials/editProfileForm", {layout: false, user: req.user});
      } else {
        res.redirect('/')
      }
    })
  } else {
    res.redirect('/login/');
  }
  // res.render("partials/editProfileForm", {layout: false})
})

// delete request for form
router.delete('/myprofile/:username/removeForm', (req, res) => {
    if (req.isAuthenticated()) {
    db.get('SELECT * FROM users WHERE id = ?',[ req.user.id ], (err, user) => {
      if (user.username === req.params.username) {
          res.send('');
      } else {
        res.redirect('/')
      }
    })
  } else {
    res.redirect('/login/');
  }
  // res.send('');
})
module.exports = router;