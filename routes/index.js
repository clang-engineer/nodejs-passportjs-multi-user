var express = require('express');
var router = express.Router();

var template = require('../lib/template');
var auth = require('../lib/auth');

router.get('/', function (request, response) {
    console.log('/', request.user);
    var title = 'WELCOME';
    var description = 'make coding with node.js!!';
    var list = template.List(request.list);
    var html = template.HTML(title, list, `
        ${description}
        <img src="/images/light.jpg" style="width:300px; display:block; margin-top:10px;">
        `,
        `<a href="/topic/create">CREATE</a>`, auth.statusUI(request, response));
    response.send(html);
});

module.exports = router;