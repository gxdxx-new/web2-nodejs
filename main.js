var http = require('http');
var fs = require('fs'); //node.js의 모듈인 fileSystem을 다룰 수 있게됨
var url = require('url'); //모듈
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path'); //경로를 탐색해 나갈 수 있는 정보를 숨겨줌(외부에서 들어온 정보, 외부에서 들어온 정보가 바깥으로 나갈 때)

//createServer은 Nodejs로 웹브라우저가 접속이 들어올 때마다 callback함수를 Nodejs가 호출
//request(요청할 때 웹브라우저가 보낸 정보들), response(응답할 때 우리가 웹브라우저에게 전송할 정보들)
var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/') {
      if(queryData.id === undefined) {  //id값이 없는 경우
        //`./data`디렉토리에 있는 파일 목록을 가져옴. filelist에는 data디렉토리의 파일명들이 들어옴
        fs.readdir('./data', function(error, filelist) {
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>` //home에서는 update 버튼 안나오게, /create로 이동
          );
          response.writeHead(200);  //파일을 성공적으로 전송
          response.end(html); //template을 보여줌
        });
      } else {  //id값이 있는 경우
        //`./data`디렉토리에 있는 파일 목록을 가져옴. filelist에는 data디렉토리의 파일명들이 들어옴
        fs.readdir('./data', function(error, filelist) {
          var filteredId = path.parse(queryData.id).base; //queryData.id(경로정보)를 path.parse에 넣어서 정보를 숨김
          //`data/${queryData.id}` 파일의 내용을 읽어서 description변수에 저장
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
            var title = queryData.id;
            var list = template.list(filelist);
            var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${title}">update</a>
                <form action="/delete_process" method="post">  <!--delete링크는 알려지면 안돼서 form으로 해야됨-->
                  <input type="hidden" name="id" value="${title}">
                  <input type="submit" value="delete">  <!--delete란 이름의 버튼 생성-->
                </form>`
            );
            response.writeHead(200);  //파일을 성공적으로 전송
            response.end(html); //template을 보여줌
          });
        });
      }
    } else if(pathname === '/create') { //create버튼을 클릭하면 입력 상자가 생김
      //`./data`디렉토리에 있는 파일 목록을 가져옴. filelist에는 data디렉토리의 파일명들이 들어옴
      fs.readdir('./data', function(error, filelist) {
        var title = 'WEB - create';
        var list = template.list(filelist);
        var html = template.HTML(title, list, `
          <form action="/create_process" method="post">  <!--form 아래 입력한 정보를 주소로 전송-->
            <p><input type="text" name="title" placeholder="title"></p>  <!--한줄 입력, placeholder는 미리 보이는 문자-->
            <p>
              <textarea name="description" placeholder="description"></textarea>  <!--여러줄 입력-->
            </p>
            <p>
              <input type="submit"> <!--전송버튼-->
            </p>
          </form>
          `, '');
        response.writeHead(200);  //파일을 성공적으로 전송
        response.end(html); //template을 보여줌
      });
    } else if(pathname === '/create_process') { //입력상자에 입력을 다 하고 create버튼을 클릭하면 /create_process로 이동
      var body = '';
      request.on('data', function(data) { //data를 한개씩 받다가 마지막에 'end'다음의 callback함수를 호출
        body += data; //웹브라우저가 보낸 정보들을 저장
      });
      request.on('end', function() {
        var post = qs.parse(body);  //post변수에 post정보를 저장(querystring)
        var title = post.title;
        var description = post.description;
        //파일을 저장(`data/${title}`은 생성할 파일, description은 저장할 내용
        fs.writeFile(`data/${title}`, description, 'utf8', function(err) {  //err:에러가 있을 경우 에러를 처리하는 방법을 제공
          response.writeHead(302, {Location: `/?id=${title}`});  //리다이렉션(Location으로 이동)
          response.end();
        });
      });
    } else if(pathname === '/update') {
      //`./data`디렉토리에 있는 파일 목록을 가져옴. filelist에는 data디렉토리의 파일명들이 들어옴
      fs.readdir('./data', function(error, filelist) {
        var filteredId = path.parse(queryData.id).base; //queryData.id(경로정보)를 path.parse에 넣어서 정보를 숨김
        //`data/${queryData.id}` 파일의 내용을 읽어서 description변수에 저장
        fs.readFile(`data/${filteresId}`, 'utf8', function(err, description) {
          var title = queryData.id;
          var list = template.list(filelist);
          var html = template.HTML(title, list, `
            <form action="/update_process" method="post">  <!--form 아래 입력한 정보를 주소로 전송-->
              <input type ="hidden" name="id" value="${title}">  <!--id값은 변경되지않음.-->
              <p><input type="text" name="title" value="${title}"></p>  <!--한줄 입력, value="${title}가 title에 기본값으로 들어오게 함"-->
              <p>
                <textarea name="description">${description}</textarea>  <!--여러줄 입력-->
              </p>
              <p>
                <input type="submit"> <!--전송버튼-->
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
          response.writeHead(200);  //파일을 성공적으로 전송
          response.end(html); //template을 보여줌
        });
      });
    } else if(pathname === '/update_process') {
      var body = '';
      request.on('data', function(data) { //data를 한개씩 받다가 마지막에 'end'다음의 callback함수를 호출
        body += data; //웹브라우저가 보낸 정보들을 저장
      });
      request.on('end', function() {
        var post = qs.parse(body);  //post변수에 post정보를 저장(querystring)
        var id = post.id; //수정할 때는 id값이 필요
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(error) { //fs.rename(oldPath, newPath, callback)
          //파일을 저장 (`data/${title}`은 생성할 파일, description은 저장할 내용)
          fs.writeFile(`data/${title}`, description, 'utf8', function(err) {  //err:에러가 있을 경우 에러를 처리하는 방법을 제공
            response.writeHead(302, {Location: `/?id=${title}`});  //리다이렉션(Location으로 이동)
            response.end();
          });
        });
      });
    } else if(pathname === '/delete_process') {
      var body = '';
      request.on('data', function(data) { //data를 한개씩 받다가 마지막에 'end'다음의 callback함수를 호출
        body += data; //웹브라우저가 보낸 정보들을 저장
      });
      request.on('end', function() {
        var post = qs.parse(body);  //post변수에 post정보를 저장(querystring)
        var id = post.id; //삭제할 때는 id만 전송됨
        var filteredId = path.parse(id).base; //post.id(경로정보)를 path.parse에 넣어서 정보를 숨김
        fs.unlink(`data/${filteredId}`, function(error) {
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
