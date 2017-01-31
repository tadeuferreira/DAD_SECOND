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
var http_1 = require("@angular/http");
var Top10StarComponent = (function () {
    function Top10StarComponent(http, router) {
        this.http = http;
        this.router = router;
        this.arrayTop10Star = [];
        this.inputName = '';
        this.getTop10Star();
        this.filteredItems = this.arrayTop10Star;
    }
    Top10StarComponent.prototype.getTop10Star = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        this.http.get('http://40.114.47.134:7777/api/v1/top10Stars', { headers: headers, withCredentials: false })
            .subscribe(function (response) {
            if (response.ok) {
                _this.arrayTop10Star = response.json();
            }
        }, function (error) {
            console.log(error.text());
        });
    };
    Top10StarComponent.prototype.FilterByName = function () {
        var _this = this;
        this.filteredItems = [];
        if (this.inputName != "") {
            this.arrayTop10Star.forEach(function (element) {
                if (element.name.toUpperCase().indexOf(_this.inputName.toUpperCase()) >= 0) {
                    _this.filteredItems.push(element);
                }
            });
        }
        else {
            this.filteredItems = this.arrayTop10Star;
        }
        console.log(this.filteredItems);
        this.refreshItems();
    };
    Top10StarComponent.prototype.refreshItems = function () {
        this.arrayTop10Star = this.filteredItems;
    };
    return Top10StarComponent;
}());
Top10StarComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'top10Star',
        templateUrl: 'top10Star.component.html'
    }),
    __metadata("design:paramtypes", [http_1.Http, router_1.Router])
], Top10StarComponent);
exports.Top10StarComponent = Top10StarComponent;
//# sourceMappingURL=top10Star.component.js.map