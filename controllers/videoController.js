const videoModel = require('../models/videoModel');
const profileModel = require('../models/profileModel')

exports.getUploadPage = (req, res) => {
    if (req.isAuthenticated() == false) {
        res.redirect('/login')
    } else {
        res.render('videos/upload');
    }

};

exports.uploadVideo = async (req, res) => {
    let video = req.file;
    console.log("Attempt to log video", video);

    console.log('Set of things not working properly',req.body.videoTitle,
        req.user.id,
        video.filename,
        req.body.description)
    await videoModel.saveVideoToDB(
        req.body.videoTitle,
        req.user.id,
        video.filename,
        req.body.description);
    
    console.log(req.body.reactedTo)
    if(req.body.reactedTo) {

        for(i in req.body.reactedTo) {
            let indexOfUrl = req.body.reactedTo[i].indexOf("watch/");
            let reactedToFileName = req.body.reactedTo[i].slice(indexOfUrl + 6);
            console.log('reactedFileName', reactedToFileName)
            videoJustSavedID = await videoModel.getVideoIDByFileName(video.filename);
            reactVideoID = await videoModel.getVideoIDByFileName(reactedToFileName);
            console.log('video just saved',videoJustSavedID.videoID, reactVideoID);

            await videoModel.saveReactedToVideo(videoJustSavedID.videoID, reactVideoID.videoID);
        }
    }

    res.send('Upload Successful')
    console.log('req.body.filename',req.body.reactedTo)
    // put video details into database to query later

    




    // res.send('Video Upload Successful');
    // res.redirect('/videos/upload');
    
}

exports.watchVideo = async (req, res) => {
    filename = req.params.filename
    console.log(filename)

    vUser = await videoModel.getVideoAndUserByFileName(filename);
    console.log(vUser)
    // get all video data as well as data of user who uploaded the video

    // if there are no rows for the video asked for (this is if people try to search the video by url)
    if (!vUser) {
        console.log("entered this hoie")
        res.redirect('/')
    } else {

    let title = vUser.title;
    let username = vUser.username;
    let walletAddress = vUser.walletAddress;
    let reactedTo = vUser.reactedTo;
    let description = vUser.description;

    // plus 1 as the database updates afterwards
    let views = vUser.views + 1;

    let subbed;
    let subRow;
    // if the user is authenticated
    if (req.isAuthenticated()){
        subRow = await profileModel.checkSub(req.user.id, vUser.userId)
        if(subRow) {
            subbed = true;
        } else {
            subbed = false;
        }
        // if the video is not a react video
        if (reactedTo === ''){
            let walletAddresses = [walletAddress];

            // if(backUrl == backUrl)
            await videoModel.incrementViewCounter(vUser.videoId);
            res.render('videos/video', {title: title, creatorUsername: username, walletAddresses: walletAddresses,
                        filename: filename, viewerWalletAddress: req.user.walletAddress, description: description, views: views, subbed: subbed, user: [vUser]});
        } 
        // if the video is a react video
        else {
            reactVideo = await videoModel.getReactedToVideoData(reactedTo);
            // if the person reacted to a video in their video get the reacted to video creators wallet address as well

            let walletAddresses = [walletAddress, reactVideo.walletAddress];
            await videoModel.incrementViewCounter(vUser.videoId);
            res.render('videos/video', {title: title, creatorUsername: username, walletAddresses: walletAddresses,
            filename: filename, viewerWalletAddress: req.user.walletAddress, description:description, views: views, subbed: subbed, user: [reactVideo]});
        }
    }         
    // if the user is not logged in
    else {
        // user cannot be subbed to anyone if they are not logged in
        subbed = false;
        // if the video is not a react video
        if (reactedTo === ''){
            let walletAddresses = [walletAddress];
            videoModel.incrementViewCounter(vUser.videoId);
            res.render('videos/video', {title: title, creatorUsername: username, walletAddresses: walletAddresses,
            filename: filename, description: description, views: views, subbed: subbed});
        } 
        // if the video is a react video
        else {
            reactVideo = await videoModel.getReactedToVideoData(reactedTo);
            let walletAddresses = [walletAddress, row.walletAddress];
            videoModel.incrementViewCounter(vUser.videoId);                
            res.render('videos/video', {title: title, creatorUsername: username, walletAddresses: walletAddresses,
                filename: filename, views: views, subbed: subbed});
        }
    }
    }
}

exports.getDonationForm = async (req, res) => {
    filename = req.params.filename;
    if(req.isAuthenticated()) {
        // db.get('SELECT videos.id as "videoId", videos.title as "title", videos.reactedTo as "reactedTo", users.username as "username", users.walletAddress as "walletAddress"  FROM videos JOIN users ON videos.uploaderId = users.id WHERE fileName = ?', [ filename ], (requ, row) => {
        //         
        vUser = await videoModel.getVideoAndUserByFileName(filename);
        let title = vUser.title;
        let username = vUser.username;
        let walletAddress = vUser.walletAddress;
        let reactedTo = vUser.reactedTo;
        walletAddresses = [walletAddress]
            res.render("partials/donateForm",{title: title, creatorUsername: username, walletAddresses: walletAddresses,
                    filename: filename, viewerWalletAddress: req.user.walletAddress, layout:false})
        
        // })


    } else {
        // here I have to send alerts for login/register error
    }
}

exports.removeDonationForm = (req, res) => {
    res.send('');
}

exports.getReactedToInputForm = (req, res) => {
    res.render('partials/reactedToInputForm', {layout: false});
}

exports.revertReactedToInputForm = (req, res) => {
    res.render('partials/defaultReactedToInput', {layout: false});
}

exports.getReactedToInput = (req, res) => {
    res.render('partials/reactedToInput', {layout: false});
}

exports.deleteReactedToInput = (req, res) => {
    res.send('');
}