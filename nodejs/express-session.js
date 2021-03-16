var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var app = express();

app.use(
    session({
        secret: 'kASDSADSADASDWDQ@O!!@',
        resave: false,  //false: 세션 데이터가 바뀌기 전 까지는 세션 저장소 값을 저장하지 않음
        saveUninitialized: true, //세션이 필요하기 전 까지는 세션을 구동시키지 않음
        store:new FileStore()
    })
);

app.get('/', function(request, response, next) {
    if(request.session.num === undefined) {
        request.session.num = 1;
    } else {
        request.session.num++;
    }
    response.send(`Views : ${request.session.num}`);
})

app.listen(3000, function() {
    console.log('3000!');
})

// var express = require('express');
// var parseurl = require('parseurl');
// var session = require('express-session');
// var FileStore = require('session-file-store')(session);

// var app = express();

// app.use(session({
//     secret: 'kASDSADSADASDWDQ@O!!@',
//     resave: false,  //false: 세션 데이터가 바뀌기 전 까지는 세션 저장소 값을 저장하지 않음
//     saveUninitialized: true, //세션이 필요하기 전 까지는 세션을 구동시키지 않음
//     store:new FileStore()
// }));

// app.get('/', function(request, response, next) {
//     if(request.session.num === undefined) {
//         request.session.num = 1;
//     } else {
//         request.session.num++;
//     }
//     response.send(`Views : ${request.session.num}`);
// })

// app.listen(3000, function() {
//     console.log('3000!');
// })