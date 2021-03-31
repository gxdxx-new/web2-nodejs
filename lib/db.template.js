const mysql = require('mysql');

const db = mysql.createConnection({ //mysql에 접속
    host:'',
    user:'',
    password:'',
    port:'',
    database:''
  });
  db.connect();

  moudule.exports = db;