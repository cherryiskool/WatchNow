const profileModel = require('../models/profileModel');

exports.getOwnProfile = async (req, res) => {

    if (req.isAuthenticated()) {
           
        user = await profileModel.getUserAndVidsByID(req.user.id)
        if (user[0].username === req.params.username) {

          res.render('profile/index', {user: user, pageTitle: `${req.user.username} Profile Page`});
          
        } else {
          res.redirect('/')
        }
      
  } else {
    res.redirect('/login/');
  }
  // res.render('profile/index', req.user);
}

exports.updateProfile = async (req, res) => {
  
    // console.log('req for the profile edit', req.files[0].pfp)

    let bannerFileName;
    let pfpFileName;
    // there may be a better way to do this
    // this makes sure not to set user details as empty if they did not want to change anything
    walletAddress = req.body.walletAddress;

    // if the file upload is empty then set the new pfp to be the old one
    if(!req.files.pfp) {
      pfpFileName = req.user.pfp;
    } else {
      pfpFileName = req.files.pfp[0].filename
    }
    // same as above
    if (!req.files.banner) {
      bannerFileName = req.user.banner;
    } else {
      bannerFileName = req.files.banner[0].filename
    }
    bio = req.body.bio
    
    console.log('pfpFilename', pfpFileName);
    console.log('bannerFilename', bannerFileName);
    await profileModel.updateUserDetails(walletAddress, bio, bannerFileName, pfpFileName, req.user.id)

    res.redirect(`/myprofile/${req.user.username}`)
}

exports.subscribe = async (req, res) => {
  backURL = req.header('Referer') || '/'
  if (req.isAuthenticated()) {
    subscribedTo = req.params.username;

    channelUser = await profileModel.getUserByUsername(subscribedTo)
    await profileModel.setSubDB(req.user.id, channelUser.id)
    // get the id of the user that the protagonist wants to subscribe to
    // set that they are subscribed only if it does not violate the necessity for both values to be unique as stated in db.js
   
    res.redirect(backURL)
  } 
// need to display error message if they are not subscribed
  else {
  }
}

exports.unsubscribe = async (req, res) => {
  backURL = req.header('Referer') || '/'
  if (req.isAuthenticated()) {
    subscribedTo = req.params.username;
    channel = await profileModel.getUserAndVidsByUsername(subscribedTo);
    await profileModel.unSetSub(req.user.id, channel[0].userId);
    res.redirect(backURL)
  }
  // need to send an error to say they need to be logged in
  else {

  }
}

exports.getForeignProfile = async (req, res) => {
  username = req.params.username;

    foreignUser = await profileModel.getUserAndVidsByUsername(username);
    if(req.isAuthenticated()) {
      subRow = await profileModel.checkSub(req.user.id, foreignUser[0].id)
      // if this row exists it must mean that the user is subscribed
      if (subRow) {
      // return orignal row of the profile user details as well as all their videos
      // return subbed to be false (protagonist user is  subscribed to profile user)
      res.render('profile/foreignProfile', {user: foreignUser, subbed: true, x: foreignUser, pageTitle: `${username} Profile Page`});
      } 
      
      // if the row does not exist then the user is not subscribed
      else {
      // return orignal row of the profile user details as well as all their videos
      // return subbed to be false (protagonist user is  subscribed to profile user)
      res.render('profile/foreignProfile', {user: foreignUser, subbed: false, x: foreignUser, pageTitle: `${username} Profile Page`});
      }
    } else {
      res.render('profile/foreignProfile', {user: foreignUser, subbed: false, x: foreignUser, pageTitle: `${username} Profile Page`});
    }

}

exports.getEditForm = async (req, res) => {
  if (req.isAuthenticated()) {
    user = await profileModel.getUserByID(req.user.id);
    if (user.username === req.params.username) {
        res.render("partials/editProfileForm", {layout: false, user: req.user, pageTitle: `${req.user.username} Profile Page`});
    } else {
        res.redirect('/')
    }
  } else {
    res.redirect('/login/');
  }
  // res.render("partials/editProfileForm", {layout: false})
}

exports.removeEditForm = async (req, res) => {
    if (req.isAuthenticated()) {
        user = await profileModel.getUserByID(req.user.id);
        if (user.username === req.params.username) {
            res.send('');
        } else {
            res.redirect('/')
        }
  } else {
    res.redirect('/login/');
  }
  // res.send('');
}