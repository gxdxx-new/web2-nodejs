var f = function() {
  console.log(1+1);
  console.log(1+2);
}
var a = [f];  //배열에 f함수를 넣은 변수
a[0](); //= f();

var o = {
  func:f
}
o.func(); //객체 o에서 func의 value값인 f가 반환돼서 f()가 실행됨
