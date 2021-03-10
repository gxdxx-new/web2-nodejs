const express = require('express')
const app = express()

//app.get('/', (req, res) => res.send('Hello World!'))
app.get('/', function(req, res) { //routing
  return res.send('/')
});

app.get('/page', function(req, res) { //routing
  return res.send('/page')
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));

/*
var http = require('http');
var url = require('url'); //모듈
var topic = require('./lib/topic.js');
var author = require('./lib/author.js');

//createServer은 Nodejs로 웹브라우저가 접속이 들어올 때마다 callback함수를 Nodejs가 호출
//request(요청할 때 웹브라우저가 보낸 정보들), response(응답할 때 우리가 웹브라우저에게 전송할 정보들)
var app = http.createServer(function(request, response) {
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
      topic.update(request, response);
    } else if(pathname === '/update_process') {
      topic.update_process(request, response);
    } else if(pathname === '/delete_process') {
      topic.delete_process(request, response);
    } else if(pathname === '/author') {
      author.home(request, response);
    } else if(pathname === '/author/create_process') {
      author.create_process(request, response);
    } else if(pathname === '/author/update') {
      author.update(request, response);
    } else if(pathname === '/author/update_process') {
      author.update_process(request, response);
    } else if(pathname === '/author/delete_process') {
      author.delete_process(request, response);
    } else {
        response.writeHead(404);  //파일을 찾을 수 없음
        response.end('Not found');  //Not found을 보여줌
      }
});

app.listen(3000); //localhost:3000
*/