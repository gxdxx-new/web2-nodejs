var db = require('../lib/db.js');
var template = require('../lib/template.js');
var auth = require('../lib/auth.js');
var express = require('express');
var router = express.Router();

router.get('*', function(request, response, next) {  //get 방식으로 들어오는 모든(*) 요청에 대해서만 처리
    db.query(`SELECT * FROM topic`, function(error, topics) {
      if(error) {
          next(error);
      } else {
        request.list = topics;
        next(); //다음에 실행되어야 할 미들웨어를 실행할지를 이전 미들웨어가 결정
      }
    });
});

//app.get('/', (req, res) => res.send('Hello World!'))
router.get('/', function(request, response) { //routing
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `<h2>${title}</h2>
        ${description}
        <img src="/images/hello.jpg" style="width:800px; display:block; margin-top:20px;">
        `,
        `<a href="/topic/create">create</a>`, ///create로 이동, home에서는 update 버튼 안나오게
        auth.statusUI(request, response)
    );
    response.send(html);
});

module.exports = router;