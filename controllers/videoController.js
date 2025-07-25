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

    await videoModel.saveVideoToDB(
        req.body.videoTitle,
        req.user.id,
        video.filename,
        req.body.description);

    // returns filename to client so that the contract address can be set when the contract is deployed
    res.json({filename: video.filename})
    // put video details into database to query later
    // res.send('Video Upload Successful');
    // res.redirect('/videos/upload');
}

exports.watchVideo = async (req, res) => {
    filename = req.params.filename

    vUser = await videoModel.getVideoAndUserByFileName(filename);

    // if there are no rows for the video asked for (this is if people try to search a non existent video by url)
    if (!vUser) {
        res.redirect('/')
    } else {

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
        // reactVideo = await videoModel.getReactedToVideoData(reactedTo);
        // if the person reacted to a video in their video get the reacted to video creators wallet address as well
        // let walletAddresses = [walletAddress, reactVideo.walletAddress];
        await videoModel.incrementViewCounter(vUser.videoId);
        res.render('videos/video', {user: vUser, subbed: subbed, x: vUser});

    }         
    // if the user is not logged in
    else {
        // user cannot be subbed to anyone if they are not logged in
        subbed = false;
        // if the video is not a react video
        videoModel.incrementViewCounter(vUser.videoId);
        res.render('videos/video', {user: vUser, subbed: subbed, x: vUser});
        
        // if the video is a react video

    }
    }
}

exports.getDonationForm = async (req, res) => {
    filename = req.params.filename;
    
    vUser = await videoModel.getVideoAndUserByFileName(filename);
    let title = vUser.title;
    let username = vUser.username;
    let walletAddress = vUser.walletAddress;
    let reactedTo = vUser.reactedTo;
    walletAddresses = [walletAddress]
        res.render("partials/donateForm",{title: title, creatorUsername: username, walletAddresses: walletAddresses,
                filename: filename, layout:false})
        
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

exports.getContractAddressOfVideo = async (req, res) => {
    filename = req.params.filename;
    console.log("reactedToLinkspoopydoopy i want to die meme",filename)
    video = await videoModel.getVideoAndUserByFileName(filename);
    res.json(video.contractAddress);
}

exports.setContractAddressOfVideo = async (req, res) => {
    try{
        filename = req.params.filename;
        contractAddress = req.params.contractAddress;
        console.log("stuff that should work after deployment", filename, "more shurtt", contractAddress)
        await videoModel.saveContractAddressToVideo(filename, contractAddress);
        res.json({success: true, message: 'Contract Address Saved'})
    }
    catch (err) {
        res.status(500).json({success: false, error: 'Contract Address Saving Failed'})
    }
}