const sqlite3 = require('sqlite3');

// open database
const db = new sqlite3.Database('./models/users.db')

// run the following code in order
db.serialize(function() {
    // create users table
    db.run("CREATE TABLE IF NOT EXISTS users ( \
        id INTEGER PRIMARY KEY, \
        username TEXT UNIQUE, \
        email TEXT UNIQUE, \
        hashedPassword TEXT, \
        walletAddress TEXT \
    )");
    
    // here the videos table
    db.run("CREATE TABLE IF NOT EXISTS videos ( \
        id INTEGER PRIMARY KEY, \
        title TEXT, \
        uploaderId INTEGER, \
        fileName TEXT UNIQUE, \
        reactedTo TEXT, \
        FOREIGN KEY(uploaderId) references users(id) \
    )");

    
});

// allows other files to access/run this one
module.exports = db;