var db = require('../lib/db');

module.exports = function (app) {

    var authData = {
        email: 'orez',
        password: '1111',
        nickname: 'bucheo'
    };

    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        console.log('serialize', user)
        done(null, user);
    });
    passport.deserializeUser(function (id, done) {
        console.log('deserialize', id)
        done(null, authData);
    });


    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        function (username, password, done) {
            console.log('LocalStrategy', username, password);
            if (username === authData.email) {
                if (password === authData.password) {
                    return done(null, authData, {
                        message: 'welcome'
                    });
                } else {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
            } else {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
        }
    ));

    return passport;
}