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
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/videos')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage});

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
    const video = req.file;
    console.log("Attempt to log video", video);
    db.run('INSERT INTO videos (title, uploaderId, fileName) VALUES (?, ?, ?)', [
        req.body.videoTitle,
        req.user.id,
        video.filename
    ]);
    res.send('Video Upload Successful');
    // res.redirect('/videos/upload');
});

router.get('/watch/:filename', (req, res) => {

    filename = req.params.filename
    console.log(filename);
    db.get('SELECT * FROM videos JOIN users ON videos.uploaderId = users.id WHERE fileName = ?', [ filename ], (req, row) => {
        console.log('row 0', row)
        title = row.title;
        username = row.username;
        walletAddress = row.walletAddress;
        
        res.render('videos/video', {title: title, creatorUsername: username, walletAddress: walletAddress, filename: filename});
    })
    

})

module.exports = router;