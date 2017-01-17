"use strict";
var io = require('socket.io');
var mongodb = require('mongodb');
var app_database_1 = require("./app.database");
var player_1 = require("./gameEngine/player");
var WebSocketServer = (function () {
    function WebSocketServer() {
        var _this = this;
        this.aboard = [];
        this.dboard = [];
        this.init = function (server) {
            _this.initBoard();
            _this.io = io.listen(server);
            _this.io.sockets.on('connection', function (client) {
                /*
                client.emit('players', Date.now() + ': Welcome to battleship');
                client.broadcast.emit('players', Date.now() + ': A new player has arrived');
                client.on('chat', (data) => this.io.emit('chat', data));
                console.log("login");
                //Extra Exercise
                client.emit('aboard', this.aboard);
                client.emit('dboard', this.dboard);
    
                client.on('clickElement%dboard', (indexElement) => {
                    this.dboard[indexElement]++;
                    if (this.dboard[indexElement] > 2) {
                        this.dboard[indexElement] = 0;
                    }
                    this.notifyAll('dboard', this.dboard);
                });
                client.on('clickElement%aboard', (indexElement) => {
                    this.aboard[indexElement]++;
                    if (this.aboard[indexElement] > 2) {
                        this.aboard[indexElement] = 0;
                    }
                    this.notifyAll('aboard', this.aboard);
                });
                */
                client.on('initLobby', function (msgData) {
                    var _this = this;
                    //check if game exists 
                    console.log(msgData);
                    var gameID = new mongodb.ObjectID(msgData._id);
                    app_database_1.databaseConnection.db.collection('games')
                        .findOne({
                        _id: gameID
                    })
                        .then(function (game) {
                        if (game !== null) {
                            // console.log(game);
                            if (game.state === 'pending') {
                                console.log('pending');
                                _this.join(msgData._id);
                                if (msgData.msg == "Joinning") {
                                    console.log('joining');
                                    console.log(game.owner == new mongodb.ObjectID(msgData.player._id));
                                    console.log(game.owner == msgData.player._id);
                                    if (game.owner == msgData.player._id) {
                                        console.log('owner');
                                        var player = new player_1.Player(player_1.PlayerClass.owner, msgData.player.avatar, msgData.player.username, msgData.player._id);
                                        console.log(player);
                                        _this.emit('initLobby', player);
                                    }
                                    else {
                                        if (game.second !== null) {
                                            var player = new player_1.Player(player_1.PlayerClass.two, msgData.player.avatar, msgData.player.username, msgData.player._id);
                                            game.second = new mongodb.ObjectID(msgData.player._id);
                                            delete game._id;
                                            app_database_1.databaseConnection.db.collection('games')
                                                .updateOne({
                                                _id: gameID
                                            }, {
                                                $set: game
                                            })
                                                .then(function (result) { return _this.emit('initLobby', player); })
                                                .catch(function (err) { return _this.emit('initLobbyErr', 'Error'); });
                                        }
                                        else if (game.third !== null) {
                                            var player = new player_1.Player(player_1.PlayerClass.three, msgData.player.avatar, msgData.player.username, msgData.player._id);
                                            game.third = new mongodb.ObjectID(msgData.player._id);
                                            delete game._id;
                                            app_database_1.databaseConnection.db.collection('games')
                                                .updateOne({
                                                _id: gameID
                                            }, {
                                                $set: game
                                            })
                                                .then(function (result) { return _this.emit('initLobby', player); })
                                                .catch(function (err) { return _this.emit('initLobbyErr', 'Error'); });
                                        }
                                        else if (game.fourth !== null) {
                                            var player = new player_1.Player(player_1.PlayerClass.four, msgData.player.avatar, msgData.player.username, msgData.player._id);
                                            game.second = new mongodb.ObjectID(msgData.player._id);
                                            delete game._id;
                                            app_database_1.databaseConnection.db.collection('games')
                                                .updateOne({
                                                _id: gameID
                                            }, {
                                                $set: game
                                            })
                                                .then(function (result) { return _this.emit('initLobby', player); })
                                                .catch(function (err) { return _this.emit('initLobbyErr', 'Error'); });
                                        }
                                    }
                                }
                            }
                        }
                    }).catch(function (err) { return _this.emit('initLobbyErr', 'Error'); });
                    //if msg == joinning
                    //if is owner 
                    //emit owner player
                    //else check available position and join
                    //add to db
                    //if is full 
                    //emit player then statr the game
                    //else
                    //emit player
                    //if msg == change team
                    //do team code
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
