var db = require('../lib/db.js');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var flash = require('connect-flash');
var bcrypt = require('bcrypt');

module.exports = function(app) {

    var options = {
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
    
    var passport = require('passport'), //session 뒤에 와야됨, passport 설치
        LocalStrategy = require('passport-local').Strategy,
        GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    app.use(passport.initialize()); //passport express 설치
    app.use(passport.session());  //session을 내부적으로 사용 가능
    
    passport.serializeUser(function(user, done) { //로그인에 성공했을 때 딱 한번 호출되면서 사용자의 식별자를 저장
      console.log('serializeUser', user);
      done(null, user.id); //sessionStore에 식별자인 user.id만 저장
    });
    
    passport.deserializeUser(function(id, done) { //로그인 후 각각의 페이지를 방문할 때 마다 로그인한 사용자인지 아닌지를 체크 
      db.query(`SELECT * FROM users WHERE id=?`, [id], function(error, user) {
        if(error) {
          return false;
        } else {
          console.log('deserializeUser', id, user[0]);
          done(null, user[0]); //user가 /routes/index.js의 request로 들어감
        }
      });
    });
    
    passport.use(new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      function(email, password, done) {
        console.log('LocalStrategy', email, password);
        db.query(`SELECT * FROM users WHERE email=?`, [email], function(error, user) {
          if(error) {
            return false;
          } else {
            if(user[0]) { //username:사용자가 입력한 값
              bcrypt.compare(password, user[0].password, function(error, result) {
                if(result) {
                  return done(null, user[0], {
                    message: 'Welcome!!'
                  });
                } else {
                  return done(null, false, {
                    message: 'Incorrect password.'
                  });
                }
              });
            } else {
              return done(null, false, {
                message: 'Incorrect email.'
              });
            }
          }
        });
      }
    ));

    var googleCredentials = require('../config/google.json');
    passport.use(new GoogleStrategy({
        clientID: googleCredentials.web.client_id,
        clientSecret: googleCredentials.web.client_secret,
        callbackURL: googleCredentials.web.redirect_uris[0]
      },
      function(accessToken, refreshToken, profile, done) {
        console.log(accessToken, refreshToken, profile);
        var email = profile.emails[0].value;
        db.query(`SELECT * FROM users WHERE email=?`, [email], function(error, user) {  //복수의 RowDataPacket 반환
          if(error) {
            next(error);
          } else {
            if(user[0]) {
              console.log(user);
              db.query(`UPDATE users SET googleId=? WHERE id=?`, [profile.id, user[0].id], function(error) { //INSERT/DELETE/UPDATE에선 단일 OkPacket 객체를 반환
                if(error) {
                  next(error);
                }
              });
            } else {
              db.query(`INSERT INTO users (email, displayName, password, googleId) VALUES(?, ?, ?, ?);`, 
                [email, profile.displayName, profile.password, profile.id], function(error) {
                  if(error) {
                    next(error);
                  }
              });
            }
            console.log(user[0]);

            db.query(`SELECT * FROM users WHERE email=?`, [email], function(error, user3) {
              if(error) {
                next(error);
              } else {
                done(null, user3[0]); 
              }
            });
          }
        });
        // User.findOrCreate({ googleId: profile.id }, function(error, user)
        // {
        //   return done(error, user);
        // });
      }
    ));

    app.get('/login/google',
      passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login', 'email']
      }));

    app.get('/login/google/callback',
      passport.authenticate('google', {
        failureRedirect: '/login'
      }),
      function(request, response) {
        response.redirect('/');
      });

    return passport;
}