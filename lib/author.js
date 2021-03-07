var db = require('./db');
var template = require('./template.js');
var url = require('url'); //모듈
var qs = require('querystring');

exports.home = function(request, response) {
    db.query(`SELECT * FROM topic`, function(error, topics){  //callback:sql문이 실행된 후에 서버가 응답한 결과를 처리해줌
        if(error) throw error;
        db.query(`SELECT * FROM author`, function(error2, authors){
            if(error2) throw error2;

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
                `` ///create로 이동, home에서는 update 버튼 안나오게
            );
            response.writeHead(200);
            response.end(html); 
        });
    });
};

exports.create_process = function(request, response) {
    var body = '';
    request.on('data', function(data) { //data를 한개씩 받다가 마지막에 'end'다음의 callback함수를 호출
      body += data; //웹브라우저가 보낸 정보들을 저장
    });
    request.on('end', function() {
      var post = qs.parse(body);  //post변수에 post정보를 저장(querystring)
      db.query(`INSERT INTO author (name, profile) VALUES(?, ?);`, 
          [post.name, post.profile], 
          function(error, result){
            if(error) throw error;
            response.writeHead(302, {Location: `/author`});
            response.end();
          }
      );
    });
}

exports.update = function(request, response) {
    db.query(`SELECT * FROM topic`, function(error, topics) {  //callback:sql문이 실행된 후에 서버가 응답한 결과를 처리해줌
        if(error) throw error;
        db.query(`SELECT * FROM author`, function(error2, authors) {
            if(error2) throw error2;
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function(error3, author) {
                if(error3) throw error3;
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
                            <input type="hidden" name="id" value="${queryData.id}">
                        </p>
                        <p>
                            <input type="text" name="name" value=${author[0].name}> <!--value:기본으로 들어간 값, placeholder:투명글씨로 들어간 값-->
                        </p>
                        <p>
                            <textarea name="profile">${author[0].profile}</textarea>
                        </p>
                        <p>
                            <input type="submit" value="update">
                        </p>
                        </form>
                    `,
                    `` ///create로 이동, home에서는 update 버튼 안나오게
                );
                response.writeHead(200);
                response.end(html); 
            });
        });
    });
};

exports.update_process = function(request, response) {
    var body = '';
    request.on('data', function(data) { //data를 한개씩 받다가 마지막에 'end'다음의 callback함수를 호출
      body += data; //웹브라우저가 보낸 정보들을 저장
    });
    request.on('end', function() {
      var post = qs.parse(body);  //post변수에 post정보를 저장(querystring)
      db.query(`UPDATE author SET name=?, profile=? WHERE id=?;`, 
          [post.name, post.profile, post.id], 
          function(error, result){
            if(error) throw error;
            response.writeHead(302, {Location: `/author`});
            response.end();
          }
      );
    });
}

exports.delete_process = function(request, response){
    var body = '';
        request.on('data', function(data) { //data를 한개씩 받다가 마지막에 'end'다음의 callback함수를 호출
          body += data; //웹브라우저가 보낸 정보들을 저장
        });
        request.on('end', function() {
          var post = qs.parse(body);  //post변수에 post정보를 저장(querystring)
          db.query(`DELETE FROM topic WHERE author_id=?`, [post.id], function(error1, result1) {    //author을 삭제 전에 author가 쓴 topic들부터 지우게함
            if(error1) throw error1;
            db.query(`DELETE FROM author WHERE id=?`, [post.id], function(error2, result2){  //삭제할 때는 id만 전송됨
                if(error2) throw error;
                response.writeHead(302, {Location: `/author`});  //리다이렉션(Location으로 이동): home으로 이동
                response.end();
            });
          });
        });
}