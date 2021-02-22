var args = process.argv; //배열 형식 출력
console.log(args[2]); //입력한 입력값은 3번째 자리부터 시작
console.log('A');
console.log('B');
if(args[2] === '1') {
  console.log('C1');
} else {
  console.log('C2');
}
console.log('D');
