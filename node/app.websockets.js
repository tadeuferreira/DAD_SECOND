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
                //chat 
                client.emit('players', new Date().toLocaleTimeString('en-US', { hour12: false,
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric" }) + ': Welcome to Sueca (card game) Chat');
                client.broadcast.emit('players', new Date().toLocaleTimeString('en-US', { hour12: false,
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric" }) + ': A new player has arrived');
                client.on('chat', function (data) { return _this.io.emit('chat', data); });
                client.on('chatGame', function (msgData) {
                    this.join(msgData.game_id);
                    this.emit('chatGame', new Date().toLocaleTimeString('en-US', { hour12: false,
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric" }) + ': ' + msgData.username + ': ' + msgData.msg);
                    this.to(msgData.game_id).emit('chatGame', new Date().toLocaleTimeString('en-US', { hour12: false,
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric" }) + ': ' + msgData.username + ': ' + msgData.msg);
                });
                client.on('gameNotification', function (msgData) {
                    this.join(msgData.game_id);
                    this.emit('gameNotification', msgData.username + ': Welcome to game Room ' + msgData.game_id);
                    this.broadcast.to(msgData.game_id).emit('gameNotification', new Date().toLocaleTimeString('en-US', { hour12: false,
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric" }) + ': ' + msgData.username + ' has arrived');
                });
                client.on('gamePlay', function (msgData) {
                    switch (msgData.msg) {
                        case 'startGame':
                            this.join(msgData._id);
                            this.emit('gamePlay', { _id: msgData._id, msg: 'play', pos: 0 });
                            this.to(msgData._id).emit('gamePlay', { _id: msgData._id, msg: 'play', pos: 0 });
                            break;
                        case 'next':
                            this.join(msgData._id);
                            this.emit('gamePlay', { _id: msgData._id, msg: 'update', pos: msgData.my_pos, card: msgData.card });
                            this.to(msgData._id).emit('gamePlay', { _id: msgData._id, msg: 'update', pos: msgData.my_pos, card: msgData.card });
                            this.emit('gamePlay', { _id: msgData._id, msg: 'play', pos: msgData.next_pos });
                            this.to(msgData._id).emit('gamePlay', { _id: msgData._id, msg: 'play', pos: msgData.next_pos });
                            break;
                    }
                });
                client.on('exitLobby', function (msgData) {
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
                        case 'start':
                            this.emit('initLobby', { _id: msgData._id, msg: 'startGame' });
                            this.to(msgData._id).emit('initLobby', { _id: msgData._id, msg: 'startGame' });
                            break;
                        case 'already In':
                            this.emit('initLobby', { _id: msgData._id, msg: 'refresh' });
                            this.to(msgData._id).emit('initLobby', { _id: msgData._id, msg: 'refresh' });
                            break;
                        case 'changed':
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
