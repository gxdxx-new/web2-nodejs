var http = require('http');
var fs = require('fs');
var url = require('url'); //모듈

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/') {
      if(queryData.id === undefined) {  //id값이 없는 경우
        //파일 목록을 가져옴. filelist에는 data디렉토리의 값들이 들어옴
        fs.readdir('./data', function(error, filelist) {
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = '<ul>';
          var i = 0;
          while(i < filelist.length) {
            //앞 filelist[i]는 링크를 위해, 뒤 filslist[i]는 보여지는 값
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i++;
          }
          list += '</ul>';
          /*
          var list = `<ul>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
          </ul>`;
          */
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
          `;
          response.writeHead(200);  //파일을 성공적으로 전송
          response.end(template); //template을 보여줌
        });
      } else {  //id값이 있는 경우
        fs.readdir('./data', function(error, filelist) {
          var list = '<ul>';
          var i = 0;
          while(i < filelist.length) {
            //앞 filelist[i]는 링크를 위해, 뒤 filslist[i]는 보여지는 값
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i++;
          }
          list += '</ul>';
          /*
          var list = `<ul>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
          </ul>`;
          */
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
            var title = queryData.id;
            var template = `
            <!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
              <h2>${title}</h2>
              <p>${description}</p>
            </body>
            </html>
            `;
            response.writeHead(200);  //파일을 성공적으로 전송
            response.end(template); //template을 보여줌
          });
        });
      }
    } else {
        response.writeHead(400);  //파일을 찾을 수 없음
        response.end('Not found');  //Not found을 보여줌
      }
  });

app.listen(3000); //localhost:3000
