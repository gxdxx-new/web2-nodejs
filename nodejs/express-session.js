var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');

var app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(function (request, response, next) {
    if(!request.session.views) {
        request.session.views = {}
    }

    //get the url pathname
    var pathname = parseurl(request).pathname;

    //count the views
    request.session.views[pathname] = (request.session.views[pathname] || 0) + 1

    next();
});

app.get('/foo', function(request, response, next) {
    response.send('you viewed this page ' + request.session.views['/foo'] + ' times');
});

app.get('/bar', function(request, response, next) {
    response.send('you viewed this page ' + request.session.views['/bar'] + ' times');
})

app.listen(3000, function() {
    console.log('3000!');
})