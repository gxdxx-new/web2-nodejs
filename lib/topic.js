var db = require('./db');
var template = require('./template.js');

exports.home = function(request, response){   //exports : 여러 API를 제공 가능
    db.query(`SELECT * FROM topic`, function(error, topics){  //callback:sql문이 실행된 후에 서버가 응답한 결과를 처리해줌
        if(error) throw error;
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>
          ${description}`,
          `<a href="/create">create</a>` ///create로 이동, home에서는 update 버튼 안나오게
        );
        response.writeHead(200);
        response.end(html);
    });
}