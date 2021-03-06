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
var GameService = (function () {
    function GameService(http, router) {
        this.http = http;
        this.router = router;
    }
    GameService.prototype.createGame = function () {
        var _this = this;
        var playerInfo = { _id: sessionStorage.getItem('id'), username: sessionStorage.getItem('username') };
        var body = JSON.stringify({ player: playerInfo, state: 'pending', creationDate: Date.now() });
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'bearer ' + sessionStorage.getItem('token'));
        this.http
            .post('http://40.114.47.134:7777/api/v1/games', body, { headers: headers, withCredentials: false })
            .subscribe(function (response) {
            if (response.ok) {
                sessionStorage.setItem('game_id', response.json()._id);
                _this.router.navigate(['game/play']);
            }
        }, function (error) {
            console.log(error);
        });
    };
    GameService.prototype.getGames = function () {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'bearer ' + sessionStorage.getItem('token'));
        return this.http.get('http://40.114.47.134:7777/api/v1/games', { headers: headers, withCredentials: false });
    };
    GameService.prototype.getPlayersGame = function () {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'bearer ' + sessionStorage.getItem('token'));
        return this.http.get('http://40.114.47.134:7777/api/v1/games/players/' + sessionStorage.getItem('game_id'), { headers: headers, withCredentials: false });
    };
    GameService.prototype.getGame = function () {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'bearer ' + sessionStorage.getItem('token'));
        return this.http.get('http://40.114.47.134:7777/api/v1/games/' + sessionStorage.getItem('game_id'), { headers: headers, withCredentials: false });
    };
    return GameService;
}());
GameService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, router_1.Router])
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map