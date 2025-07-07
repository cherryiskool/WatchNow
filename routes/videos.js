const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const flash = require('express-flash');

// runs the db file which creates the database
const db = require('../models/db');

// this is used to determine twhere the file is to be stored,
// additionally it also determines the naming scheme for the file - in this case being the date 
// (the path.extname makes sure the extension is the same)
const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/videos')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: videoStorage});

// for now videos just shares all the videos on the server
router.get('/', (req, res) => {
    fs.readdir('./public/videos', (err, files) => {
        console.log(files);
        res.render('videos/', { files });
    })

});


router.get('/upload', (req, res) => {
    if (req.isAuthenticated() == false) {
        res.redirect('/login')
    } else {
        res.render('videos/upload');
    }

});

router.post('/upload', upload.single('video'), (req, res) => {
    let video = req.file;
    // console.log("Attempt to log video", video);

    let indexOfUrl = req.body.reactedTo.indexOf("watch/");
    // console.log('hopefully file name', req.body.reactedTo.slice(indexOfUrl + 6));
    let reactedToFileName = req.body.reactedTo.slice(indexOfUrl + 6);
    // put video details into database to query later
    db.run('INSERT INTO videos (title, uploaderId, fileName, reactedTo) VALUES (?, ?, ?, ?)', [
        req.body.videoTitle,
        req.user.id,
        video.filename,
        reactedToFileName
    ]);
    // console.log(req.user.id);
    res.send('Video Upload Successful');
    // res.redirect('/videos/upload');
});

// page to watch a video, has the ability to donate to creator on this
router.get('/watch/:filename', (req, res) => {
    filename = req.params.filename
    console.log(filename)
    // will cause a bug if user is not signed in - will update later
    // use the url to get all video data to populate video page, also needs to have hashedpassword removed for security later
    db.get('SELECT videos.id as "videoId", videos.title as "title", videos.reactedTo as "reactedTo", users.username as "username", users.walletAddress as "walletAddress"  FROM videos JOIN users ON videos.uploaderId = users.id WHERE fileName = ?', [ filename ], (requ, row) => {
        console.log('row 0', row)
        let title = row.title;
        let username = row.username;
        let walletAddress = row.walletAddress;
        let reactedTo = row.reactedTo;
        // console.log("reacted to",reactedTo);
        // console.log(req.user);
        // if the video is a react video or not essentially, row.walletAddress would return an error if not a react video
        if (reactedTo === ''){
            let walletAddresses = [walletAddress];
            res.render('videos/video', {title: title, creatorUsername: username, walletAddresses: walletAddresses,
                    filename: filename, viewerWalletAddress: req.user.walletAddress});
        } else {
            // if the person reacted to a video in their video get the reacted to video creators wallet address as well
            db.get('SELECT * FROM users JOIN videos ON users.id = videos.uploaderId WHERE fileName = ?', [ reactedTo ], (requ, row) => {

                let walletAddresses = [walletAddress, row.walletAddress];
                res.render('videos/video', {title: title, creatorUsername: username, walletAddresses: walletAddresses,
                filename: filename, viewerWalletAddress: req.user.walletAddress});
            
            })
        }

        
    })
    

})

// get request for donate form - not really a form but it opens a window to allow donations
router.get('/watch/:filename/donate', (req, res) => {
    filename = req.params.filename;
    if(req.isAuthenticated()) {
        db.get('SELECT videos.id as "videoId", videos.title as "title", videos.reactedTo as "reactedTo", users.username as "username", users.walletAddress as "walletAddress"  FROM videos JOIN users ON videos.uploaderId = users.id WHERE fileName = ?', [ filename ], (requ, row) => {
                let title = row.title;
        let username = row.username;
        let walletAddress = row.walletAddress;
        let reactedTo = row.reactedTo;
        walletAddresses = [walletAddress]
            res.render("partials/donateForm",{title: title, creatorUsername: username, walletAddresses: walletAddresses,
                    filename: filename, viewerWalletAddress: req.user.walletAddress, layout:false})
        
        })


    } else {
        // here I have to send alerts for login/register error
    }
})

router.delete('/watch/:filename/removeDonateForm', (req, res) => {
    res.send('')
})


module.exports = router;