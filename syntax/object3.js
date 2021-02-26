/*
var v1 = 'gidon';
//100000 code
v1 = 'yk';  //v1이 바뀌면서 버그가 생김
var v2 = 'gidon2';
*/
var o = { //객체 생성, 함수는 값으로 저장이 가능함
  v1:'v1',
  v2:'v2',
  f1:function () {
    console.log(this.v1);
  },
  f2:function () {
    console.log(this.v2);
  }
}
o.f1();
o.f2();
/*
function f1() {
  console.log(o.v1);
}
function f2() {
  console.log(o.v2);
}
f1();
f2();
*/
