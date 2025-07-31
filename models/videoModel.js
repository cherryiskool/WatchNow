db = require('./db');

exports.saveVideoToDB = async (videoTitle, userID, videoFilename, description) => {
    
        return await db.query('INSERT INTO videos (title, uploaderId, fileName, description,\
             views, dateOfUpload) VALUES (?, ?, ?, ?, 0, NOW())', 
            [videoTitle, userID, videoFilename, description])

}

exports.getVideoAndUserByFileName = async (filename) => {
    
        return await db.query('SELECT videos.id as "videoId", videos.title as "title",\
            videos.description as "description", videos.fileName, \
            videos.views as "views", videos.contractAddress, users.id as "userId", users.username as "username",\
            users.pfp  \
            FROM videos \
            JOIN users ON videos.uploaderId = users.id \
            WHERE fileName = ?', [ filename ])

} 

exports.incrementViewCounter = async (videoId) => {
    
        return await db.query('UPDATE videos SET views = views + 1 WHERE id = ?', [ videoId ]
        )


}

// for now only gets one react video have to change that later
exports.getReactedToVideoData = async (reactedToFileName) => {
    
        return await db.query('SELECT * FROM users \
            JOIN videos ON users.id = videos.uploaderId \
            WHERE fileName = ?', [ reactedToFileName ])

}

exports.getVideoIDByFileName = async (filename) => {

        return await db.query('SELECT videos.id as "videoID" FROM videos WHERE fileName = ?',
            [ filename ]
        )

}

exports.saveReactedToVideo = async (reactID, originalID) => {
    
        return await db.query('INSERT IGNORE into reactedTo (reactId, originalId) VALUES (?, ?)', 
            [ reactID, originalID ])

}

exports.saveContractAddressToVideo = async (filename, contractAddress) => {
    
        return await db.query("UPDATE videos SET contractAddress = ? WHERE fileName = ?", 
            [ contractAddress, filename ])

}

exports.getVideosBarOne = async (filename) => {
    
        return await db.query('SELECT videos.id as "videoId", videos.title as "title",\
            videos.description as "description", videos.fileName, \
            videos.views as "views", videos.contractAddress, videos.dateOfUpload, \
            users.id as "userId", users.username as "username",\
            users.pfp \
            FROM videos \
            JOIN users ON videos.uploaderId = users.id \
            WHERE NOT fileName = ? \
            ORDER BY videos.views \
			LIMIT 2',
            [ filename ]
        )

}