var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var options ={
    host:'localhost',
    port:'3307',
    user:'root',
    password:'000000',
    database:'opentutorials'
};
var sessionStore = new MySQLStore(options);

app.use(
    session({
      HttpOnly: true,
      secure: true,
      secret: 'kASDSADSADASDWDQ@O!!@',
      resave: false,  //false: 세션 데이터가 바뀌기 전 까지는 세션 저장소 값을 저장하지 않음
      saveUninitialized: true, //세션이 필요하기 전 까지는 세션을 구동시키지 않음
      store: sessionStore
    })
);

module.exports = options;