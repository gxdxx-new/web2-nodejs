var http = require('http');
var cookie = require('cookie');

http.createServer(function(request, response) {
    var cookies = {};
    if(request.headers.cookie !== undefined) {
        cookies = cookie.parse(request.headers.cookie); //쿠키값을 객체로 반환
    }
    response.writeHead(200, {
        'Set-Cookie':[
            'yummy_cookie=choco',                           //Session cookie
            'tasty_cookie=strawberry',
            `Permanent=cookies; Max-Age=${60*60*24*30}`,    //Permanent cookie
            'Secure=Secure; Secure',                        //Https인 경우에만 웹브라우저가 웹서버에게 전송
            'HttpOnly=HttpOnly; HttpOnly',                  //웹브라우저와 웹서버가 통신할때만 쿠키를 발행(자바스크립트를 통해서 접근 못하게함)
            'Path=Path; Path=/cookie',                      //특정 디렉토리에서만 쿠키가 활성화 되도록 함
            'Domain=Domain; Domain=o2.org'                  //o2.org앞의 어떠한 서브 도메인 안에서도 나타남
        ]  //저장된 쿠키값을 Cookie헤더값을 통해 서버로 전송
    });
    response.end('Cookie!!');
}).listen(3000);