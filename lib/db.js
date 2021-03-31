require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createConnection({ //mysql에 접속
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.SERVER_PORT,
    database: process.env.DB_DATABASE
  });
db.connect();

module.exports = db;