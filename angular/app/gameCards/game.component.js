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
var game_1 = require("../gameEngine/game");
var GameComponent = (function () {
    function GameComponent(websocketService, gameService, userService, router) {
        this.websocketService = websocketService;
        this.gameService = gameService;
        this.userService = userService;
        this.router = router;
        this.game_id = sessionStorage.getItem('game_id');
    }
    GameComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.userService.isLoggedIn()) {
            this.router.navigate(['login']);
        }
        else {
            this.gameService.getGame().subscribe(function (response) {
                _this.game = new game_1.Game(response.json());
                _this.websocketService.sendGame({ _id: _this.game_id, msg: 'ready start' });
                _this.websocketService.getGame().subscribe(function (p) {
                    if (p.msg == 'yourturn') {
                        _this.router.navigate(['dashboard']);
                    }
                });
            }, function (error) {
                console.log(error.text());
            });
        }
    };
    GameComponent.prototype.ngOnDestroy = function () {
    };
    GameComponent.prototype.getGameId = function () {
        return this.game_id;
    };
    return GameComponent;
}());
GameComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'game-playing',
        templateUrl: 'game.component.html'
    }),
    __metadata("design:paramtypes", [websocket_service_1.WebSocketService, game_service_1.GameService, user_service_1.UserService, router_1.Router])
], GameComponent);
exports.GameComponent = GameComponent;
//# sourceMappingURL=game.component.js.map