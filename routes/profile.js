const express = require('express');
const router = express.Router();
const db = require('../models/db');
const profileController = require('../controllers/profileController');
const { upload } = require('../config/pfpBanner');

// this gets the current users profile
router.get('/myprofile/:username', profileController.getOwnProfile);

//will change this to update later
router.post('/myprofile/:username', upload.fields([
  {name: 'pfp', maxCount : 1},
  {name:'banner', maxCount : 1}]),
  profileController.updateProfile)

// route to subscribe
router.post('/subscribe/:username', profileController.subscribe)


// route to unsub
router.post('/unsubscribe/:username', profileController.unsubscribe)

// allows user to view a channels page, for now this only shows their videos
router.get('/viewprofile/:username', profileController.getForeignProfile)

// get request for form
router.get('/myprofile/:username/edit', profileController.getEditForm)

// delete request for form
router.delete('/myprofile/:username/removeForm', profileController.removeEditForm)
module.exports = router;