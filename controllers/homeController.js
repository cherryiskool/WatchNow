const homeModel = require('../models/homeModel')

// need to fix bug where logged out users cannot access page
exports.getHomePage = async (req, res) => {
    let popularVideos;
    let subbedVideos;
    let newestVideos;

    popularVideos = await homeModel.getAllVideosViewOrder();
    subbedVideos = await homeModel.getUserSubscribedVideos(req.user.id);
    newestVideos = await homeModel.getNewestUploads();
    res.render('index', {popularVideos: popularVideos, newestVideos: newestVideos, subbedVideos: subbedVideos})
}