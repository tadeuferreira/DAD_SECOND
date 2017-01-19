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
var MenuComponent = (function () {
    function MenuComponent() {
    }
    MenuComponent.prototype.ngOnInit = function () {
    };
    return MenuComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], MenuComponent.prototype, "hidden", void 0);
MenuComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'menu',
        templateUrl: 'menu.component.html',
    })
], MenuComponent);
exports.MenuComponent = MenuComponent;
//# sourceMappingURL=menu.component.js.map