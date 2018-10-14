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
        done(null, user.email);
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
                console.log(1);
                if (password === authData.password) {
                    console.log(2);
                    return done(null, authData, {
                        message: 'welcome'
                    });
                } else {
                    console.log(3);
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
            } else {
                console.log(4);
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
        }
    ));

    return passport;
}