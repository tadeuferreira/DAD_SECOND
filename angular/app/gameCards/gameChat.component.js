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
var websocket_service_1 = require("../notifications/websocket.service");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var GameChatComponent = (function () {
    function GameChatComponent(router, http, websocketService) {
        this.router = router;
        this.http = http;
        this.websocketService = websocketService;
        this.playersCChannel = [];
        this.chatGameChannel = [];
        this.username = sessionStorage.getItem('username');
    }
    GameChatComponent.prototype.send = function () {
        this.websocketService.sendGameChatMessage({ game_id: this.game_id, msg: this.message, username: this.username });
        this.message = '';
    };
    GameChatComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.websocketService.getGameChatMessages().subscribe(function (m) { return _this.chatGameChannel.push(m); });
        this.websocketService.getGamePlayersMessages().subscribe(function (m) { return _this.chatGameChannel.push(m); });
        this.websocketService.sendGamePlayersMessage({ game_id: this.game_id, msg: '', username: this.username });
    };
    return GameChatComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], GameChatComponent.prototype, "game_id", void 0);
GameChatComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'gameChat',
        templateUrl: 'gameChat.component.html',
        styleUrls: ['../gameCards/gameChat.component.css']
    }),
    __metadata("design:paramtypes", [router_1.Router, http_1.Http, websocket_service_1.WebSocketService])
], GameChatComponent);
exports.GameChatComponent = GameChatComponent;
//# sourceMappingURL=gameChat.component.js.map