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
    }
    GameLobbyComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.userService.isLoggedIn()) {
            this.router.navigate(['login']);
        }
        else {
            this.sub = this.activatedRoute.params.subscribe(function (params) {
                _this.id = params['id'];
            });
            console.log(this.id);
            this.websocketService.getInitLobbyErr().subscribe(function (p) { return console.log(p); });
            this.websocketService.getInitLobby().subscribe(function (p) { return _this.players.push(p); });
            this.websocketService.sendInitLobby({ _id: this.id, msg: 'Joinning', player: { _id: sessionStorage.getItem('id'), username: sessionStorage.getItem('username'), avatar: sessionStorage.getItem('avatar') } });
        }
    };
    GameLobbyComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
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