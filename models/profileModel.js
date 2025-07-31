db = require('./db');

exports.getUserAndVidsByID = async (id) => {
    
    // has to be left join in the case that the user has no videos  
    return await db.query('SELECT users.id as "userId", users.username as "username",\
        users.bio as "bio", \
         users.banner as "banner", users.pfp as "pfp", videos.id as "videoID",\
          videos.title as "title", videos.filename as "filename", videos.views, videos.dateOfUpload \
          FROM users\
          LEFT JOIN videos ON users.id = videos.uploaderId \
          WHERE users.id = ?', [ id ])


}

exports.updateUserDetails = async (bio, bannerFileName, pfpFileName, userID) => {
    
    return await db.query('UPDATE users SET  bio = ?, banner = ?, pfp = ? WHERE id = ?', [
      bio,
      bannerFileName,
      pfpFileName,
      userID
    ])

}

exports.getUserByUsername = async (username) => {
    
        return await db.query('SELECT * FROM users WHERE username = ?', [ username ])

}

//  need to disallow subbing to yourself
exports.setSubDB = async (subscriberID, channelID) => {
    
        return await db.query('INSERT IGNORE INTO subscribed (subscriberId, subscribedToId) VALUES (?, ?)',
            [subscriberID, channelID])

}

exports.unSetSub = async (subscriberID, channelID) => {
    
        return await db.query('DELETE FROM subscribed WHERE subscriberId = ? and subscribedToId = ?',
            [subscriberID, channelID]
        )

}

// either the statement needs to be changed or the database id variables need to be renamed
exports.getUserAndVidsByUsername = async (username) => {
    
        return await db.query('SELECT users.id as "userId", users.username as "username",\
         users.bio as "bio", \
         users.banner as "banner", users.pfp as "pfp", videos.id as "videoID",\
          videos.title as "title", videos.filename as "filename", videos.views, videos.dateOfUpload FROM users \
            JOIN videos ON users.id = videos.uploaderId \
            WHERE users.username = ?', 
        [ username ])

}


exports.checkSub = async (subscriberID, channelID) => {
    
        return await db.query('SELECT * FROM subscribed WHERE subscriberId = ? and subscribedToId = ?',
            [subscriberID, channelID]
        )

}

exports.getUserByID = async (userID) => {
    
        return await db.query('SELECT * FROM users WHERE id = ?', [ userID ])

}