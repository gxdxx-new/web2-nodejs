const db = require('../lib/db.js');
const template = require('../lib/template.js');
const auth = require('../lib/auth.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

module.exports = function(passport) {
    router.get('/', function(request, response) { //routing
        const fmsg = request.flash();
        let feedback = '';
        if(fmsg.error) {
            feedback = fmsg.error[0];
        }
        const title = 'WEB - Login';
        const list = template.list(request.list);
        const html = template.HTML(title, list,
            `
                <div style="color:red;">${feedback}</div>
                <form action="/login/login_process" method="post">
                    <p><input type="text" name="email" placeholder="email"></p>
                    <p><input type="password" name="password" placeholder="password"></p>
                    <p><input type="submit" value="login"></p>
                </form>
            `,
            `<a href="/topic/create">create</a>`, ///create로 이동, home에서는 update 버튼 안나오게
            auth.statusUI(request, response)
        );
        response.send(html);
    });

    router.post('/login_process',  //  login폼에서 전송한 데이터를 passport가 받도록 함
        passport.authenticate('local', {  //local: username, password을 이용
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true,
            successFlash: true
        }
    ));

    router.get('/logout_process', function(request, response) {
        if(auth.isOwner(request, response) === false) {
            response.redirect('/');
            return false;
        }
        request.logout();   //passport에서 로그아웃을 하고
        request.session.save(function() {   //현재 세션의 상태를 MySQLStore에 저장
            response.redirect('/');
        });
    });

    router.get('/register', function(request, response) { //routing
        const fmsg = request.flash();
        let feedback = '';
        if(fmsg.error) {
            feedback = fmsg.error[0];
        }
        const title = 'WEB - Login';
        const list = template.list(request.list);
        const html = template.HTML(title, list,
            `
                <div style="color:red;">${feedback}</div>
                <form action="/login/register_process" method="post">
                    <p><input type="text" name="email" placeholder="email"></p>
                    <p><input type="password" name="password" placeholder="password"></p>
                    <p><input type="password" name="password2" placeholder="password"></p>
                    <p><input type="text" name="displayName" placeholder="display name"></p>
                    <p><input type="submit" value="register"></p>
                </form>
            `,
            `<a href="/topic/create">create</a>`, ///create로 이동, home에서는 update 버튼 안나오게
            auth.statusUI(request, response)
        );
        response.send(html);
    });

    router.post('/register_process', function(request, response, next) { //topic.register에서 post방식으로 전송됨
        const post = request.body;
        db.query(`SELECT email FROM users WHERE email=?`, [post.email], function(error, user) {
            if(error) {
              next(error);
            } else {
                if(user[0] === undefined) {
                    if(post.password === post.password2) {
                        bcrypt.hash(post.password, 10, function(error, hash) {
                            db.query(`INSERT INTO users (email, password, displayName) VALUES(?, ?, ?);`, 
                            [post.email, hash, post.displayName], 
                            function(error, result) {
                              if(error) {
                                next(error);
                              } else {
                                db.query(`SELECT * FROM users WHERE email=?`, [post.email], function(error, loginUser) {
                                    const user = {id:loginUser[0].id, email:post.email, password:hash, displayName:post.displayName};
                                    request.login(user, function(error) {   //회원가입후 바로 로그인이 됨
                                        if(error) {
                                            next(error);
                                        } else {
                                            response.redirect(`/`);
                                        }
                                    });
                                });
                              }
                            });
                        });
                    } else {
                        request.flash('error', 'Password must be the same.');
                        response.redirect('/login/register');   
                    }
                } else {
                    request.flash('error', 'The same email already exists.');
                    response.redirect('/login/register');
                }
            }
        });
      });

    return router;
}