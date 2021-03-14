var http = require('http');
var cookie = require('cookie');

http.createServer(function(request, response) {
    var cookies = {};
    if(request.headers.cookie !== undefined) {
        cookies = cookie.parse(request.headers.cookie); //쿠키값을 객체로 반환
    }
    response.writeHead(200, {
        'Set-Cookie':[
            'yummy_cookie=choco',                       //Session cookie
            'tasty_cookie=strawberry',
            `Permanent=cookies; Max-Age=${60*60*24*30}` //Permanent cookie
        ]  //저장된 쿠키값을 Cookie헤더값을 통해 서버로 전송
    });
    response.end('Cookie!!');
}).listen(3000);