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
var GameComponent = (function () {
    function GameComponent(websocketService, gameService, userService, router) {
        this.websocketService = websocketService;
        this.gameService = gameService;
        this.userService = userService;
        this.router = router;
        this.game_id = sessionStorage.getItem('game_id');
        this.player_id = sessionStorage.getItem('id');
        this.isGameReady = false;
        this.message = 'Wait';
    }
    GameComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.userService.isLoggedIn()) {
            this.router.navigate(['login']);
        }
        else {
            this.gameService.getGame().subscribe(function (response) {
                console.log(_this.game_id);
                //this.game = new Game(response.json());
                _this.isGameReady = true;
                _this.gameService.ready().subscribe(function (response) {
                    if (response.ok) {
                        switch (response._body) {
                            case '"gameReady"':
                                console.log('gameReady');
                                _this.websocketService.sendGame({ _id: _this.game_id, player_id: _this.player_id, msg: 'startGame' });
                                break;
                            case '"gameStartedAlready"':
                                console.log('gameStartedAlready');
                                _this.game.play(0);
                                break;
                        }
                        _this.websocketService.getGame().subscribe(function (p) {
                            if (p.msg == 'update') {
                                _this.game.played(p.pos, p.card);
                            }
                            else if (p.msg == 'play') {
                                console.log(p);
                                _this.game.play(p.pos);
                                if (_this.game.myTurnNumber == _this.game.onTurn)
                                    _this.message = 'Play';
                            }
                            else if (p.msg == 'updateRound') {
                                _this.message = 'Won: ' + p.firstToPlay;
                                _this.game.played(p.pos, p.card);
                                console.log('updating');
                                setTimeout(function () {
                                    _this.gameService.getGame().subscribe(function (response) {
                                        console.log('updating inner 1');
                                        var jsonGame = response.json();
                                        _this.game.update(jsonGame, p);
                                        _this.gameService.ready().subscribe(function (response) {
                                            console.log('updating inner 2');
                                            if (response.ok) {
                                                console.log('updating inner 3');
                                                _this.message = 'Wait';
                                                if (response._body == '"gameReady"') {
                                                    _this.websocketService.sendGame({ _id: _this.game_id, player_id: _this.player_id, pos: _this.game.firstToPlay, msg: 'startRound' });
                                                }
                                            }
                                        });
                                    });
                                }, 2000);
                            }
                        }, function (error) {
                            console.log(error.text());
                        });
                    }
                });
            });
        }
    };
    GameComponent.prototype.ngOnDestroy = function () {
        this.websocketService.unsubGame();
    };
    GameComponent.prototype.getGameId = function () {
        return this.game_id;
    };
    GameComponent.prototype.getHand = function (type) {
        return this.game.getHandCards(type);
    };
    GameComponent.prototype.getTableCard = function (type) {
        return this.game.getTableCard(type);
    };
    GameComponent.prototype.playCard = function (event) {
        var _this = this;
        var my = this.game.myTurnNumber;
        var next = (my + 1 > 3 ? 0 : my + 1);
        console.log(this.game.onTurn);
        console.log(this.game.myTurnNumber);
        console.log(my == this.game.onTurn);
        if (my == this.game.onTurn) {
            this.game.playCard(event.target.id);
            this.message = 'Wait';
            console.log(this.game.roundHasEnded);
            console.log(this.game.firstToPlay);
            console.log(this.game.lastToPlay);
            if (this.game.roundHasEnded) {
                console.log(this.game.roundHasEnded);
                this.gameService.updateGame(this.game.jsonGame).subscribe(function (response) {
                    console.log('updated game');
                    if (response.ok) {
                        _this.websocketService.sendGame({
                            _id: _this.game_id,
                            player_id: _this.player_id,
                            msg: 'endRound',
                            my_pos: my,
                            firstToPlay: _this.game.firstToPlay,
                            lastToPlay: _this.game.lastToPlay,
                            card: _this.game.getPlayedCard(my)
                        });
                    }
                }, function (error) {
                    console.log(error.text());
                });
            }
            else {
                console.log('playing');
                this.websocketService.sendGame({
                    _id: this.game_id,
                    player_id: this.player_id,
                    msg: 'next',
                    my_pos: this.game.myTurnNumber,
                    next_pos: next,
                    card: this.game.getPlayedCard(my)
                });
            }
        }
    };
    return GameComponent;
}());
GameComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'game-playing',
        templateUrl: 'game.component.html',
        styleUrls: ['../gameCards/game.component.css']
    }),
    __metadata("design:paramtypes", [websocket_service_1.WebSocketService, game_service_1.GameService, user_service_1.UserService, router_1.Router])
], GameComponent);
exports.GameComponent = GameComponent;
//# sourceMappingURL=game.component.js.map