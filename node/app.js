"use strict";
var restify = require('restify');
var passport = require('passport');
var path = require('path');
var app_database_1 = require("./app.database");
var app_websockets_1 = require("./app.websockets");
var handler_settings_1 = require("./handler.settings");
var url = 'mongodb://localhost:27017/dad_mongo';
// Create Restify and WebSocket Server
var restifyServer = restify.createServer();
var socketServer = new app_websockets_1.WebSocketServer();
// Prepare and configure Restify Server
restify.CORS.ALLOW_HEADERS.push("content-type");
restifyServer.use(restify.bodyParser());
restifyServer.use(restify.queryParser());
restifyServer.use(restify.CORS());
restifyServer.use(restify.fullResponse());
// Prepare and configure Passport based security
var app_security_1 = require("./app.security");
var security = new app_security_1.Security();
security.initMiddleware(restifyServer);
// Settings are used on all HTTP (Restify) Handlers
var settings = new handler_settings_1.HandlerSettings(socketServer, security, '/api/v1/');
// Authentication Handlers
var app_authentication_1 = require("./app.authentication");
new app_authentication_1.Authentication().init(restifyServer, settings);
// Players Handler
var app_players_1 = require("./app.players");
new app_players_1.Player().init(restifyServer, settings);
// Games Handler
var app_games_1 = require("./app.games");
new app_games_1.Game().init(restifyServer, settings);
restifyServer.get(/^\/(?!api\/).*/, restify.serveStatic({
    directory: './angular',
    default: 'index.html'
}));
app_database_1.databaseConnection.connect(url, function () {
    restifyServer.listen(7777, function () { return console.log('%s listening at %s', restifyServer.name, restifyServer.url); });
    // Websocket is initialized after the server
    socketServer.init(restifyServer.server);
});
