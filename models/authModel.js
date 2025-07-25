db = require('./db');
const bcrypt = require('bcrypt');

exports.registerUserToDB = async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise ((resolve, reject) => {
    db.run('INSERT INTO users (username, email, hashedPassword, pfp) \
       VALUES (?, ?, ?, "Default_pfp.jpg")', [
      username,
      email,
      hashedPassword
    ], (err, row) => {
      resolve(row);
    })  
    })

}