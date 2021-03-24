module.exports = {
  isOwner:function(request, response) {
    if(request.user) {
      return true;
    } else {
      return false;
    }
  },
  statusUI:function(request, response) {
    var authStatusUI = `
    <a href="/Login">login</a> |
    <a href="/login/register">register</a> |
    <a href="/login/google">Login with Google</a>
    `;
    if(this.isOwner(request, response)) {
      authStatusUI = `${request.user.displayName} | <a href="/login/logout_process">logout</a>`;
    }
    return authStatusUI;
  } 
}