var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var auth = require('../lib/auth');
var shortid = require('shortid');

var db = require('../lib/db');

module.exports = function (passport) {

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

    router.post('/login_process',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/auth/login',
            failureFlash: true,
            successFlash: true
        }));

    router.get('/register', function (request, response) {
        var fmsg = request.flash();
        var feedback = '';
        if (fmsg.error) {
            feedback = fmsg.error[0];
        }
        console.log(feedback);
        var description = `
            <div style="color:red;">${feedback}</div>
            <form action="/auth/register_process" method="post">
            <p><input name="email" type="text" placeholder="email"></p>
            <p><input name="password1" type="password" placeholder="password"></p>
            <p><input name="password2" type="password" placeholder="password"></p>
            <p><input name="DisplayName" type="text" placeholder="Display Name"></p>
            <p><input type="submit" value="register"></p>
            </form>
            `;
        var list = template.List(request.list);
        var html = template.HTML('Login', list, description,
            `<a href="/topic/create">CREATE</a>`, auth.statusUI(request, response));
        response.send(html);
    });

    router.post('/register_process', function (request, response) {
        var post = request.body;
        var email = post.email;
        var password1 = post.password1;
        var password2 = post.password2;
        var DisplayName = post.DisplayName;
        if (password1 !== password2) {
            request.flash('error', 'Password must same!');
            response.redirect('/auth/register');
        } else {
            var user = {
                id: shortid.generate(),
                email: email,
                password: password1,
                DisplayName: DisplayName
            }
            db.get('users').push(user).write();
            response.redirect('/');
        };
    });

    return router;
}