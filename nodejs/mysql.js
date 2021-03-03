var mysql      = require('mysql');  //mysql 모듈을 사용
var connection = mysql.createConnection({   //mysql 모듈과 관련된 객체의 createConnection메소드를 호출
  host     : 'localhost',
  user     : 'nodejs',
  password : '000000',
  port     : '3307',
  database : 'opentutorials'
});
 
connection.connect();
 
connection.query('SELECT * FROM topic', function (error, results, fields) {    //sql문, callback을 인자로 줌
  if (error) {
      console.log(error);
  }
  console.log(results); //접속결과가 담긴 results인자를 출력
});
 
connection.end();