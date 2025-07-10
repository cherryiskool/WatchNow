db = require('./db');
const bcrypt = require('bcrypt');

exports.registerUserToDB = async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, email, hashedPassword) VALUES (?, ?, ?)', [
      username,
      email,
      hashedPassword
    ])  
}