var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var template = require('./lib/template');
var qs = require('querystring');
var bodyParser = require('body-parser');
var compression = require('compression');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// compress all responses
app.use(compression());
//미들웨어를 만들어 사용하는데, app.use 대신, app.get을 사용하는  이유는 get방식을 사용하는 것들에서만 본 미들웨어를 사용한다는 의미.
app.get('*', function (request, response, next) {
    fs.readdir('./data', function (error, filelist) {
        request.list = filelist;
        next();
    });
});
//url로 파일에 접근하게 해주는 Express 내장미들웨어 public에 있는 이미지에 접근할 수 있게함!
//unsplash.com은 저작권에서 완전 자유로운 이미지를 제공함!! 참조!
app.use(express.static('public'));

app.get('/', function (request, response) {
    var title = 'WELCOME';
    var description = 'make coding with node.js!!';
    var list = template.List(request.list);
    var html = template.HTML(title, list, `
        ${description}
        <img src="/images/light.jpg" style="width:300px; display:block; margin-top:10px;">
        `,
        `<a href="/topic/create">CREATE</a>`);
    response.send(html);
});

app.get('/topic/create', function (request, response) {
    var description = `
            <form action="/topic/create_process" method="post">
            <p><input name="title" type="text" placeholder="title"></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="submit"></p>
            </form>
            `;
    var list = template.List(request.list);
    var html = template.HTML('CREATE', list, description,
        `<a href="/topic/create">CREATE</a>`);
    response.writeHead(200);
    response.end(html);
});

app.post('/topic/create_process', function (request, response) {
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        response.writeHead(302, { Location: `/topic/${title}` });
        response.end();
    });
});

app.get('/topic/update/:pageId', function (request, response) {
    var title = request.params.pageId;
    var list = template.List(request.list);
    var filterID = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filterID}`, 'utf8', function (err, description) {
        var html = template.HTML('UPDATE', list, `
                <form action="/topic/update_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <p><input name="title" type="text" placeholder="title" value="${title}"></p>
                <p><textarea name="description" placeholder="description">${description}</textarea></p>
                <p><input type="submit"></p>
                </form>
                `,
            `<a href="/topic/create">CREATE</a>`);
        response.writeHead(200);
        response.end(html);
    });
});

app.post('/topic/update_process', function (request, response) {
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
            response.writeHead(302, { Location: `/topic/${title}` });
            response.end();
        });
    });
});

app.post('/topic/delete_process', function (request, response) {
    var post = request.body;
    var id = post.id;
    var filterID = path.parse(id).base;
    fs.unlink(`data/${filterID}`, function (error) {
        response.writeHead(302, { Location: `/` });
        response.end();
    });
});

app.get('/topic/:pageId', function (request, response, next) {
    var filterID = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filterID}`, 'utf8', function (err, description) {
        if (err) {
            next(err);
        } else {
            var title = request.params.pageId;
            var sanitizeTitle = sanitizeHtml(title);
            var sanitizeDescription = sanitizeHtml(description, { allowedTags: ['h1'] });
            var list = template.List(request.list);
            var html = template.HTML(sanitizeTitle, list, sanitizeDescription,
                `<a href="/topic/create">CREATE</a>
                <a href="/topic/update/${title}">UPDATE</a>
                <form action="/topic/delete_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
                </form>`);
            response.send(html);
        }
    });
});

app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});