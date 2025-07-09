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
    db.run('INSERT INTO videos (title, uploaderId, fileName, reactedTo, description, views, dateOfUpload) VALUES (?, ?, ?, ?, ?, 0, datetime("now"))', [
        req.body.videoTitle,
        req.user.id,
        video.filename,
        reactedToFileName,
        req.body.description
    ]);
    // console.log(req.user.id);
    res.send('Video Upload Successful');
    // res.redirect('/videos/upload');
    
});

// page to watch a video, has the ability to donate to creator on this
router.get('/watch/:filename', (req, res) => {
    filename = req.params.filename
    // console.log(filename)


    // get all video data as well as data of user who uploaded the video
    db.get('SELECT videos.id as "videoId", videos.title as "title", videos.reactedTo as "reactedTo", videos.description as "description",\
         videos.views as "views", users.id as "userId", users.username as "username", users.walletAddress as "walletAddress"  \
         FROM videos \
         JOIN users ON videos.uploaderId = users.id \
         WHERE fileName = ?', [ filename ], (requ, row) => {
        // console.log('row 0', row)


        // if there are no rows for the video asked for (this is if people try to search the video by url)
        if (!row) {
            console.log("entered this hoie")
            res.redirect('/')
        } else {

        let title = row.title;
        let username = row.username;
        let walletAddress = row.walletAddress;
        let reactedTo = row.reactedTo;
        let description = row.description;

        // plus 1 as the database updates afterwards
        let views = row.views + 1;

        let subbed;
 


        // if the user is authenticated
        if (req.isAuthenticated()){
            db.get('SELECT * FROM subscribed WHERE subscriberId = ? and subscribedToId = ?', [req.user.id, row.userId], (requ, subRow) => {
                
                console.log('checking subrow here',subRow)
                if(subRow) {
                    subbed = true;
                } else {
                    subbed = false;
                }
                
                // if the video is a react video
                if (reactedTo === ''){
                    let walletAddresses = [walletAddress];
                    db.run('UPDATE videos SET views = views + 1 WHERE id = ?',[row.videoId]);
                    console.log(subbed)
                    res.render('videos/video', {title: title, creatorUsername: username, walletAddresses: walletAddresses,
                                filename: filename, viewerWalletAddress: req.user.walletAddress, description: description, views: views, subbed: subbed, user: [row]});

                } 
                // if the video is not a react video
                else {
                    // if the person reacted to a video in their video get the reacted to video creators wallet address as well
                    db.get('SELECT * FROM users JOIN videos ON users.id = videos.uploaderId WHERE fileName = ?', [ reactedTo ], (requ, row) => {

                        let walletAddresses = [walletAddress, row.walletAddress];
                        db.run('UPDATE videos SET views = views + 1 WHERE id = ?',[row.videoId]);
                        res.render('videos/video', {title: title, creatorUsername: username, walletAddresses: walletAddresses,
                        filename: filename, viewerWalletAddress: req.user.walletAddress, views: views, subbed: subbed, user: [row]});
                    
                    })
                }
            })
        } 
        
        // if the user is not logged in
        else {
            // user cannot be subbed to anyone if they are not logged in
            subbed = false;

            // if the video is not a react video
            if (reactedTo === ''){
                let walletAddresses = [walletAddress];
                console.log('row.di wodohsdflajdlajd', row.videoId)
                db.run('UPDATE videos SET views = views + 1 WHERE id = ?',[row.videoId]);                res.render('videos/video', {title: title, creatorUsername: username, walletAddresses: walletAddresses,
                    filename: filename, description: description, views: views});
            } 
            // if the video is not a react video
            else {
                // if the person reacted to a video in their video get the reacted to video creators wallet address as well
                db.get('SELECT * FROM users JOIN videos ON users.id = videos.uploaderId WHERE fileName = ?', [ reactedTo ], (requ, row) => {

                    let walletAddresses = [walletAddress, row.walletAddress];
                db.run('UPDATE videos SET views = views + 1 WHERE id = ?',[row.videoId]);                    res.render('videos/video', {title: title, creatorUsername: username, walletAddresses: walletAddresses,
                    filename: filename, views: views});
                
                })
            }
        }
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

// router to remove form
router.delete('/watch/:filename/removeDonateForm', (req, res) => {
    res.send('')
})


module.exports = router;