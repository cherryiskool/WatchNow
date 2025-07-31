db = require('./db');

exports.getAllVideosViewOrder = async () => {

    return await db.query('SELECT videos.id as "videosID", videos.title, videos.fileName, \
            videos.description, videos.views, videos.dateOfUpload, users.id as "userID" \
            , users.username, users.pfp \
            FROM videos \
            JOIN users on users.id = videos.uploaderId \
            ORDER BY views DESC',
        )
    
};

exports.getUserSubscribedVideos = async (userID) => {

    return await db.query('SELECT videos.id as "videosID", videos.title, videos.fileName, \
            videos.description, videos.views, videos.dateOfUpload, users.id as "userID", \
            users.username, users.pfp \
			FROM videos \
			JOIN users ON videos.uploaderId = users.id \
            JOIN subscribed ON videos.uploaderId = subscribed.subscribedToId \
            WHERE subscribed.subscriberId = ? \
            ORDER BY views DESC', [ userID ])

};

exports.getNewestUploads = async () => {

    return await db.query('SELECT videos.id as "videosID", videos.title, videos.fileName, \
            videos.description, videos.views, videos.dateOfUpload, users.id as "userID" \
            , users.username, users.pfp \
            FROM videos \
            JOIN users ON videos.uploaderId = users.id \
            ORDER BY dateOfUpload DESC')

}