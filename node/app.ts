const restify = require('restify');
const passport = require('passport');
const path = require('path');

import {databaseConnection as database} from './app.database';
import {WebSocketServer} from './app.websockets';
import {HandlerSettings} from './handler.settings';

const url = 'mongodb://localhost:27017/dad_mongo';

// Create Restify and WebSocket Server
const restifyServer = restify.createServer();
const socketServer = new WebSocketServer();

// Prepare and configure Restify Server
restify.CORS.ALLOW_HEADERS.push("content-type");
restifyServer.use(restify.bodyParser());
restifyServer.use(restify.queryParser());
restifyServer.use(restify.CORS());
restifyServer.use(restify.fullResponse());

// Prepare and configure Passport based security
import {Security} from './app.security';
let security = new Security();
security.initMiddleware(restifyServer);

// Settings are used on all HTTP (Restify) Handlers
let settings = new HandlerSettings(socketServer, security,'/api/v1/');

// Authentication Handlers
import {Authentication} from './app.authentication';
new Authentication().init(restifyServer, settings);


// Players Handler
import {Player} from './app.players';
new Player().init(restifyServer, settings);

// Games Handler
import {Game} from './app.games';
new Game().init(restifyServer, settings);

restifyServer.get(/^\/(?!api\/).*/, restify.serveStatic({
  directory: './angular',
  default: 'index.html'
}));

database.connect(url, () => {
    restifyServer.listen(7777, () => console.log('%s listening at %s', restifyServer.name, restifyServer.url));
    // Websocket is initialized after the server
    socketServer.init(restifyServer.server);
});
