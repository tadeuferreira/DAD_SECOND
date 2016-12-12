"use strict";
var Authentication = (function () {
    function Authentication() {
        var _this = this;
        this.login = function (request, response, next) {
            var player = request.user;
            response.json(player);
            return next();
        };
        this.logout = function (request, response, next) {
            request.logOut();
            response.json({ msg: 'Logout' });
            return next();
        };
        this.init = function (server, settings) {
            server.post(settings.prefix + 'login', settings.security.passport.authenticate('local', { 'session': false }), _this.login);
            server.post(settings.prefix + 'logout', settings.security.authorize, _this.logout);
            console.log("Authentication routes registered");
        };
    }
    return Authentication;
}());
exports.Authentication = Authentication;
