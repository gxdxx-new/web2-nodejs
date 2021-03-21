var session = require('express-session');
var express = require('express');
var app = express()
var session = require('express-session');
var bodyParser = require('body-parser');
var compression = require('compression'); //데이터를 압축
var indexRouter = require('./routes/index.js');
var topicRouter = require('./routes/topic.js');
var authorRouter = require('./routes/author.js');
var loginRouter = require('./routes/login.js');
var helmet = require('helmet');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var flash = require('connect-flash');

app.use(express.static('public'));  //정적인 파일을 서비스 하기 위한 public 디렉토리 안에서 static 파일을 찾음(안전해짐)
app.use(bodyParser.urlencoded({extended: false}));  //bodyParser미들웨어가 실행됨(사용자가 전송한 *post* data를 내부적으로 분석해서 callback함수의 request객체의 body property를 넘김)
app.use(compression()); //compression()을 호출하면 compression미들웨어를 리턴하고 app.use에 들어감
app.use(helmet());

var options ={
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.SERVER_PORT,
  database: process.env.DB_DATABASE
};
var sessionStore = new MySQLStore(options);

app.use(
    session({
      HttpOnly: true,
      secure: true,
      secret: 'kASDSADSADASDWDQ@O!!@',
      resave: false,  //false: 세션 데이터가 바뀌기 전 까지는 세션 저장소 값을 저장하지 않음
      saveUninitialized: true, //세션이 필요하기 전 까지는 세션을 구동시키지 않음
      store: new MySQLStore(sessionStore.options)
    })
);
app.use(flash()); //session을 사용해서 session 다음에 나와야됨
app.get('/flash', function(request, response) {
  request.flash('msg', 'Flash is back!!');
  response.send('flash');
});

app.get('/flash-display', function(request, response) {
  var fmsg = request.flash();
  console.log(fmsg);
  response.send(fmsg);
});

var authData = {
  email: 'nkd0310@naver.com',
  password: '000000',
  nickname: 'gidon'
};

var passport = require('passport'), //session 뒤에 와야됨, passport 설치
  LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize()); //passport express 설치
app.use(passport.session());  //session을 내부적으로 사용 가능

passport.serializeUser(function(user, done) { //로그인에 성공했을 때 딱 한번 호출되면서 사용자의 식별자를 저장
  console.log('serializable:', user);
  done(null, user.email); //sessions 테이블에 저장됨
});

passport.deserializeUser(function(id, done) { //로그인 후 각각의 페이지를 방문할 때 마다 로그인한 사용자인지 아닌지를 체크 
  console.log('deserializable:', id);
  done(null, authData); //authData가 /routes/index.js의 request로 들어감
});

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    if(username === authData.email) { //username:사용자가 입력한 값
      console.log(1);
      if(password === authData.password) {
        console.log(2);
        return done(null, authData);  //passport.serializeUser()에 authData가 주입됨
      } else {
        console.log(3);
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
    } else {
      console.log(4);
      return done(null, false, {
        message: 'Incorrect username.'
      });
    }
  }
));

app.post('/login/login_process',  //  login폼에서 전송한 데이터를 passport가 받도록 함
    passport.authenticate('local', {  //local: username, password을 이용
      successRedirect: '/',
      failureRedirect: '/login'
    }));

// app.use(
//   session({
//     HttpOnly: true,
//     secure: true,
//     secret: 'kASDSADSADASDWDQ@O!!@',
//     resave: false,  //false: 세션 데이터가 바뀌기 전 까지는 세션 저장소 값을 저장하지 않음
//     saveUninitialized: true, //세션이 필요하기 전 까지는 세션을 구동시키지 않음
//     store:new FileStore()
//   })
// );

app.use('/', indexRouter);
app.use('/topic', topicRouter); // /topic으로 시작하는 주소들에게 topicRouter라는 이름의 미들웨어를 적용
app.use('/author', authorRouter);
app.use('/login', loginRouter);

app.use(function(request, response, next) { //미들웨어는 순차적으로 실행되기 때문에 위에서 실행이 안되고 여기까지 오게되면 못찾은거여서 에러처리
  response.status(404).send('Sorry cant find that!');
});

app.use(function(error, request, response, next) {
  console.error(error.stack);
  response.status(500).send('Something broke!');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));