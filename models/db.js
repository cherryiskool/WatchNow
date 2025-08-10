// const sqlite3 = require('sqlite3');
const mysql2 = require('mysql2');
// require('dotenv').config();

const pool = mysql2.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: 3306
}).promise();

// allows other files to access/run this one
module.exports = pool;