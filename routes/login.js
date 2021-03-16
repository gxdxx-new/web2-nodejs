var template = require('../lib/template.js');
var auth = require('../lib/auth.js');
var express = require('express');
var router = express.Router();

//app.get('/', (req, res) => res.send('Hello World!'))
router.get('/', function(request, response) { //routing
    var title = 'WEB - Login';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `
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

router.post('/login_process', function(request, response) {
    var post = request.body;
    if(post.email === 'nkd0310@naver.com' && post.password === '000000') {
        request.session.is_logined = true;
        request.session.nickname = 'gidon'; //나중에 메모리에 저장된 세션 데이터를 저장소에 반영하는 작업을 함
        request.session.save(function() { //세션 데이터를 즉시 반영
            response.redirect('/');
        });
    } else {
        response.send('Who?');
    }
});

router.get('/logout_process', function(request, response) {
    if(auth.isOwner(request, response) === false) {
        response.redirect('/');
        return false;
    }
    request.session.destroy(function(error) {
        response.redirect('/');
    })
});

module.exports = router;