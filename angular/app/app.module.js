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
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var app_component_1 = require("./app.component");
var router_1 = require("@angular/router");
var notifications_module_1 = require("./notifications/notifications.module");
var chat_component_1 = require("./chat.component");
var aboard_component_1 = require("./game/aboard.component");
var dboard_component_1 = require("./game/dboard.component");
var websocket_service_1 = require("./notifications/websocket.service");
var menu_component_1 = require("./menu/menu.component");
var dashboard_component_1 = require("./menu/dashboard.component");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            notifications_module_1.NotificationModule,
            forms_1.FormsModule,
            router_1.RouterModule.forRoot([
                {
                    path: '',
                    redirectTo: '/dashboard',
                    pathMatch: 'full'
                },
                {
                    path: 'menu',
                    component: menu_component_1.MenuComponent
                },
                {
                    path: 'dashboard',
                    component: dashboard_component_1.DashboardComponent
                }
            ])
        ],
        declarations: [app_component_1.AppComponent, menu_component_1.MenuComponent, chat_component_1.ChatComponent, aboard_component_1.ABoardComponent, dboard_component_1.DBoardComponent, dashboard_component_1.DashboardComponent],
        providers: [websocket_service_1.WebSocketService],
        bootstrap: [app_component_1.AppComponent]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map