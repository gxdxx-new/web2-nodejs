/*
function a() {
  console.log('A');
}
*/

//a 변수가 담고있는 값인 익명함수를 실행가능
var a = function() {
  console.log('A');
}

function slowfunc(callback) {
  //a();와 같음
  callback();
}

slowfunc(a);
