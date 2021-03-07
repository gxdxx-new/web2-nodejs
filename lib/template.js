// module.exports = {
//   HTML:function(title, list, body, control) {
//     return `
//     <!doctype html>
//     <html>
//     <head>  <!--페이지 제목-->
//       <title>WEB1 - ${title}</title>
//       <meta charset="utf-8">
//     </head>
//     <body>  <!--페이지 내용-->
//       <h1><a href="/">WEB</a></h1>
//       ${list}
//       ${control}
//       ${body}
//     </body>
//     </html>
//     `;
//   },
//   list:function(filelist) {
//     var list = `<ul>`;
//     var i = 0;
//     while(i < filelist.length) {
//       //앞 filelist[i]는 링크를 위해, 뒤 filslist[i]는 보여지는 값
//       list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
//       i++;
//     }
//     list += `</ul>`;
//     return list;
//     /*
//     var list = `<ul>
//       <li><a href="/?id=HTML">HTML</a></li>
//       <li><a href="/?id=CSS">CSS</a></li>
//       <li><a href="/?id=JavaScript">JavaScript</a></li>
//     </ul>`;
//     */
//   }
// };

module.exports = {
  HTML:function(title, list, body, control) {
    return `
    <!doctype html>
    <html>
    <head>  <!--페이지 제목-->
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>  <!--페이지 내용-->
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
    var list = `<ul>`;
    var i = 0;
    while(i < topics.length) {
      //앞 filelist[i]는 링크를 위해, 뒤 filslist[i]는 보여지는 값
      list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i++;
    }
    list += `</ul>`;
    return list;
    /*
    var list = `<ul>
      <li><a href="/?id=HTML">HTML</a></li>
      <li><a href="/?id=CSS">CSS</a></li>
      <li><a href="/?id=JavaScript">JavaScript</a></li>
    </ul>`;
    */
  },
  authorSelect:function(authors, author_id) {
    var tag = '';
    var i = 0;
    var selected = '';
    while(i < authors.length) {
      if(authors[i].id === author_id) {
        selected = ' selected';
      }
      tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`; //selected는 기본적으로 선택된 옵션으로 처리
      i++;
    }
    return `
      <select name="author">  <!--콤보박스-->
        ${tag}
      </select> 
    `
  },
  authorTable:function(authors) {
    var tag = `<table>`;
    var i = 0;
    while(i < authors.length) {
      tag += `
            <tr>                                <!--table row-->
              <td>${authors[i].name}</td>       <!--table column-->
              <td>${authors[i].profile}</td>
              <td>update</td>
              <td>delete</td>
            </tr>
            `
      i++;
    }
    tag += `</table>`
    return tag;
  }
};