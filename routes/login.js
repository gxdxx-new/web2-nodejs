var template = require('../lib/template.js');
var auth = require('../lib/auth.js');
var express = require('express');
var router = express.Router();

//app.get('/', (req, res) => res.send('Hello World!'))
router.get('/', function(request, response) { //routing
    var title = 'Login';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `
        <form action="/login/login_process" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="submit"></p>
        </form>
        `,
        `<a href="/topic/create">create</a>`, ///create로 이동, home에서는 update 버튼 안나오게
        auth.authStatusUI(request, response)
    );
    response.send(html);
});

router.post('/login_process', function(request, response) {
    var post = request.body;
    if(post.email === 'nkd0310@naver.com' && post.password === '000000') {
        response.cookie('email', `${post.email}`);
        response.cookie('password', `${post.password}`);
        response.cookie('nickname', 'gidon');
        response.redirect('/');
    } else {
        response.send('Who?');
    }
});

router.get('/logout_process', function(request, response) {
    if(auth.authIsOwner(request, response) === false) {
        response.send('Login require!!!');
        return false;
      }
    response.cookie('email', ``, {maxAge: 0});
    response.cookie('password', ``, {maxAge: 0});
    response.cookie('nickname', '', {maxAge: 0});
    response.redirect('/');
});

module.exports = router;