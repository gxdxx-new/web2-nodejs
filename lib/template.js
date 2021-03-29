var sanitizeHtml = require('sanitize-html');

module.exports = {
  HTML:function(title, list, body, control, authStatusUI) {
    return `
    <!doctype html>
    <html>
    <head>  <!--페이지 제목-->
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>  <!--페이지 내용-->
      ${authStatusUI}
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list:function(topics) {
    var list = `<ol>`;
    var i = 0;
    while(i < topics.length) {
      list += `<li><a href="/topic/${topics[i].id}">${sanitizeHtml(topics[i].title)}</a></li>`; //topics는 배열로 들어옴
      i++;
    }
    list += `</ol>`;
    return list;
  },
  authorSelect:function(authors, author_id) {
    var tag = '';
    var i = 0;
    while(i < authors.length) {
      var selected = '';
      if(authors[i].id === author_id) {
        selected = ' selected';
      }
      tag += `<option value="${authors[i].id}"${selected}>${sanitizeHtml(authors[i].name)}</option>`; //selected는 기본적으로 선택된 옵션으로 처리
      i++;
    }
    return `
      <select name="author">  <!--콤보박스-->
        ${tag}
      </select> 
    `
  },
  todoTable:function(authors) {
    var tag = `<table>`;
    var i = 0;
    while(i < authors.length) {
      tag += `
            <tr>                                              <!--table row-->
              <td>${sanitizeHtml(authors[i].name)}</td>       <!--table column-->
              <td>${sanitizeHtml(authors[i].profile)}</td>
              <td><a href="/author/update/${authors[i].id}">update</a></td>
              <td>
                <form action="/author/delete_process" method="post">  <!--delete는 form으로-->
                  <input type="hidden" name="id" value="${authors[i].id}">
                  <input type="submit" value="delete">
                </form>
              </td> <!--삭제 작업은 post방식으로 해야됨-->
            </tr>
            `
      i++;
    }
    tag += `</table>`
    return tag;
  }
};