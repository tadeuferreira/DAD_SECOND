"use strict";
var io = require('socket.io');
var WebSocketServer = (function () {
    function WebSocketServer() {
        var _this = this;
        this.aboard = [];
        this.dboard = [];
        this.init = function (server) {
            _this.initBoard();
            _this.io = io.listen(server);
            _this.io.sockets.on('connection', function (client) {
                client.emit('players', Date.now() + ': Welcome to battleship');
                client.broadcast.emit('players', Date.now() + ': A new player has arrived');
                client.on('chat', function (data) { return _this.io.emit('chat', data); });
                console.log("login");
                //Extra Exercise
                client.emit('aboard', _this.aboard);
                client.emit('dboard', _this.dboard);
                client.on('clickElement%dboard', function (indexElement) {
                    _this.dboard[indexElement]++;
                    if (_this.dboard[indexElement] > 2) {
                        _this.dboard[indexElement] = 0;
                    }
                    _this.notifyAll('dboard', _this.dboard);
                });
                client.on('clickElement%aboard', function (indexElement) {
                    _this.aboard[indexElement]++;
                    if (_this.aboard[indexElement] > 2) {
                        _this.aboard[indexElement] = 0;
                    }
                    _this.notifyAll('aboard', _this.aboard);
                });
            });
        };
        this.notifyAll = function (channel, message) {
            _this.io.sockets.emit(channel, message);
        };
    }
    WebSocketServer.prototype.initBoard = function () {
        for (var i = 0; i < 100; i++) {
            this.aboard[i] = 0;
            this.dboard[i] = 0;
        }
    };
    return WebSocketServer;
}());
exports.WebSocketServer = WebSocketServer;
;
