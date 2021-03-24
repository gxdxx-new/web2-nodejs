var db = require('../lib/db.js');
var template = require('../lib/template.js');
var auth = require('../lib/auth.js');
var sanitizeHtml = require('sanitize-html');
var express = require('express');
var router = express.Router();

router.get('*', function(request, response, next) {  //get 방식으로 들어오는 모든(*) 요청에 대해서만 처리
  if(auth.isOwner(request, response) === false) {
    response.redirect('/');
    return false;
  }  
  db.query(`SELECT * FROM topic`, function(error, topics) {
    if(error) {
      next(error);
    } else {
      request.list = topics;
      next(); //다음에 실행되어야 할 미들웨어를 실행할지를 이전 미들웨어가 결정
    }
  });
});

router.post('*', function(request, response, next) {
  if(auth.isOwner(request, response) === false) {
    response.redirect('/');
    return false;
  }
  next();
});

router.get('/create', function(request, response, next) {
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
              <input type="submit"> <!--전송버튼-->
            </p>
          </form>`,
          `<a href="/topic/create">create</a>`,
          auth.statusUI(request, response)
        );
        response.send(html);
});
  
router.post('/create_process', function(request, response, next) { //topic.create에서 post방식으로 전송됨
  var post = request.body;
  db.query(`SELECT * FROM users WHERE id=?`, [request.user.id], function(error, user1) {
    if(error) {
      next(error);
    } else {
      db.query(`INSERT INTO topic (title, description, created, user_id) VALUES(?, ?, NOW(), ?);`, 
        [post.title, post.description, user1[0].id], 
        function(error, result) {
          if(error) {
            next(error);
          } else {
            response.redirect(`/topic/${result.insertId}`);
          }
      });
    }
  });
});
  
router.get('/update/:pageId', function(request, response, next) {
  db.query(`SELECT * FROM topic WHERE id=?`, [request.params.pageId], function(error, topic) {
    if(error) {
      next(error);
    } else {
      if(parseInt(topic[0].user_id) !== parseInt(request.user.id)) {
        request.flash('error', 'Not yours.');
        return response.redirect('/');
      }
      var list = template.list(request.list);
      var html = template.HTML(sanitizeHtml(topic[0].title), list,
        `
        <form action="/topic/update_process" method="post">
          <input type ="hidden" name="id" value="${topic[0].id}">
          <p><input type="text" name="title" value="${sanitizeHtml(topic[0].title)}"></p>
          <textarea name="description">${sanitizeHtml(topic[0].description)}</textarea>
          <p><input type="submit"></p>
        </form>
        `,
        `<a href="/topic/create">create</a>
          <a href="/topic/update/${topic[0].id}">update</a>`,
          auth.statusUI(request, response)
      );
      response.send(html);
    }
  });
});
  
router.post('/update_process', function(request, response, next) {
  var post = request.body;
  db.query(`SELECT * FROM topic WHERE id=?`, [post.id], function(error, topic) {
    if(error) {
      next(error);
    } else {
      if(parseInt(topic[0].user_id) !== parseInt(request.user.id)) {
        request.flash('error', 'Not yours.');
        return response.redirect('/');
      }
      db.query(`UPDATE topic SET title=?, description=? WHERE id=?`, [post.title, post.description, post.id], function(error, result) {
        if(error) {
          next(error);
        } else {
          response.redirect(`/topic/${topic[0].id}`);
        }
      });
    }
  });
});
  
router.post('/delete_process', function(request, response, next) {
  var post = request.body;
  db.query(`SELECT * FROM topic WHERE id=?`, [post.id], function(error, topic) {
    if(error) {
      next(error);
    } else {
      if(parseInt(topic[0].user_id) !== parseInt(request.user.id)) {
        request.flash('error', 'Not yours.');
        return response.redirect('/');
      }
      db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(error, result) {  //삭제할 때는 id만 전송됨
        if(error) {
          next(error);
        } else {
          response.redirect('/');
        }
      });
    }
  });
});

// db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [request.params.pageId], function(error, topic)
router.get('/:pageId', function(request, response, next) { //routing
  db.query(`SELECT * FROM topic WHERE id=?`, [request.params.pageId], function(error, topic) { //보안을 위해 sql문에 ?로 두번째 인자가 치환되도록 함(?은 문자가 돼서 DROP문을 입력해도 문자로 처리해서 공격을 막을 수 있음)
    if(error) {
      next(error);
    } else {
      db.query(`SELECT * FROM users WHERE id=?`, [topic[0].user_id], function(error, user) {
        if(error) {
          next(error);
        } else {
          var title = topic[0].title; //topic은 배열에 담겨서 들어옴
          var description = topic[0].description;
          var list = template.list(request.list);
          var html = template.HTML(title, list,
            `<h2>${sanitizeHtml(title)}</h2>
            ${sanitizeHtml(description)}
            <p>by ${sanitizeHtml(user[0].displayName)}</p>`,  //<p>태그=줄바꿈
            `
              <a href="/topic/create">create</a>
              <a href="/topic/update/${request.params.pageId}">update</a>
              <form action="/topic/delete_process" method="post">  <!--delete링크는 알려지면 안돼서 form으로 해야됨-->
                <input type="hidden" name="id" value="${request.params.pageId}">
                <input type="submit" value="delete">  <!--delete란 이름의 버튼 생성-->
              </form>
             `,
             auth.statusUI(request, response)
          );
          response.send(html);
        }
      });
    }
  });
});

module.exports = router;