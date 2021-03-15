var cookie = require('cookie');
var auth = require('../lib/auth.js');

exports.authIsOwner = function(request, response) {
  var isOwner = false;
  var cookies = {};
  if(request.headers.cookie) {
      cookies = cookie.parse(request.headers.cookie); //request.headers.cookie텍스트를 cookie.parse가 가공해줌
  }
  if(cookies.email === 'nkd0310@naver.com' && cookies.password === '000000') {
      isOwner = true;
  }
  return isOwner;
}

exports.authStatusUI = function(request, response) {
  var authStatusUI = `<a href="/login">login</a>`;
  if(auth.authIsOwner(request, response)) {
    authStatusUI = `<a href="/login/logout_process">logout</a>`;
  }
  return authStatusUI;
}