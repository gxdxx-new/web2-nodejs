var template = require('../lib/template.js');
var auth = require('../lib/auth.js');
var express = require('express');
var router = express.Router();

module.exports = function(passport) {
    router.get('/', function(request, response) { //routing
        var fmsg = request.flash();
        var feedback = '';
        if(fmsg.error) {
            feedback = fmsg.error[0];
        }
        var title = 'WEB - Login';
        var list = template.list(request.list);
        var html = template.HTML(title, list,
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
        var fmsg = request.flash();
        var feedback = '';
        if(fmsg.error) {
            feedback = fmsg.error[0];
        }
        var title = 'WEB - Login';
        var list = template.list(request.list);
        var html = template.HTML(title, list,
            `
                <div style="color:red;">${feedback}</div>
                <form action="/login/register_process" method="post">
                    <p><input type="text" name="email" placeholder="email"></p>
                    <p><input type="password" name="password1" placeholder="password"></p>
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

    return router;
}