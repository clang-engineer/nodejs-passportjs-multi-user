var express = require('express');
var router = express.Router();

var template = require('../lib/template');

router.get('/login', function (request, response) {
    var description = `
            <form action="/auth/create_process" method="post">
            <p><input name="email" type="text" placeholder="email"></p>
            <p><input name="password" type="password" placeholder="password"></p>
            <p><input type="submit"></p>
            </form>
            `;
    var list = template.List(request.list);
    var html = template.HTML('Login', list, description,
        `<a href="/topic/create">CREATE</a>`);
    response.writeHead(200);
    response.end(html);
});

module.exports = router;