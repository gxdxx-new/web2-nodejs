const db = require('../lib/db.js');
const template = require('../lib/template.js');
const auth = require('../lib/auth.js');
const express = require('express');
const router = express.Router();

router.get('*', (request, response, next) => {
  db.query(`SELECT * FROM topic`, (error, topics) => {
    if(error) {
        next(error);
    } else {
      request.list = topics;
      next();
    }
  });
});

router.get('/', (request, response) => { //routing
      const fmsg = request.flash();
      let feedback = '';
      if(fmsg.success) {
        feedback = fmsg.success[0];
      } else if(fmsg.error) {
        feedback = fmsg.error[0];
      }
      const title = 'Welcome';
      const description = '돈 많이 벌고싶다.';
      const list = template.list(request.list);
      const html = template.HTML(title, list,
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