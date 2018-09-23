var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    function templateHTML(title, list, body) {
        return `
        <!DOCTYPE html>
            <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>WEB1- ${title}</title>
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        <h2>${title}</h2>
        <p>${body}</p>
        </body>
        </html>
        `
    };

    function templateList(filelist) {
        var list = '<ul>';
        var i = 0;
        while (i < filelist.length) {
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i++;
        }
        list += '</ul>';
        return list;
    };

    if (pathname === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', function (error, filelist) {
                var title = 'WELCOME';
                var description = 'node.js!!';
                var list = templateList(filelist);
                var template = templateHTML(title, list, description);
                response.writeHead(200);
                response.end(template);
            });
        } else {
            fs.readdir('./data', function (error, filelist) {
                var title = queryData.id;
                var list = templateList(filelist);
                fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {

                    var template = templateHTML(title, list, description);
                    response.writeHead(200);
                    response.end(template);
                });
            });

        }
    } else {
        response.writeHead(404);
        response.end('not found');
    }
});

app.listen(3000);
