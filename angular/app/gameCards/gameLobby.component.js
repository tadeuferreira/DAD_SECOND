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
        this.gameIsStarting = false;
    }
    GameLobbyComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.userService.isLoggedIn()) {
            this.router.navigate(['login']);
        }
        else {
            this.gameService.joinGame().subscribe(function (response) {
                if (response.ok) {
                    switch (response._body) {
                        case '"joined"':
                            _this.websocketService.sendInitLobby({ _id: sessionStorage.getItem('game_id'), msg: 'joining' });
                            break;
                        case '"start"':
                            _this.websocketService.sendInitLobby({ _id: sessionStorage.getItem('game_id'), msg: 'start' });
                            break;
                        case '"already In"':
                            _this.websocketService.sendInitLobby({ _id: sessionStorage.getItem('game_id'), msg: 'already In' });
                            break;
                    }
                    _this.websocketService.getInitLobby().subscribe(function (p) {
                        if (p.msg == 'refresh') {
                            _this.gameService.getPlayersGame().subscribe(function (response) {
                                _this.setPlayers(response);
                            }, function (error) {
                                console.log(error);
                            });
                        }
                        else if (p.msg == 'startGame') {
                            _this.websocketService.unsubLobby();
                            _this.gameIsStarting = true;
                            _this.router.navigate(['game/playing']);
                        }
                    });
                    _this.websocketService.getExitLobby().subscribe(function (p) {
                        if (p.msg == 'terminated') {
                            _this.router.navigate(['dashboard']);
                        }
                    });
                }
                else {
                    _this.router.navigate(['dashboard']);
                }
            }, function (error) {
                console.log(error);
            });
        }
    };
    GameLobbyComponent.prototype.ngOnDestroy = function () {
        if (!this.gameIsStarting)
            this.leave();
    };
    GameLobbyComponent.prototype.setPlayers = function (response) {
        var json = JSON.parse(response._body);
        this.team1 = json.team1;
        this.team2 = json.team2;
        console.log(json);
    };
    GameLobbyComponent.prototype.changeTeam = function () {
        var _this = this;
        this.gameService.changeTeamGame().subscribe(function (response) {
            if (response.ok) {
                switch (response._body) {
                    case '"changed"':
                        _this.websocketService.sendInitLobby({ _id: sessionStorage.getItem('game_id'), msg: 'changed' });
                        break;
                    case '"full"':
                        alert('The other team is full');
                        break;
                }
            }
        }, function (error) {
            console.log(error);
        });
    };
    GameLobbyComponent.prototype.leave = function () {
        var _this = this;
        this.gameService.leaveGame().subscribe(function (response) {
            if (response.ok) {
                switch (response._body) {
                    case '"terminated"':
                        _this.websocketService.sendExitLobby({ _id: sessionStorage.getItem('game_id'), msg: 'terminated' });
                        break;
                    case '"left"':
                        _this.websocketService.sendExitLobby({ _id: sessionStorage.getItem('game_id'), msg: 'left' });
                        break;
                }
                _this.router.navigate(['dashboard']);
            }
        }, function (error) {
            console.log(error);
        });
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