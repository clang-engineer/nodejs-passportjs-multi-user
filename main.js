var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var compression = require('compression');
var indexRouter=require('./routes/index');
var topicRouter=require('./routes/topic');

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
//express router! 분리한 파일에서는 /topic 제거해야함.
app.use('/',indexRouter);
app.use('/topic',topicRouter);

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