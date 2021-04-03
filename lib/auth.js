module.exports = {
  isOwner:function(request, response) {
    if(request.user) {
      return true;
    } else {
      return false;
    }
  },
  statusUI:function(request, response) {
    let authStatusUI = `
    <a href="/login">로그인</a> |
    <a href="/login/register">회원가입</a> |
    <a href="/login/google">구글 로그인</a>
    `;
    if(this.isOwner(request, response)) {
      authStatusUI = `${request.user.displayName} | <a href="/login/logout_process">logout</a>`;
    }
    return authStatusUI;
  } 
}