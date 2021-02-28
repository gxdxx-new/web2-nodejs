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
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list:function(filelist) {
    var list = `<ul>`;
    var i = 0;
    while(i < filelist.length) {
      //앞 filelist[i]는 링크를 위해, 뒤 filslist[i]는 보여지는 값
      list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
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
  }
};