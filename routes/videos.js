const express = require('express');
// const multer = require('multer');
const router = express.Router();
// const path = require('path');
const fs = require('fs');
const flash = require('express-flash');

const upload = require('../config/video')

// runs the db file which creates the database
const db = require('../models/db');
videoController = require('../controllers/videoController');

// for now videos just shares all the videos on the server
router.get('/', 
    (req, res) => {
    fs.readdir('./public/videos', (err, files) => {
        res.render('videos/', { files });
    })

});

// gets page for video upload
router.get('/upload', videoController.getUploadPage)

// video upload router
router.post('/upload', upload.single('video'), videoController.uploadVideo);

// page to watch a video, has the ability to donate to creator on this
router.get('/watch/:filename', videoController.watchVideo)

// get request for donate form - not really a form but it opens a window to allow donations
router.get('/watch/:filename/donate', videoController.getDonationForm)

// router to remove form
router.delete('/watch/:filename/removeDonateForm', videoController.removeDonationForm)

// gets the entire reacted to form
router.get('/upload/reactedToInputForm', videoController.getReactedToInputForm)
// reverts the entire reacted to form
router.delete('/upload/reactedToInputForm', videoController.revertReactedToInputForm)
// adds another input for multiple reacts
router.get('/upload/reactedToInput', videoController.getReactedToInput)
// removes an input from the form
router.delete('/upload/reactedToInput', videoController.deleteReactedToInput)

// gets the contract address of related video
router.get('/upload/reactedToContractAddress/:filename', videoController.getContractAddressOfVideo)

router.post('/upload/reactedToContractAddress/:filename/:contractAddress', videoController.setContractAddressOfVideo)

module.exports = router;