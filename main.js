var http = require('http');
var fs = require('fs'); //node.js의 모듈인 fileSystem을 다룰 수 있게됨
var url = require('url'); //모듈

function templateHTML(title, list, body) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist) {
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length) {
    //앞 filelist[i]는 링크를 위해, 뒤 filslist[i]는 보여지는 값
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i++;
  }
  list += '</ul>';
  return list;
  /*
  var list = `<ul>
    <li><a href="/?id=HTML">HTML</a></li>
    <li><a href="/?id=CSS">CSS</a></li>
    <li><a href="/?id=JavaScript">JavaScript</a></li>
  </ul>`;
  */
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/') {
      if(queryData.id === undefined) {  //id값이 없는 경우
        //`./data`디렉토리에 있는 파일 목록을 가져옴. filelist에는 data디렉토리의 파일명들이 들어옴
        fs.readdir('./data', function(error, filelist) {
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
          response.writeHead(200);  //파일을 성공적으로 전송
          response.end(template); //template을 보여줌
        });
      } else {  //id값이 있는 경우
        //`./data`디렉토리에 있는 파일 목록을 가져옴. filelist에는 data디렉토리의 파일명들이 들어옴
        fs.readdir('./data', function(error, filelist) {
          //`data/${queryData.id}` 파일의 내용을 읽어서 description변수에 저장
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
            response.writeHead(200);  //파일을 성공적으로 전송
            response.end(template); //template을 보여줌
          });
        });
      }
    } else if(pathname === '/create') {
      //`./data`디렉토리에 있는 파일 목록을 가져옴. filelist에는 data디렉토리의 파일명들이 들어옴
      fs.readdir('./data', function(error, filelist) {
        var title = 'WEB - create';
        var list = templateList(filelist);
        var template = templateHTML(title, list, `
          <form action="http://localhost:3000/process_create" method="post">  <!--form 아래 입력한 정보를 주소로 전송-->
            <p><input type="text" name="title" placeholder="title"></p>  <!--한줄 입력-->
            <p>
              <textarea name="description" placeholder="description"></textarea> <!--여러줄 입력-->
            </p>
            <p>
              <input type="submit"> <!--전송버튼-->
            </p>
          </form>
          `);
        response.writeHead(200);  //파일을 성공적으로 전송
        response.end(template); //template을 보여줌
      });
    } else {
        response.writeHead(400);  //파일을 찾을 수 없음
        response.end('Not found');  //Not found을 보여줌
      }
  });

app.listen(3000); //localhost:3000
