const homeModel = require('../models/homeModel')

// need to fix bug where logged out users cannot access page
exports.getHomePage = async (req, res) => {
    let popularVideos;
    let subbedVideos;
    let newestVideos;

    [popularVideos] = await homeModel.getAllVideosViewOrder();
    if(req.isAuthenticated()){
        [subbedVideos] = await homeModel.getUserSubscribedVideos(req.user.id);
    }
    else {
        subbedVideos = [];
    }
    [newestVideos] = await homeModel.getNewestUploads();
    res.render('index', {popularVideos: popularVideos, popIndex: 0, newestVideos: newestVideos, newIndex: 0, subbedVideos: subbedVideos, subIndex: 0, pageTitle: 'WatchNow'})
}

exports.forwardPopularVideos = async (req, res) => {
    subsection = req.params.subsection;
    direction = req.params.direction;
    index = Number(req.params.index);
    
    // get the subsection the user wants to update
    if(subsection === 'popular') {
        [Videos] = await homeModel.getAllVideosViewOrder(); 
    }
    else if(subsection === 'recommended') {
        [Videos] = await homeModel.getUserSubscribedVideos(req.user.id);
    } else {
        [Videos] = await homeModel.getNewestUploads();
    }
    // if the user clicked the forward button
    if(direction === 'forward') {
        // if there are more than 3 videos left
        if(Videos.length - (3 + index) > 3) {
            index = index + 3;
        }
        // if there are not more than 3 videos then increase the index by the amount left 
        else {
            index = Math.max(Videos.length - 3, 0)
        }
    } 
    // if the user clicked the backward button
    else {
        // if there are at least three videos left go back three
        if(index - 3 >= 0) {
            index = index - 3;
        } 
        // if there arent then just go back to index 0
        else {
            index = 0;
        }
    }

    // used to render subsection specific data
    if(subsection === 'popular') {
        res.render('partials/popularPanorama', {popIndex: index, popularVideos: Videos, layout: false, pageTitle: 'WatchNow'})
    }
    else if(subsection === 'recommended') {
        res.render('partials/subscribedPanorama', {subIndex: index, subbedVideos: Videos,layout: false, pageTitle: 'WatchNow'})
    } 
    else {
        res.render('partials/newPanorama', {newIndex: index, newestVideos: Videos, layout: false, pageTitle: 'WatchNow'})
    }
    
}