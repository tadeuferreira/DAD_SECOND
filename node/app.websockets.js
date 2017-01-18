"use strict";
var io = require('socket.io');
var mongodb = require('mongodb');
var WebSocketServer = (function () {
    function WebSocketServer() {
        var _this = this;
        this.aboard = [];
        this.dboard = [];
        this.init = function (server) {
            _this.initBoard();
            _this.io = io.listen(server);
            _this.io.sockets.on('connection', function (client) {
                client.on('exitLobby', function (msgData) {
                    console.log(msgData);
                    switch (msgData.msg) {
                        case 'left':
                            this.join(msgData._id);
                            this.emit('initLobby', { _id: msgData._id, msg: 'refresh' });
                            this.to(msgData._id).emit('initLobby', { _id: msgData._id, msg: 'refresh' });
                            break;
                        case 'terminated':
                            this.join(msgData._id);
                            this.emit('exitLobby', { _id: msgData._id, msg: 'terminated' });
                            this.to(msgData._id).emit('exitLobby', { _id: msgData._id, msg: 'terminated' });
                            break;
                    }
                });
                client.on('initLobby', function (msgData) {
                    this.join(msgData._id);
                    switch (msgData.msg) {
                        case 'joining':
                            this.emit('initLobby', { _id: msgData._id, msg: 'refresh' });
                            this.to(msgData._id).emit('initLobby', { _id: msgData._id, msg: 'refresh' });
                            break;
                        case 'already In':
                            this.emit('initLobby', { _id: msgData._id, msg: 'refresh' });
                            this.to(msgData._id).emit('initLobby', { _id: msgData._id, msg: 'refresh' });
                            break;
                    }
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
