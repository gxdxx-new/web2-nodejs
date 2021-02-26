var members = ['gidon', '5356', 'yk'];
console.log(members[1]);  //5356

var i = 0;
while(i < members.length) {
  console.log('array loop =>', members[i]);
  i++;
}

//객체 : 각각의 데이터마다 고유한 이름을 부여
var roles = {
  'programmer':'gidon',
  'designer':'5356',
  'manager':'yk'
};
console.log(roles.designer);
console.log(roles['designer']); //둘다 사용가능

for(var name in roles) {
  console.log('object =>', name, '/ value =>', roles[name]);
}
