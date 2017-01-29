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
var Top10PointComponent = (function () {
    function Top10PointComponent(http, router) {
        this.http = http;
        this.router = router;
        this.arrayTop10Point = [];
        this.inputName = '';
        this.getTop10Point();
        this.filteredItems = this.arrayTop10Point;
    }
    Top10PointComponent.prototype.getTop10Point = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        this.http.get('http://localhost:7777/api/v1/top10Points', { headers: headers, withCredentials: false })
            .subscribe(function (response) {
            if (response.ok) {
                _this.arrayTop10Point = response.json();
            }
        }, function (error) {
            console.log(error.text());
        });
    };
    Top10PointComponent.prototype.FilterByName = function () {
        var _this = this;
        this.filteredItems = [];
        if (this.inputName != "") {
            this.arrayTop10Point.forEach(function (element) {
                if (element.name.toUpperCase().indexOf(_this.inputName.toUpperCase()) >= 0) {
                    _this.filteredItems.push(element);
                }
            });
        }
        else {
            this.filteredItems = this.arrayTop10Point;
        }
        console.log(this.filteredItems);
        this.refreshItems();
    };
    Top10PointComponent.prototype.refreshItems = function () {
        this.arrayTop10Point = this.filteredItems;
    };
    return Top10PointComponent;
}());
Top10PointComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'top10Point',
        templateUrl: 'top10Point.component.html'
    }),
    __metadata("design:paramtypes", [http_1.Http, router_1.Router])
], Top10PointComponent);
exports.Top10PointComponent = Top10PointComponent;
//# sourceMappingURL=top10Point.component.js.map