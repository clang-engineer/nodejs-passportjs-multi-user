var express = require('express');
var router = express.Router();

var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template');


router.get('/create', function (request, response) {
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

router.post('/create_process', function (request, response) {
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        response.writeHead(302, { Location: `/topic/${title}` });
        response.end();
    });
});

router.get('/update/:pageId', function (request, response) {
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

router.post('/update_process', function (request, response) {
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

router.post('/delete_process', function (request, response) {
    var post = request.body;
    var id = post.id;
    var filterID = path.parse(id).base;
    fs.unlink(`data/${filterID}`, function (error) {
        response.writeHead(302, { Location: `/` });
        response.end();
    });
});

router.get('/:pageId', function (request, response, next) {
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

module.exports=router;