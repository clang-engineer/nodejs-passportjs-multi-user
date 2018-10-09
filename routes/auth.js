var express = require('express');
var router = express.Router();

var template = require('../lib/template');

var authData = {
    email: 'orez',
    password: '1111',
    nickname: 'bucheo'
}

router.get('/login', function (request, response) {
    var description = `
            <form action="/auth/login_process" method="post">
            <p><input name="email" type="text" placeholder="email"></p>
            <p><input name="password" type="password" placeholder="password"></p>
            <p><input type="submit"></p>
            </form>
            `;
    var list = template.List(request.list);
    var html = template.HTML('Login', list, description,
        `<a href="/topic/create">CREATE</a>`);
    response.send(html);
});

router.post('/login_process', function (request, response) {
    var post = request.body;
    var email = post.email;
    var password = post.password;
    if (email === authData.email && password === authData.password) {
        request.session.is_logined = true;
        request.session.nickname = authData.nickname;
        response.redirect('/');
    } else {
        response.send('who?');
    }
});

router.get('/logout', function (request, response) {
    request.session.destroy(function (err) {
        response.redirect('/');
    });
});

module.exports = router;