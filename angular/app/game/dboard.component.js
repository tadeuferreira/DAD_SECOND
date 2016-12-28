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
var DBoardComponent = (function () {
    function DBoardComponent(websocketService) {
        this.websocketService = websocketService;
        this.elementos = [];
    }
    DBoardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.elementos = [];
        this.websocketService.getBoardMessages("dboard").subscribe(function (m) {
            console.log(m);
            _this.elementos = m;
        });
    };
    DBoardComponent.prototype.clickElemento = function (index) {
        this.websocketService.sendClickElementMessage(index, "dboard");
    };
    DBoardComponent.prototype.getColor = function (elemento) {
        switch (elemento) {
            case 0: return 'lightgray';
            case 1: return 'blue';
            case 2: return 'red';
        }
        return 'white';
    };
    return DBoardComponent;
}());
DBoardComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'dboard',
        templateUrl: 'board.component.html',
        styleUrls: ['board.component.css']
    }),
    __metadata("design:paramtypes", [websocket_service_1.WebSocketService])
], DBoardComponent);
exports.DBoardComponent = DBoardComponent;
//# sourceMappingURL=dboard.component.js.map