var http = require('http');
var url = require('url'); //모듈
var qs = require('querystring');
var template = require('./lib/template.js');
var db = require('./lib/db.js');
var topic = require('./lib/topic.js');

//createServer은 Nodejs로 웹브라우저가 접속이 들어올 때마다 callback함수를 Nodejs가 호출
//request(요청할 때 웹브라우저가 보낸 정보들), response(응답할 때 우리가 웹브라우저에게 전송할 정보들)
var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/') {
      if(queryData.id === undefined) {  //id값이 없는 경우(홈 화면)
        topic.home(request, response); //request, response를 전달
      } else {  //id값이 있는 경우
        topic.page(request, response);
      }
    } else if(pathname === '/create') { //create버튼을 클릭하면 입력 상자가 생김
      topic.create(request, response);
    } else if(pathname === '/create_process') { //입력상자에 입력을 다 하고 create버튼을 클릭하면 /create_process로 이동
      topic.create_process(request, response);
    } else if(pathname === '/update') {
      db.query(`SELECT * FROM topic`, function(error, topics){
        if(error) throw error;
        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error2, topic){
          if(error2) throw error2;
          db.query(`SELECT * FROM author`, function(error3, authors){
            if(error3) throw error3;
            var list = template.list(topics);
            var html = template.HTML(topic[0].title, list,
              `
              <form action="/update_process" method="post">  <!--form 아래 입력한 정보를 주소로 전송-->
                <input type ="hidden" name="id" value="${topic[0].id}">  <!--id값은 변경되지않음.-->
                <p><input type="text" name="title" value="${topic[0].title}"></p>  <!--한줄 입력, value="${topic[0].title}가 title에 기본값으로 들어오게 함"-->
                <p>
                  <textarea name="description">${topic[0].description}</textarea>  <!--여러줄 입력-->
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
    } else if(pathname === '/update_process') {
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
    } else if(pathname === '/delete_process') {
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
    } else {
        response.writeHead(404);  //파일을 찾을 수 없음
        response.end('Not found');  //Not found을 보여줌
      }
  });

app.listen(3000); //localhost:3000
