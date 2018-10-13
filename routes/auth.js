var express = require('express');
var router = express.Router();

var template = require('../lib/template');
var auth = require('../lib/auth');

router.get('/login', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
        feedback = fmsg.error[0];
    }
    console.log(feedback);
    var description = `
    <div style="color:red;">${feedback}</div>
            <form action="/auth/login_process" method="post">
            <p><input name="email" type="text" placeholder="email"></p>
            <p><input name="password" type="password" placeholder="password"></p>
            <p><input type="submit"></p>
            </form>
            `;
    var list = template.List(request.list);
    var html = template.HTML('Login', list, description,
        `<a href="/topic/create">CREATE</a>`, auth.statusUI(request, response));
    response.send(html);
});

router.get('/logout', function (request, response) {
    request.logout();
    request.session.save(function () {
        response.redirect('/');
    });
});

module.exports = router;