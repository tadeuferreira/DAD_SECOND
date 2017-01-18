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
    function GameLobbyComponent(websocketService, activatedRoute, gameService, userService, router) {
        this.websocketService = websocketService;
        this.activatedRoute = activatedRoute;
        this.gameService = gameService;
        this.userService = userService;
        this.router = router;
        this.players = [];
        this.team1 = [];
        this.team2 = [];
    }
    GameLobbyComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.userService.isLoggedIn()) {
            this.router.navigate(['login']);
        }
        else {
            this.sub = this.activatedRoute.params.subscribe(function (params) {
                _this.id_game = params['id'];
            });
            console.log(this.id_game);
            this.gameService.joinGame(this.id_game).subscribe(function (response) {
                console.log(response);
                if (response.ok) {
                    switch (response._body) {
                        case '"joined"':
                            console.log('joined');
                            _this.websocketService.getInitLobby().subscribe(function (p) {
                                if (p.msg == 'refresh') {
                                    _this.gameService.getPlayersGame(_this.id_game).subscribe(function (response) {
                                        _this.setPlayers(response);
                                    }, function (error) {
                                        console.log(error);
                                    });
                                }
                            });
                            console.log('joinning sent');
                            _this.websocketService.sendInitLobby({ _id: _this.id_game, msg: 'joining' });
                            break;
                        case '"already In"':
                            _this.websocketService.getInitLobby().subscribe(function (p) {
                                if (p.msg == 'refresh') {
                                    _this.gameService.getPlayersGame(_this.id_game).subscribe(function (response) {
                                        _this.setPlayers(response);
                                    }, function (error) {
                                        console.log(error);
                                    });
                                }
                            });
                            _this.websocketService.sendInitLobby({ _id: _this.id_game, msg: 'already In' });
                            break;
                    }
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
        var _this = this;
        console.log('leaving');
        this.gameService.leaveGame(this.id_game).subscribe(function (response) {
            console.log(response);
            if (response.ok) {
                switch (response._body) {
                    case '"terminated"':
                        console.log('terminated');
                        _this.websocketService.sendExitLobby({ _id: _this.id_game, msg: 'terminated' });
                        break;
                    case '"left"':
                        console.log('left');
                        _this.websocketService.sendExitLobby({ _id: _this.id_game, msg: 'left' });
                        break;
                }
            }
        }, function (error) {
            console.log(error);
        });
    };
    GameLobbyComponent.prototype.setPlayers = function (response) {
        var json = JSON.parse(response._body);
        this.team1 = json.team1;
        this.team2 = json.team2;
        console.log(json);
    };
    return GameLobbyComponent;
}());
GameLobbyComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'gamelobby',
        templateUrl: 'gameLobby.component.html'
    }),
    __metadata("design:paramtypes", [websocket_service_1.WebSocketService, router_1.ActivatedRoute, game_service_1.GameService, user_service_1.UserService, router_1.Router])
], GameLobbyComponent);
exports.GameLobbyComponent = GameLobbyComponent;
//# sourceMappingURL=gameLobby.component.js.map