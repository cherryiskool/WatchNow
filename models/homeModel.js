db = require('./db');

exports.getAllVideosViewOrder = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT videos.id as "videosID", videos.title, videos.fileName, \
            videos.description, videos.views, videos.dateOfUpload, users.id as "userID" \
            , users.username, users.pfp \
            FROM videos \
            JOIN users on users.id = videos.uploaderId \
            ORDER BY views DESC',
            (err, videos) => {
                // failure check
                resolve(videos);
            }
        )
    })
};

exports.getUserSubscribedVideos = (userID) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT videos.id as "videosID", videos.title, videos.fileName, \
            videos.description, videos.views, videos.dateOfUpload, users.id as "userID", \
            users.username, users.pfp \
			FROM videos \
			JOIN users ON videos.uploaderId = users.id \
            JOIN subscribed ON videos.uploaderId = subscribed.subscribedToId \
            WHERE subscribed.subscriberId = 1 \
            ORDER BY views DESC', [ userID ], 
        (err, videos) => {
            // failure check
            resolve(videos);
        })
    })
};

exports.getNewestUploads = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT videos.id as "videosID", videos.title, videos.fileName, \
            videos.description, videos.views, videos.dateOfUpload, users.id as "userID" \
            , users.username, users.pfp \
            FROM videos \
            JOIN users ON videos.uploaderId = users.id \
            ORDER BY dateOfUpload DESC',
            (err, videos) => {
                // failure check
                resolve(videos);
            }
        )
    })
}