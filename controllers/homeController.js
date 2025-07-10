const homeModel = require('../models/homeModel')

// need to fix bug where logged out users cannot access page
exports.getHomePage = async (req, res) => {
    let popularVideos;
    let subbedVideos;
    let newestVideos;



    // db.all('SELECT * FROM videos ORDER BY views DESC', (requ, video) => {
        // console.log(video[0])
    popularVideos = await homeModel.getAllVideosViewOrder();
        // console.log('popular vidoes before it was cool', popularVideos)

            // db.all('SELECT * FROM videos JOIN subscribed ON videos.uploaderId = subscribed.subscribedToId WHERE subscribed.subscriberId = ? ORDER BY views DESC', [ req.user.id ], (requ, video) => {
            // console.log(video[0])
        
    subbedVideos = await homeModel.getUserSubscribedVideos(req.user.id);
                // db.all('SELECT * FROM videos ORDER BY dateOfUpload DESC', (requ, video) => {
                    // console.log(video[0])
    newestVideos = await homeModel.getNewestUploads();
    res.render('index', {popularVideos: popularVideos, newestVideos: newestVideos, subbedVideos: subbedVideos})
    // })
    // })
    // })
}