"use strict";
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var sha1 = require('sha1');
var app_database_1 = require('./app.database');
var Security = (function () {
    function Security() {
        this.passport = passport;
        this.initMiddleware = function (server) {
            server.use(passport.initialize());
        };
        this.authorize = this.passport.authenticate('bearer', { session: false });
    }
    return Security;
}());
exports.Security = Security;
var validPassword = function (player, password) {
    return sha1(password) === player.passwordHash;
};
passport.use(new LocalStrategy(function (username, password, done) {
    app_database_1.databaseConnection.db.collection('players').findOne({
        username: username
    }).then(function (player) {
        if (player === null) {
            return done(null, false, {
                message: 'Incorrect credentials.'
            });
        }
        if (!validPassword(player, password)) {
            return done(null, false, {
                message: 'Incorrect credentials.'
            });
        }
        player.token = sha1(player.username + Date.now());
        app_database_1.databaseConnection.db.collection('players')
            .updateOne({ _id: player._id }, { $set: { token: player.token } })
            .then(function (r) { return r.modifiedCount !== 1 ? done(null, false) : done(null, player); })
            .catch(function (err) { return done(err); });
    }).catch(function (err) { return done(err); });
}));
passport.use(new BearerStrategy(function (token, done) {
    app_database_1.databaseConnection.db.collection('players')
        .findOne({ token: token })
        .then(function (user) { return user ? done(null, user, { scope: 'all' }) : done(null, false); })
        .catch(function (err) { return done(err); });
}));
