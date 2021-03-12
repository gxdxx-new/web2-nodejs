var db = require('../lib/db.js');
var template = require('../lib/template.js');
var sanitizeHtml = require('sanitize-html');
var express = require('express');
var router = express.Router();

router.get('/create', function(request, response) {
    db.query(`SELECT * FROM author`, function(error, authors) {
        if(error) throw error;
        var title = 'Create';
        var list = template.list(request.list);
        var html = template.HTML(title, list,
          `<form action="/topic/create_process" method="post">  <!--form 아래 입력한 정보를 주소로 전송-->
            <p>
              <input type="text" name="title" placeholder="title">  <!--한줄 입력, placeholder는 미리 보이는 문자-->
            </p>
            <p>
              <textarea name="description" placeholder="description"></textarea>  <!--여러줄 입력-->
            </p>
            <p>
              ${template.authorSelect(authors)} <!--author을 선택할 수 있는 option value-->
            </p>
            <p>
              <input type="submit"> <!--전송버튼-->
            </p>
          </form>`,
          `<a href="/topic/create">create</a>`
        );
        response.send(html);
    });
});
  
router.post('/create_process', function(request, response) { //topic.create에서 post방식으로 전송됨
    var post = request.body;
    db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?);`, 
        [post.title, post.description, post.author], 
        function(error, result) {
          if(error) throw error;
          response.redirect(`/topic/${result.insertId}`);
        }
    );
});
  
router.get('/update/:pageId', function(request, response) {
    db.query(`SELECT * FROM topic WHERE id=?`, [request.params.pageId], function(error, topic) {
        if(error) throw error;
        db.query(`SELECT * FROM author`, function(error2, authors) {
          if(error2) throw error2;
          var list = template.list(request.list);
          var html = template.HTML(sanitizeHtml(topic[0].title), list,
            `
            <form action="/topic/update_process" method="post">  <!--form 아래 입력한 정보를 주소로 전송-->
              <input type ="hidden" name="id" value="${topic[0].id}">  <!--id값은 변경되지않음.-->
              <p><input type="text" name="title" value="${sanitizeHtml(topic[0].title)}"></p>  <!--한줄 입력, value="${topic[0].title}가 title에 기본값으로 들어오게 함"-->
              <p>
                <textarea name="description">${sanitizeHtml(topic[0].description)}</textarea>  <!--여러줄 입력-->
              </p>
              <p>
                ${template.authorSelect(authors, topic[0].author_id)}
              </p>
              <p>
                <input type="submit"> <!--전송버튼-->
              </p>
            </form>
            `,
            `<a href="/topic/create">create</a>
             <a href="/topic/update/${topic[0].id}">update</a>`
          );
          response.send(html);
        });
    });
});
  
router.post('/update_process', function(request, response) {
    var post = request.body;
    db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
      [post.title, post.description, post.author, post.id],
      function(error, result) {
      if(error) throw error;
      response.redirect(`/topic/${post.id}`);
    });
})
  
router.post('/delete_process', function(request, response) {
    var post = request.body;
    db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(error, result) {  //삭제할 때는 id만 전송됨
      if(error) throw error;
      response.redirect('/');
    });
})
  
router.get('/:pageId', function(request, response, next) { //routing
    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [request.params.pageId], function(error, topic) { //보안을 위해 sql문에 ?로 두번째 인자가 치환되도록 함(?은 문자가 돼서 DROP문을 입력해도 문자로 처리해서 공격을 막을 수 있음)
        if(error) {
            next(error);
        } else {
            var title = topic[0].title; //topic은 배열에 담겨서 들어옴
            var description = topic[0].description;
            var list = template.list(request.list);
            var html = template.HTML(title, list,
                `<h2>${sanitizeHtml(title)}</h2>
                ${sanitizeHtml(description)}
                <p>by ${sanitizeHtml(topic[0].name)}</p>`,  //<p>태그=줄바꿈
                `
                <a href="/topic/create">create</a>
                <a href="/topic/update/${request.params.pageId}">update</a>
                <form action="/topic/delete_process" method="post">  <!--delete링크는 알려지면 안돼서 form으로 해야됨-->
                <input type="hidden" name="id" value="${request.params.pageId}">
                <input type="submit" value="delete">  <!--delete란 이름의 버튼 생성-->
                </form>
                `
            );
            response.send(html);
        }
    });
});

module.exports = router;