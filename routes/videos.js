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
// this is used to determine twhere the file is to be stored,
// additionally it also determines the naming scheme for the file - in this case being the date 
// (the path.extname makes sure the extension is the same)
// const videoStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './public/videos')
//     },
//     filename: (req, file, cb) => {
//         console.log(file);
//         cb(null, Date.now() + path.extname(file.originalname))
//     }
// })

// const upload = multer({storage: videoStorage});

// for now videos just shares all the videos on the server
router.get('/', 
    (req, res) => {
    fs.readdir('./public/videos', (err, files) => {
        res.render('videos/', { files });
    })

});

router.get('/upload', videoController.getUploadPage)

router.post('/upload', upload.single('video'), videoController.uploadVideo);

// page to watch a video, has the ability to donate to creator on this
router.get('/watch/:filename', videoController.watchVideo)

// get request for donate form - not really a form but it opens a window to allow donations
router.get('/watch/:filename/donate', videoController.getDonationForm)

// router to remove form
router.delete('/watch/:filename/removeDonateForm', videoController.removeDonationForm)

module.exports = router;