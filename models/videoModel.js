db = require('./db');

exports.saveVideoToDB = (videoTitle, userID, videoFilename, reactedToFileName, description) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO videos (title, uploaderId, fileName, reactedTo, description,\
             views, dateOfUpload) VALUES (?, ?, ?, ?, ?, 0, datetime("now"))', 
            [videoTitle, userID, videoFilename, reactedToFileName, description], (err, row) => {
                // failure check
                resolve(row);
            })
    })
}

exports.getVideoAndUserByFileName = (filename) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT videos.id as "videoId", videos.title as "title",\
            videos.reactedTo as "reactedTo", videos.description as "description",\
            videos.views as "views", users.id as "userId", users.username as "username",\
            users.walletAddress as "walletAddress"  \
            FROM videos \
            JOIN users ON videos.uploaderId = users.id \
            WHERE fileName = ?', [ filename ], (err, vUser) => {
                // failure check
                resolve(vUser);
            })
    })
} 

exports.incrementViewCounter = (videoId) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE videos SET views = views + 1 WHERE id = ?', [ videoId ], 
            (err, row) => {
                // failure check
                resolve(row);
            }
        )
    }) 

}

// for now only gets one react video have to change that later
exports.getReactedToVideoData = (reactedToFileName) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users \
            JOIN videos ON users.id = videos.uploaderId \
            WHERE fileName = ?', [ reactedToFileName ], 
        (err, video) => {
            // failure check
            resolve(video);
        })
    })
}