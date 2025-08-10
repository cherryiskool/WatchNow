const videoModel = require('../models/videoModel');
const profileModel = require('../models/profileModel');

// used for the subsections (no point in rewriting code)
const homeModel = require('../models/homeModel');
const { S3, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { s3 } = require('../config/video');

exports.getUploadPage = (req, res) => {
    if (req.isAuthenticated() == false) {
        res.redirect('/login')
    } else {
        res.render('videos/upload', {pageTitle: 'Upload Video'});
    }

};

exports.uploadVideo = async (req, res) => {
    try {
        let video = req.file;
        console.log("video", video)
        const fileType = path.extname(video.originalname);
        const videoFilename = `${uuidv4()}${fileType}`

        await videoModel.saveVideoToDB(
            req.body.videoTitle,
            req.user.id,
            videoFilename,
            req.body.description);

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `videos/${videoFilename}`,
            Body: video.buffer,
            ContentType: video.mimetype,
        }

    
        await s3.send(new PutObjectCommand(params));

        // returns filename to client so that the contract address can be set when the contract is deployed
        res.json({success: true, filename: videoFilename})
    } catch (err) {
        console.log('sending video error', err)
        res.status(500).json({success: false, error: err})
    }
}

exports.watchVideo = async (req, res) => {
    filename = req.params.filename
    let vUser;
    [vUser] = await videoModel.getVideoAndUserByFileName(filename);
    recommendedVideos = await videoModel.getVideosBarOne(filename);
    console.log('get videos bar one', recommendedVideos)
    // if there are no rows for the video asked for (this is if people try to search a non existent video by url)
    if (!vUser[0]) {
        req.flash('error', 'Video not found')
        res.redirect('/')
    } else {

    // plus 1 as the database updates afterwards
    vUser[0].views = vUser[0].views + 1;

    let subbed;
    let subRow;

    // if the user is authenticated
    if (req.isAuthenticated()){
        [subRow] = await profileModel.checkSub(req.user.id, vUser[0].userId)

        let subscribeAction;
        let subscribeActionText;
        if(subRow[0]) {
            subscribeAction = 'unsubscribe';
            subscribeActionText = 'UnSub';
        } else {
            subscribeAction = 'subscribe';
            subscribeActionText = 'Sub'
        }
        // if the person reacted to a video in their video get the reacted to video creators wallet address as well
        await videoModel.incrementViewCounter(vUser[0].videoId);
        res.render('videos/video', {user: vUser[0], subscribeAction: subscribeAction, subscribeActionText: subscribeActionText, x: vUser[0], pageTitle: `${vUser[0].title}`, recommendedVideos: recommendedVideos.slice(0,2)[0]});
    }         
    // if the user is not logged in
    else {
        // user cannot be subbed to anyone if they are not logged in
        subbed = false;
        // if the video is not a react video
        await videoModel.incrementViewCounter(vUser[0].videoId);
        console.log(recommendedVideos.slice(0,2))
        res.render('videos/video', {user: vUser[0], subscribeAction: 'subscribe', subscribeActionText: 'Sub', x: vUser[0], pageTitle: `${vUser[0].title}`, recommendedVideos: recommendedVideos.slice(0,2)[0]});
    }
    }
}

exports.getDonationForm = async (req, res) => {
    filename = req.params.filename;
    
    [vUser] = await videoModel.getVideoAndUserByFileName(filename);
    let title = vUser[0].title;
    let username = vUser[0].username;
        res.render("partials/donateForm",{title: title, creatorUsername: username,
                filename: filename, layout:false, pageTitle: `${title}`})
        
}

exports.removeDonationForm = (req, res) => {
    res.send('');
}

exports.getReactedToInputForm = (req, res) => {
    res.render('partials/reactedToInputForm', {layout: false, pageTitle: 'Upload Video'});
}

exports.revertReactedToInputForm = (req, res) => {
    res.render('partials/defaultReactedToInput', {layout: false, pageTitle: 'Upload Video'});
}

exports.getReactedToInput = (req, res) => {
    res.render('partials/reactedToInput', {layout: false, pageTitle: 'Upload Video'});
}

exports.deleteReactedToInput = (req, res) => {
    res.send('');
}

exports.getContractAddressOfVideo = async (req, res) => {
    filename = req.params.filename;
    [video] = await videoModel.getVideoAndUserByFileName(filename);
    console.log(video)
    if (video[0] != null) {
        res.json({success: true, address: video[0].contractAddress});
    } else {
        res.status(404).json({success: false, error: 'Video Does Not Exist'});
    }
}

exports.setContractAddressOfVideo = async (req, res) => {
    try{
        filename = req.params.filename;
        contractAddress = req.params.contractAddress;
        console.log('setting the contract back end', contractAddress);
        await videoModel.saveContractAddressToVideo(filename, contractAddress);
        res.json({success: true, message: 'Contract Address Saved'})
    }
    catch (err) {
        res.status(500).json({success: false, error: 'Contract Address Saving Failed'})
    }
}

exports.getSubsectionVideos = async (req, res) => {
    subsection = req.params.subsection;
    let pageVideos;
    if (subsection == 'popular') {
        [pageVideos] = await homeModel.getAllVideosViewOrder();
    }
    else if (subsection == 'recommended' && req.isAuthenticated()) {
        [pageVideos] = await homeModel.getUserSubscribedVideos(req.user.id);
        if (pageVideos = []) {
            req.flash('error', 'Error no recommended videos')
            res.redirect('/')
            return
        }
    }
    // cant access recommended if they are not signed in
    else if (subsection == 'recommended' && req.isAuthenticated() == false) {
        req.flash('error', 'Sign in to see Recommended Videos');
        res.redirect('/login');
        return
    }
    else if (subsection == 'new') {
        [pageVideos] = await homeModel.getNewestUploads();
    }
    else
        // page doesnt exist
        {
        req.flash('error', 'Invalid Page');
        res.redirect('/')
        return
    }

    res.render('videos/subsection', {pageVideos: pageVideos, pageTitle: subsection[0].toUpperCase()+subsection.slice(1) });
}

exports.getSearchResults = async (req, res) => {
    searchQuery = req.params.searchQuery;

    [pageVideos] = await homeModel.getAllVideosViewOrder();
    let searchVideos = [];
    let nonSearchVideos =[];
    let finalVideos =[];

    // for every video
    for(let x of pageVideos) {
        // if the search matches the title or the username add it to the search videos
        if ((x.title.toUpperCase()).match(searchQuery.toUpperCase()) != null || (x.username.toUpperCase()).match(searchQuery.toUpperCase()) != null){

            console.log('x.title',x.title.toUpperCase(), 'searchQuery', searchQuery.toUpperCase(),'match result',x.title.toUpperCase().match(searchQuery.toUpperCase()))

            searchVideos.push(x);

            console.log('Match!', x.title);

        } else {
            // else add it to non search videos
            nonSearchVideos.push(x);
        }
    }

    // final array is related videos on top of unrelated videos
    finalVideos = searchVideos.concat(nonSearchVideos);

    res.render('videos/search', {pageVideos: finalVideos, pageTitle: searchQuery});
}

exports.postSearchResults = (req, res) => {
    searchQuery = req.body.searchQuery;
    res.redirect(`/videos/search/${searchQuery}`)
}