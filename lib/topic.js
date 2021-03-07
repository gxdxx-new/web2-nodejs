var db = require('./db');
var template = require('./template.js');
var url = require('url'); //모듈
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

exports.home = function(request, response){   //exports : 여러 API를 제공 가능
    db.query(`SELECT * FROM topic`, function(error, topics){  //callback:sql문이 실행된 후에 서버가 응답한 결과를 처리해줌
        if(error) throw error;
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>
          ${description}`,
          `<a href="/create">create</a>` ///create로 이동, home에서는 update 버튼 안나오게
        );
        response.writeHead(200);
        response.end(html);
    });
};

exports.page = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT * FROM topic`, function(error, topics){  //callback:sql문이 실행된 후에 서버가 응답한 결과를 처리해줌
    if(error) throw error;  //error가 있으면 그다음 코드를 실행하지 않음
    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(error2, topic){ //보안을 위해 sql문에 ?로 두번째 인자가 치환되도록 함(?은 문자가 돼서 DROP문을 입력해도 문자로 처리해서 공격을 막을 수 있음)
      if(error2) throw error2;
      var title = topic[0].title; //topic은 배열에 담겨서 들어옴
      var description = topic[0].description;
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `<h2>${sanitizeHtml(title)}</h2>
        ${sanitizeHtml(description)}
        <p>by ${sanitizeHtml(topic[0].name)}</p>`,  //<p>태그=줄바꿈
        ` <a href="/create">create</a>
          <a href="/update?id=${queryData.id}">update</a>
          <form action="/delete_process" method="post">  <!--delete링크는 알려지면 안돼서 form으로 해야됨-->
            <input type="hidden" name="id" value="${queryData.id}">
            <input type="submit" value="delete">  <!--delete란 이름의 버튼 생성-->
          </form>`
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create = function(request, response){
  db.query(`SELECT * FROM topic`, function(error, topics){  //callback:sql문이 실행된 후에 서버가 응답한 결과를 처리해줌
    if(error) throw error;
    db.query(`SELECT * FROM author`, function(error2, authors){
      if(error2) throw error2;
      var title = 'Create';
      var list = template.list(topics);
      var html = template.HTML(sanitizeHtml(title), list,
        `<form action="/create_process" method="post">  <!--form 아래 입력한 정보를 주소로 전송-->
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
        `<a href="/create">create</a>` //home에서는 update 버튼 안나오게, /create로 이동
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_process = function(request, response){
  var body = '';
  request.on('data', function(data) { //data를 한개씩 받다가 마지막에 'end'다음의 callback함수를 호출
    body += data; //웹브라우저가 보낸 정보들을 저장
  });
  request.on('end', function() {
    var post = qs.parse(body);  //post변수에 post정보를 저장(querystring)
    db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?);`, 
        [post.title, post.description, post.author], 
        function(error, result){
          if(error) throw error;
          response.writeHead(302, {Location: `/?id=${result.insertId}`});
          response.end();
        }
    );
  });
};

exports.update = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error) throw error;
    db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error2, topic){
      if(error2) throw error2;
      db.query(`SELECT * FROM author`, function(error3, authors){
        if(error3) throw error3;
        var list = template.list(topics);
        var html = template.HTML(sanitizeHtml(topic[0].title), list,
          `
          <form action="/update_process" method="post">  <!--form 아래 입력한 정보를 주소로 전송-->
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
          `<a href="/create">create</a>
           <a href="/update?id=${topic[0].id}">update</a>`
        );
        response.writeHead(200);  //파일을 성공적으로 전송
        response.end(html); //template을 보여줌
      });
    });
  });
};

exports.update_process = function(request, response){
  var body = '';
      request.on('data', function(data) { //data를 한개씩 받다가 마지막에 'end'다음의 callback함수를 호출
        body += data; //웹브라우저가 보낸 정보들을 저장
      });
      request.on('end', function() {
        var post = qs.parse(body);  //post변수에 post정보를 저장(querystring)
        db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, [post.title, post.description, post.author, post.id], function(error, result){
          response.writeHead(302, {Location: `/?id=${post.id}`});  //리다이렉션(Location으로 이동)
          response.end();
        });
      });
};

exports.delete_process = function(request, response){
  var body = '';
      request.on('data', function(data) { //data를 한개씩 받다가 마지막에 'end'다음의 callback함수를 호출
        body += data; //웹브라우저가 보낸 정보들을 저장
      });
      request.on('end', function() {
        var post = qs.parse(body);  //post변수에 post정보를 저장(querystring)
        db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(error, result){  //삭제할 때는 id만 전송됨
          if(error) throw error;
          response.writeHead(302, {Location: `/`});  //리다이렉션(Location으로 이동): home으로 이동
          response.end();
        });
      });
}