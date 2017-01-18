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
        this.getTop10Star();
    }
    Top10StarComponent.prototype.getTop10Star = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        this.http.get('http://localhost:7777/api/v1/top10Stars', { headers: headers, withCredentials: false })
            .subscribe(function (response) {
            if (response.ok) {
                _this.arrayTop10Star = response.json();
                // console.log(response.json);
                console.log(_this.arrayTop10Star);
            }
        }, function (error) {
            console.log(error.text());
        });
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