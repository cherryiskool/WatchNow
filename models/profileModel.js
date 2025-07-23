db = require('./db');

exports.getUserAndVidsByID = (id) => {
    return new Promise((resolve, reject) => {
    // has to be left join in the case that the user has no videos  
    db.all('SELECT users.id as "userId", users.username as "username",\
         users.walletAddress as "walletAddress", users.bio as "bio", \
         users.banner as "banner", users.pfp as "pfp", videos.id as "videoID",\
          videos.title as "title", videos.filename as "filename", videos.views, videos.dateOfUpload \
          FROM users\
          LEFT JOIN videos ON users.id = videos.uploaderId \
          WHERE users.id = ?', [ id ], 
          (err, user) => {
            resolve(user);
            // have to add failure checks here
          })
    })

}

exports.updateUserDetails = (walletAddress, bio, bannerFileName, pfpFileName, userID) => {
    return new Promise((resolve, reject) => {
    db.run('UPDATE users SET walletAddress = ?, bio = ?, banner = ?, pfp = ? WHERE id = ?', [
      walletAddress,
      bio,
      bannerFileName,
      pfpFileName,
      userID
    ], (err, user) => {
        // have to add success and failure checks here
        resolve(user)
    })
    })
}

exports.getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [ username ], (err, user) => {
            resolve(user);
            // have to add failure checks here
        })
    })
}

//  need to disallow subbing to yourself
exports.setSubDB = (subscriberID, channelID) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT OR IGNORE INTO subscribed (subscriberId, subscribedToId) VALUES (?, ?)',
            [subscriberID, channelID], (err, user) => {
                // have to add success and error checks here
                resolve(user);
            })
    })
}

exports.unSetSub = (subscriberID, channelID) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM subscribed WHERE subscriberId = ? and subscribedToId = ?',
            [subscriberID, channelID], (err, row) => {
                // failure check
                resolve(row)
            }
        )
    })
}

// either the statement needs to be changed or the database id variables need to be renamed
exports.getUserAndVidsByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT users.id as "userId", users.username as "username",\
         users.walletAddress as "walletAddress", users.bio as "bio", \
         users.banner as "banner", users.pfp as "pfp", videos.id as "videoID",\
          videos.title as "title", videos.filename as "filename", videos.views, videos.dateOfUpload FROM users \
            JOIN videos ON users.id = videos.uploaderId \
            WHERE users.username = ?', 
        [ username ], (err, user) => {
            // failure check needed
            resolve(user);
        })
    })
}


exports.checkSub = (subscriberID, channelID) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM subscribed WHERE subscriberId = ? and subscribedToId = ?',
            [subscriberID, channelID], (err, row) => {
                // failure check needed
                resolve(row);
            }
        )
    })
}

exports.getUserByID = (userID) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE id = ?', [ userID ], (err, user) => {
            // failure check needed
            resolve(user);
        })
    })
}