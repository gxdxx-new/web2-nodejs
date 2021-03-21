var session = require('express-session');
  
module.exports = function(app) {
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
      done(null, user.email); //sessions 테이블에 저장됨
    });
    
    passport.deserializeUser(function(id, done) { //로그인 후 각각의 페이지를 방문할 때 마다 로그인한 사용자인지 아닌지를 체크 
      done(null, authData); //authData가 /routes/index.js의 request로 들어감
    });
    
    passport.use(new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      function(username, password, done) {
        if(username === authData.email) { //username:사용자가 입력한 값
          if(password === authData.password) {
            return done(null, authData, {
              message: 'Welcome!!'
            });
          }  //passport.serializeUser()에 authData가 주입됨
          else {
            return done(null, false, {
              message: 'Incorrect password.'
            });
          }
        } else {
          return done(null, false, {
            message: 'Incorrect username.'
          });
        }
      }
    ));
    return passport;
}