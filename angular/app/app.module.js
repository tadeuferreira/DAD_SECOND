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
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var forms_2 = require("@angular/forms");
var app_component_1 = require("./app.component");
var websocket_service_1 = require("./notifications/websocket.service");
var notifications_module_1 = require("./notifications/notifications.module");
var chat_component_1 = require("./chat.component");
var gameChat_component_1 = require("./gameCards/gameChat.component");
var menu_component_1 = require("./menu/menu.component");
var dashboard_component_1 = require("./menu/dashboard.component");
var home_component_1 = require("./menu/home.component");
var top10Star_component_1 = require("./menu/top10Star.component");
var top10Point_component_1 = require("./menu/top10Point.component");
var login_component_1 = require("./auth/login.component");
var register_component_1 = require("./auth/register.component");
var user_service_1 = require("./auth/user.service");
var game_service_1 = require("./gameCards/game.service");
var gameLobby_component_1 = require("./gameCards/gameLobby.component");
var newGame_component_1 = require("./gameCards/newGame.component");
var gameSearch_component_1 = require("./gameCards/gameSearch.component");
var game_component_1 = require("./gameCards/game.component");
var app_routing_1 = require("./app.routing");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule,
            notifications_module_1.NotificationModule,
            forms_2.FormsModule,
            forms_1.ReactiveFormsModule,
            app_routing_1.Routing
        ],
        declarations: [app_component_1.AppComponent,
            home_component_1.HomeComponent,
            top10Star_component_1.Top10StarComponent,
            top10Point_component_1.Top10PointComponent,
            gameSearch_component_1.GameSearchComponent,
            newGame_component_1.NewGameComponent,
            game_component_1.GameComponent,
            gameLobby_component_1.GameLobbyComponent,
            login_component_1.LoginComponent,
            register_component_1.RegisterComponent,
            menu_component_1.MenuComponent,
            chat_component_1.ChatComponent,
            gameChat_component_1.GameChatComponent,
            dashboard_component_1.DashboardComponent
        ],
        providers: [websocket_service_1.WebSocketService, user_service_1.UserService, game_service_1.GameService],
        bootstrap: [app_component_1.AppComponent]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map