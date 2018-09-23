var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, link) {
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
    <p>${link}</p>
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

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', function (error, filelist) {
                var title = 'WELCOME';
                var description = 'node.js!!';
                var list = templateList(filelist);
                var template = templateHTML(title, list, description,
                    `<a href="/create">CREATE</a>`);
                response.writeHead(200);
                response.end(template);
            });
        } else {
            fs.readdir('./data', function (error, filelist) {
                var title = queryData.id;
                var list = templateList(filelist);
                fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {

                    var template = templateHTML(title, list, description,
                        `<a href="/create">CREATE</a>`);
                    response.writeHead(200);
                    response.end(template);
                });
            });

        }
    } else if (pathname === '/create') {
        fs.readdir('./data', function (error, filelist) {
            var title = 'CREATE';
            var description = `
            <form action="/create_process" method="post">
            <p><input name="title" type="text" placeholder="title"></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="submit"></p>
            </form>
            `;
            var list = templateList(filelist);
            var template = templateHTML(title, list, description,
                `<a href="/create">CREATE</a>`);
            response.writeHead(200);
            response.end(template);
        });
    } else if (pathname === '/create_process') {
        var body = "";
        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
                response.writeHead(302,{Location:`/?id=${title}`});
                response.end();
            });
        });
    } else {
        response.writeHead(404);
        response.end('not found');
    }
});

app.listen(3000);
