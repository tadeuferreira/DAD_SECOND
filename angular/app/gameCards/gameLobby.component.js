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
var router_1 = require("@angular/router");
var user_service_1 = require("../auth/user.service");
var game_service_1 = require("../gameCards/game.service");
var websocket_service_1 = require("../notifications/websocket.service");
var GameLobbyComponent = (function () {
    function GameLobbyComponent(websocketService, gameService, userService, router) {
        this.websocketService = websocketService;
        this.gameService = gameService;
        this.userService = userService;
        this.router = router;
        this.players = [];
        this.team1 = [];
        this.team2 = [];
        this.game_id = sessionStorage.getItem('game_id');
        this.player_id = sessionStorage.getItem('id');
        this.gameIsStarting = false;
        this.gameFound = true;
    }
    GameLobbyComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.userService.isLoggedIn()) {
            this.router.navigate(['login']);
        }
        else {
            //join game 
            this.websocketService.sendLobby({ _id: this.game_id, player_id: this.player_id, player_avatar: sessionStorage.getItem('avatar'), player_username: sessionStorage.getItem('username'), msg: 'join' });
            this.websocketService.subLobby().subscribe(function (response) {
                switch (response.msg) {
                    case 'update':
                        _this.gameService.getPlayersGame().subscribe(function (response) {
                            if (response.ok)
                                _this.setPlayers(response);
                        }, function (error) {
                            console.log(error.text());
                        });
                        break;
                    case 'start':
                        _this.gameIsStarting = true;
                        _this.router.navigate(['game/playing']);
                        break;
                    case 'switch_fail':
                        alert('cant switch team');
                        break;
                    case 'terminated':
                        _this.end();
                        break;
                    case 'NoGame':
                        _this.noGame();
                        break;
                }
            });
        }
    };
    GameLobbyComponent.prototype.ngOnDestroy = function () {
        if (!this.gameIsStarting)
            this.websocketService.sendLobby({ _id: this.game_id, player_id: this.player_id, msg: 'leave' });
    };
    GameLobbyComponent.prototype.setPlayers = function (response) {
        var json = JSON.parse(response._body);
        this.team1 = json.team1;
        this.team2 = json.team2;
    };
    GameLobbyComponent.prototype.changeTeam = function () {
        this.websocketService.sendLobby({ _id: this.game_id, player_id: this.player_id, msg: 'switch' });
    };
    GameLobbyComponent.prototype.leave = function () {
        this.websocketService.sendLobby({ _id: this.game_id, player_id: this.player_id, msg: 'leave' });
        this.end();
    };
    GameLobbyComponent.prototype.getGameId = function () {
        return this.game_id;
    };
    GameLobbyComponent.prototype.end = function () {
        this.websocketService.unsubLobby();
        this.router.navigate(['dashboard']);
    };
    GameLobbyComponent.prototype.noGame = function () {
        var _this = this;
        this.gameFound = false;
        setTimeout(function () {
            _this.router.navigate(['dashboard']);
        }, 5000);
    };
    return GameLobbyComponent;
}());
GameLobbyComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'gamelobby',
        templateUrl: 'gameLobby.component.html'
    }),
    __metadata("design:paramtypes", [websocket_service_1.WebSocketService, game_service_1.GameService, user_service_1.UserService, router_1.Router])
], GameLobbyComponent);
exports.GameLobbyComponent = GameLobbyComponent;
//# sourceMappingURL=gameLobby.component.js.map