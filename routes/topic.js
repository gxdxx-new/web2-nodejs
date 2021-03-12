var db = require('../lib/db.js');
var topic = require('../lib/topic.js');
var express = require('express');
var router = express.Router();

router.get('/create', function(request, response) {
    topic.create(request, response);
  });
  
router.post('/create_process', function(request, response) { //topic.create에서 post방식으로 전송됨
  topic.create_process(request, response);
});
  
router.get('/update/:pageId', function(request, response) {
  topic.update(request, response);
});
  
router.post('/update_process', function(request, response) {
  topic.update_process(request, response);
})
  
router.post('/delete_process', function(request, response) {
  topic.delete_process(request, response);
})
  
router.get('/:pageId', function(request, response, next) { //routing
  db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [request.params.pageId], function(error, topic1) { //보안을 위해 sql문에 ?로 두번째 인자가 치환되도록 함(?은 문자가 돼서 DROP문을 입력해도 문자로 처리해서 공격을 막을 수 있음)
    if(error) {
        next(error);
    } else{
      try {
      topic.page(request, response, topic1);
      //response.send(request.params);  //request.params => :pageId에 들어있는 값
      } catch(error) {
        if(error) {
          console.log('error occuered!')
          next(error);
        }   
      }
    }
  });
});

module.exports = router;