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
var GameSearchComponent = (function () {
    function GameSearchComponent(gameService, userService, router) {
        this.gameService = gameService;
        this.userService = userService;
        this.router = router;
        this.games = [];
    }
    GameSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.userService.isLoggedIn()) {
            this.router.navigate(['login']);
        }
        else {
            this.gameService.getGames().subscribe(function (response) { return _this.games = response.json(); });
        }
    };
    return GameSearchComponent;
}());
GameSearchComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'gamesearch',
        templateUrl: 'gameSearch.component.html'
    }),
    __metadata("design:paramtypes", [game_service_1.GameService, user_service_1.UserService, router_1.Router])
], GameSearchComponent);
exports.GameSearchComponent = GameSearchComponent;
//# sourceMappingURL=gameSearch.component.js.map