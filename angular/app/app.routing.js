"use strict";
var router_1 = require("@angular/router");
var dashboard_component_1 = require("./menu/dashboard.component");
var home_component_1 = require("./menu/home.component");
var top10Star_component_1 = require("./menu/top10Star.component");
var top10Point_component_1 = require("./menu/top10Point.component");
var login_component_1 = require("./auth/login.component");
var register_component_1 = require("./auth/register.component");
var profile_component_1 = require("./auth/profile.component");
var gameLobby_component_1 = require("./gameCards/gameLobby.component");
var newGame_component_1 = require("./gameCards/newGame.component");
var gameSearch_component_1 = require("./gameCards/gameSearch.component");
var game_component_1 = require("./gameCards/game.component");
var gameHistory_component_1 = require("./gameCards/gameHistory.component");
var appRoutes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: dashboard_component_1.DashboardComponent
    },
    {
        path: 'profile',
        component: profile_component_1.ProfileComponent
    },
    {
        path: 'login',
        component: login_component_1.LoginComponent
    },
    {
        path: 'register',
        component: register_component_1.RegisterComponent
    },
    {
        path: 'game/new',
        component: newGame_component_1.NewGameComponent
    },
    {
        path: 'game/play',
        component: gameLobby_component_1.GameLobbyComponent
    },
    {
        path: 'games',
        component: gameSearch_component_1.GameSearchComponent
    },
    {
        path: 'top10Stars',
        component: top10Star_component_1.Top10StarComponent
    },
    {
        path: 'top10Points',
        component: top10Point_component_1.Top10PointComponent
    },
    {
        path: 'gamesHistory',
        component: gameHistory_component_1.GameHistoryComponent
    },
    {
        path: 'game/playing',
        component: game_component_1.GameComponent
    },
    {
        path: 'home',
        component: home_component_1.HomeComponent
    }
];
exports.Routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map