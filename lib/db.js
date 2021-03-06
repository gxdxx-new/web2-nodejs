var mysql = require('mysql');

var db = mysql.createConnection({ //mysql에 접속
    host:'localhost',
    user:'nodejs',
    password:'000000',
    port:'3307',
    database:'opentutorials'
  });
  db.connect();

  moudule.exports = db;