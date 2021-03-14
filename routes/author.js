var db = require('../lib/db.js');
var template = require('../lib/template.js');
var auth = require('../lib/auth.js');
var sanitizeHtml = require('sanitize-html');
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

router.get('/', function(request, response, next) {
    db.query(`SELECT * FROM author`, function(error, authors) {
        if(error) {
            next(error);
        } else {
            var title = 'author';
            var list = template.list(request.list);
            var html = template.HTML(title, list, 
                `
                ${template.authorTable(authors)}
                <style>                            <!--CSS-->
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border:1px solid black;
                    }
                </style>
                <form action="/author/create_process" method="post">
                    <p>
                        <input type="text" name="name" placeholder="name">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit" value="create">
                    </p>
                </form>
                `,
                ``,
                auth.authStatusUI(request, response)
            );
            response.send(html);
        }
    });
});

router.post('/create_process', function(request, response, next) {
    var post = request.body;
    db.query(`INSERT INTO author (name, profile) VALUES(?, ?);`, [post.name, post.profile], function(error, result) {
        if(error) {
            next(error);
        } else {
            response.redirect('/author');
        }
    });
});

router.get('/update/:pageId', function(request, response, next) {
    db.query(`SELECT * FROM topic`, function(error, topics) {  //callback:sql문이 실행된 후에 서버가 응답한 결과를 처리해줌
        if(error) {
            next(error);
        } else {
            db.query(`SELECT * FROM author`, function(error2, authors) {
                if(error2) {
                    next(error2);
                } else {
                    db.query(`SELECT * FROM author WHERE id=?`, [request.params.pageId], function(error3, author) {
                        if(error3) {
                            next(error);
                        } else {
                            var title = 'author';
                            var list = template.list(topics);
                            var html = template.HTML(title, list, 
                                `
                                ${template.authorTable(authors)}
                                <style>                            <!--CSS-->
                                    table{
                                        border-collapse: collapse;
                                    }
                                    td{
                                        border:1px solid black;
                                    }
                                </style>
                                <form action="/author/update_process" method="post">
                                    <p>
                                        <input type="hidden" name="id" value="${request.params.pageId}">
                                    </p>
                                    <p>
                                        <input type="text" name="name" value=${sanitizeHtml(author[0].name)}> <!--value:기본으로 들어간 값, placeholder:투명글씨로 들어간 값-->
                                    </p>
                                    <p>
                                        <textarea name="profile">${sanitizeHtml(author[0].profile)}</textarea>
                                    </p>
                                    <p>
                                        <input type="submit" value="update">
                                    </p>
                                </form>
                                `,
                                ``,
                                auth.authStatusUI(request, response)
                            );
                            response.send(html);
                        }
                    });
                }
            });
        }
    });
});

router.post('/update_process', function(request, response, next) {
    var post = request.body;
    db.query(`UPDATE author SET name=?, profile=? WHERE id=?;`, [post.name, post.profile, post.id], function(error, result){
        if(error) {
            next(error);
        } else {
            response.redirect('/author');
        }
    });
})

router.post('/delete_process', function(request, response, next) {
    var post = request.body;
    db.query(`DELETE FROM topic WHERE author_id=?`, [post.id], function(error1, result1) {    //author을 삭제 전에 author가 쓴 topic들부터 지우게함
        if(error1) {
            next(error1);
        } else {
            db.query(`DELETE FROM author WHERE id=?`, [post.id], function(error2, result2 ) {  //삭제할 때는 id만 전송됨
                if(error2) {
                    next(error2);
                } else {
                    response.redirect('/author');
                }
            });
        }
    });
});

module.exports = router;