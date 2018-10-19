var express = require('express');
var router = express.Router();

var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template');
var auth = require('../lib/auth');
var shortid = require('shortid');

var db = require('../lib/db');

router.get('/create', function (request, response) {
    if (!auth.isOwner(request, response)) {
        response.redirect('/');
        return false;
    }
    var description = `
            <form action="/topic/create_process" method="post">
            <p><input name="title" type="text" placeholder="title"></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="submit"></p>
            </form>
            `;
    var list = template.List(request.list);
    var html = template.HTML('CREATE', list, description,
        `<a href="/topic/create">CREATE</a>`, auth.statusUI(request, response));
    response.send(html);
});

router.post('/create_process', function (request, response) {
    if (!auth.isOwner(request, response)) {
        response.redirect('/');
        return false;
    }
    var post = request.body;
    var title = post.title;
    var description = post.description;

    var id = shortid.generate();
    db.get('topics').push({
        id: id,
        title: title,
        description: description,
        user_id: request.user.id
    }).write();
    response.redirect(`/topic/${id}`);
});

router.get('/update/:pageId', function (request, response) {
    if (!auth.isOwner(request, response)) {
        response.redirect('/');
        return false;
    }
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
            `<a href="/topic/create">CREATE</a>`, auth.statusUI(request, response));
        response.send(html);
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
    var topic = db.get('topics').find({
        id: request.params.pageId
    }).value();
    var user = db.get('users').find({
        id: topic.user_id
    }).value();
    var sanitizeTitle = sanitizeHtml(topic.title);
    var sanitizeDescription = sanitizeHtml(topic.description, { allowedTags: ['h1'] });
    var list = template.List(request.list);
    var html = template.HTML(sanitizeTitle, list, sanitizeDescription,
        `<a href="/topic/create">CREATE</fa>
                <a href="/topic/update/${sanitizeTitle}">UPDATE</a>
                <form action="/topic/delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizeTitle}">
                <input type="submit" value="delete">
                </form>`, auth.statusUI(request, response));
    response.send(html);
});

module.exports = router;