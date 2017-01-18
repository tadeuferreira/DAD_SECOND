"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
require("rxjs/add/operator/map");
var UserService = (function () {
    function UserService(http, router) {
        this.http = http;
        this.router = router;
        this.loggedIn = false;
        this.loggedIn = !!sessionStorage.getItem('token');
    }
    UserService.prototype.login = function (username, password) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http
            .post('http://localhost:7777/api/v1/login', JSON.stringify({ username: username, password: password }), { headers: headers }).subscribe(function (response) {
            if (response.ok) {
                sessionStorage.setItem('id', response.json()._id);
                sessionStorage.setItem('token', response.json().token);
                sessionStorage.setItem('username', response.json().username);
                sessionStorage.setItem('email', response.json().email);
                sessionStorage.setItem('avatar', response.json().avatar);
                _this.loggedIn = true;
                console.log(sessionStorage.getItem('token'));
                _this.router.navigate(['dashboard']);
            }
        }, function (error) {
            console.log(error.text());
        });
    };
    UserService.prototype.register = function (username, email, password) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var avatar = 'https://api.adorable.io/avatars/285/' + email + '.png';
        return this.http
            .post('http://localhost:7777/api/v1/register', JSON.stringify({ username: username, email: email, password: password, avatar: avatar }), { headers: headers })
            .subscribe(function (response) {
            _this.router.navigate(['login']);
        }, function (error) {
            console.log(error.text());
        });
    };
    UserService.prototype.logout = function () {
        sessionStorage.removeItem('auth_token');
        this.loggedIn = false;
    };
    UserService.prototype.isLoggedIn = function () {
        return this.loggedIn;
    };
    return UserService;
}());
UserService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, router_1.Router])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map