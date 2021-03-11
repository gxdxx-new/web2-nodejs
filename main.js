var http = require('http');
var url = require('url'); //모듈
var topic = require('./lib/topic.js');
var author = require('./lib/author.js');
var express = require('express');
var app = express()
var bodyParser = require('body-parser');
var compression = require('compression');

app.use(bodyParser.urlencoded({extended: false}));  //bodyParser미들웨어가 실행됨(사용자가 전송한 post data를 내부적으로 분석해서 callback함수의 request객체의 body property를 넘김)
app.use(compression()); //compression()을 호출하면 compression미들웨어를 리턴하고 app.use에 들어감

//app.get('/', (req, res) => res.send('Hello World!'))
app.get('/', function(request, response) { //routing
  topic.home(request, response);
});

app.get('/page/:pageId', function(request, response) { //routing
  topic.page(request, response);
  //response.send(request.params);  //request.params => :pageId에 들어있는 값
});

app.get('/create', function(request, response) {
  topic.create(request, response);
});

app.post('/create_process', function(request, response) { //topic.create에서 post방식으로 전송됨
  topic.create_process(request, response);
});

app.get('/update/:pageId', function(request, response) {
  topic.update(request, response);
});

app.post('/update_process', function(request, response) {
  topic.update_process(request, response);
})

app.post('/delete_process', function(request, response) {
  topic.delete_process(request, response);
})

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