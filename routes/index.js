var db = require('../lib/db.js');
var template = require('../lib/template.js');
var express = require('express');
var router = express.Router();

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
        `<a href="/topic/create">create</a>` ///create로 이동, home에서는 update 버튼 안나오게
    );
    response.send(html);
    topic.home(request, response);
});

module.exports = router;