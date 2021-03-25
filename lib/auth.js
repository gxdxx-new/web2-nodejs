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
    <a href="/login">Login</a> |
    <a href="/login/register">Register</a> |
    <a href="/login/google">Login with Google</a>
    `;
    if(this.isOwner(request, response)) {
      authStatusUI = `${request.user.displayName} | <a href="/login/logout_process">logout</a>`;
    }
    return authStatusUI;
  } 
}