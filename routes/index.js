const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../models/db');

homeController = require('../controllers/homeController');

router.get('/', homeController.getHomePage
//     (req, res) => {
//     let popularVideos;
//     let subbedVideos;
//     let newestVideos;



//     db.all('SELECT * FROM videos ORDER BY views DESC', (requ, video) => {
//         // console.log(video[0])
//         popularVideos = video;
//         console.log('popular vidoes before it was cool', popularVideos)

//             db.all('SELECT * FROM videos JOIN subscribed ON videos.uploaderId = subscribed.subscribedToId WHERE subscribed.subscriberId = ? ORDER BY views DESC', [ req.user.id ], (requ, video) => {
//             // console.log(video[0])
//                 subbedVideos = video;
//                 db.all('SELECT * FROM videos ORDER BY dateOfUpload DESC', (requ, video) => {
//                     // console.log(video[0])
//                     newestVideos = video;
//                     res.render('index', {popularVideos: popularVideos, newestVideos: newestVideos, subbedVideos: subbedVideos})
//     })
//     })
//     })
// }
);

module.exports = router