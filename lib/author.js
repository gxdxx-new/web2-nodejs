var db = require('./db');
var template = require('./template.js');
var url = require('url'); //모듈
var qs = require('querystring');

exports.home = function(request, response) {
    db.query(`SELECT * FROM topic`, function(error, topics){  //callback:sql문이 실행된 후에 서버가 응답한 결과를 처리해줌
        if(error) throw error;
        db.query(`SELECT * FROM author`, function(error2, authors){
            if(error2) throw error2;

            var title = 'author';
            var list = template.list(topics);
            var html = template.HTML(title, list, 
                `
                ${template.authorTable(authors)}
                <style>                            <!--CSS-->
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border:1px solid black;
                    }
                </style>
                `,
              `<a href="/create">create</a>` ///create로 이동, home에서는 update 버튼 안나오게
            );
            response.writeHead(200);
            response.end(html); 
        });
    });
};