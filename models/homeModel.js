db = require('./db');

exports.getAllVideosViewOrder = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM videos ORDER BY views DESC',
            (err, videos) => {
                // failure check
                resolve(videos);
            }
        )
    })
};

exports.getUserSubscribedVideos = (userID) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM videos \
            JOIN subscribed ON videos.uploaderId = subscribed.subscribedToId \
            WHERE subscribed.subscriberId = ? \
            ORDER BY views DESC', [ userID ], 
        (err, videos) => {
            // failure check
            resolve(videos);
        })
    })
};

exports.getNewestUploads = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM videos ORDER BY dateOfUpload DESC',
            (err, videos) => {
                // failure check
                resolve(videos);
            }
        )
    })
}