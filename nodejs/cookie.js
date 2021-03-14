var http = require('http');
http.createServer(function(request, response) {
    response.writeHead(200, {
        'Set-Cookie':['yummy_cookie=choco', 'tasty_cookie=strawberry']  //저장된 쿠키값을 Cookie헤더값을 통해 서버로 전송
    });
    response.end('Cookie!!');
}).listen(3000);