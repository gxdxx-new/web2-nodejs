var fs = require('fs');

//readFileSync는 리턴값이 있지만 readFile은 없음

//readFileSync (동기적)
/*
consonle.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf8');
console.log(result);
console.log('C');
*/

//readFile (비동기적)
//nodejs가 파일을 읽고 3번째 인자를 실행시켜 err가 있다면 err을 제공, result가 있다면 파일의 내용을 제공
consonle.log('A');
var result = fs.readFile('syntax/sample.txt', 'utf8', function(err, result) {
  console.log(result);
});
console.log('C');
