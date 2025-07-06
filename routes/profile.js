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
  res.render('profile/index', req.user);
});

//will change this to update later
router.post('/myprofile/:username', upload.fields([
  {name: 'pfp', maxCount : 1},
  {name:'banner', maxCount : 1}]),

  (req, res) => {
  
    console.log('req for the profile edit', req.files.pfp[0])

    walletAddress = req.body.walletAddress;
    pfpFileName = req.files.pfp[0].filename;
    bannerFileName = req.files.banner[0].filename;
    bio = req.body.bio
  
    db.run('UPDATE users SET walletAddress = ?, bio = ?, banner = ?, pfp = ? WHERE id = ?', [
      walletAddress,
      bio,
      bannerFileName,
      pfpFileName,
      req.user.id
    ]);

  res.redirect('/')
  // req.flash('Wallet updated to', walletAddress, 'successfully');

})

// allows user to view a channels page, for now this only shows their videos
router.get('/viewprofile/:username', (req, res) => {
  username = req.params.username;
  db.all('SELECT * FROM users JOIN videos ON users.id = videos.uploaderId WHERE users.username = ?',[
    username
  ], (req, row) => {
    // send basically all user info to the page, will remove sending the hashed password though for obvious security reasons
    res.render('/profile/foreignProfile', {row: row});
  })

})

router.get('/myprofile/:username/edit', (req, res) => {
  res.render("partials/editProfileForm", {layout: false})
})


router.delete('/myprofile/:username/removeForm', (req, res) => {
  res.send('');
})
module.exports = router;