db = require('./db');

exports.saveVideoToDB = (videoTitle, userID, videoFilename, description) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO videos (title, uploaderId, fileName, description,\
             views, dateOfUpload) VALUES (?, ?, ?, ?, 0, datetime("now"))', 
            [videoTitle, userID, videoFilename, description], (err, row) => {
                // failure check
                resolve(row);
            })
    })
}

exports.getVideoAndUserByFileName = (filename) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT videos.id as "videoId", videos.title as "title",\
            videos.description as "description", videos.fileName, \
            videos.views as "views", videos.contractAddress, users.id as "userId", users.username as "username",\
            users.pfp  \
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

exports.getVideoIDByFileName = (filename) => {
    return new Promise ((resolve, reject) => {
        db.get('SELECT videos.id as "videoID" FROM videos WHERE fileName = ?',
            [ filename ], (err, video) => {
                // failure check
                resolve(video);
            }
        )
    })
}

exports.saveReactedToVideo = (reactID, originalID) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT OR IGNORE into reactedTo (reactId, originalId) VALUES (?, ?)', 
            [ reactID, originalID ], (err, row) => {
                // failure check
                resolve(row);
            })
    })
}

exports.saveContractAddressToVideo = (videoId, contractAddress) => {
    return new Promise((resolve, reject) => {
        db.run("UPDATE videos SET contractAddress = ? WHERE id = ?", 
            [ contractAddress, videoId ]), (err, row) => {
                // failure check
                resolve(row);
            }
    })
}