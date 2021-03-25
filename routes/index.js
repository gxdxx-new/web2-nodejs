var db = require('../lib/db.js');
var template = require('../lib/template.js');
var auth = require('../lib/auth.js');
var express = require('express');
var router = express.Router();

router.get('*', function(request, response, next) {
  db.query(`SELECT * FROM topic`, function(error, topics) {
    if(error) {
        next(error);
    } else {
      request.list = topics;
      next();
    }
  });
});

router.get('/', function(request, response) { //routing
      var fmsg = request.flash();
      var feedback = '';
      if(fmsg.success) {
        feedback = fmsg.success[0];
      } else if(fmsg.error) {
        feedback = fmsg.error[0];
      }
      var title = 'Welcome';
      var description = '돈 많이 벌고싶다.';
      var list = template.list(request.list);
      var html = template.HTML(title, list,
          `
            <div style="color:blue;">${feedback}</div>
            <h2>${title}</h2>
            ${description}
            <img src="/images/hello.jpg" style="width:800px; display:block; margin-top:20px;">
          `,
          `<a href="/topic/create">create</a>`,
          auth.statusUI(request, response)
      );
      response.send(html);
});

module.exports = router;