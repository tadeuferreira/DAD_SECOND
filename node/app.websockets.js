"use strict";
var io = require('socket.io');
var mongodb = require('mongodb');
var app_database_1 = require("./app.database");
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
                    var _this = this;
                    var gameID = new mongodb.ObjectID(msgData._id);
                    var player_id = msgData.player._id;
                    var i = 0;
                    app_database_1.databaseConnection.db.collection('games')
                        .findOne({
                        _id: gameID
                    })
                        .then(function (game) {
                        if (game !== null) {
                            _this.join(msgData._id);
                            if (game.owner == msgData.player._id) {
                                game.state = 'terminated';
                                delete game._id;
                                app_database_1.databaseConnection.db.collection('games')
                                    .updateOne({
                                    _id: gameID
                                }, {
                                    $set: game
                                })
                                    .then(function (result) { _this.emit('exitLobby', { status: 'terminated' }); _this.to(msgData._id).emit('exitLobby', { status: 'terminated' }); })
                                    .catch(function (err) { return _this.emit('initLobbyErr', 'Error'); });
                            }
                            else {
                                for (i = 0; i < 2; ++i) {
                                    if (game.team1[i].id == player_id) {
                                        game.team1[i].id = null;
                                    }
                                }
                                ;
                                for (i = 0; i < 2; ++i) {
                                    if (game.team2[i].id == player_id) {
                                        game.team2[i].id = null;
                                    }
                                }
                                ;
                                delete game._id;
                                app_database_1.databaseConnection.db.collection('games')
                                    .updateOne({
                                    _id: gameID
                                }, {
                                    $set: game
                                })
                                    .then(function (result) {
                                    app_database_1.databaseConnection.db.collection('players')
                                        .find({ $or: [{ _id: new mongodb.ObjectID(game.team1[0].id) }, { _id: new mongodb.ObjectID(game.team1[1].id) }] })
                                        .toArray()
                                        .then(function (team1u) {
                                        app_database_1.databaseConnection.db.collection('players')
                                            .find({ $or: [{ _id: new mongodb.ObjectID(game.team2[0].id) }, { _id: new mongodb.ObjectID(game.team2[1].id) }] })
                                            .toArray()
                                            .then(function (team2u) {
                                            var team1p = [];
                                            var team2p = [];
                                            for (var j = 0; j < team1u.length; ++j) {
                                                team1p.push({ id: team1u[j]._id, username: team1u[j].username, avatar: team1u[j].avatar });
                                            }
                                            for (var k = 0; k < team2u.length; ++k) {
                                                team2p.push({ id: team2u[k]._id, username: team2u[k].username, avatar: team2u[k].avatar });
                                            }
                                            _this.emit('initLobby', { team1: team1p, team2: team2p });
                                            _this.to(msgData._id).emit('initLobby', { team1: team1p, team2: team2p });
                                        }).catch(function (err) { return _this.emit('initLobbyErr', console.log(err)); });
                                    }).catch(function (err) { return _this.emit('initLobbyErr', 'error team 1'); });
                                })
                                    .catch(function (err) { return _this.emit('initLobbyErr', 'Error'); });
                            }
                        }
                    }).catch(function (err) { return _this.emit('initLobbyErr', 'Error'); });
                });
                client.on('initLobby', function (msgData) {
                    var _this = this;
                    var player_id = msgData.player._id;
                    var i = 0;
                    console.log('joing');
                    app_database_1.databaseConnection.db.collection('games')
                        .findOne({
                        _id: new mongodb.ObjectID(msgData._id)
                    })
                        .then(function (game) {
                        if (game !== null) {
                            if (game.state === 'pending') {
                                _this.join(msgData._id);
                                console.log('pending');
                                if (msgData.msg == "Joinning") {
                                    console.log('Joinning');
                                    var ableToJoin = true;
                                    for (i = 0; i < 2; ++i) {
                                        if (game.team1[i].id == player_id) {
                                            ableToJoin = false;
                                        }
                                    }
                                    ;
                                    for (i = 0; i < 2; ++i) {
                                        if (game.team2[i].id == player_id) {
                                            ableToJoin = false;
                                        }
                                    }
                                    ;
                                    console.log(ableToJoin);
                                    if (ableToJoin) {
                                        var isSet = false;
                                        for (i = 0; i < 2; ++i) {
                                            if (game.team1[i].id == null) {
                                                game.team1[i].id = player_id;
                                                i = 2;
                                                isSet = true;
                                            }
                                        }
                                        ;
                                        for (i = 0; i < 2; ++i) {
                                            if (game.team2[i].id == null && !isSet) {
                                                game.team2[i].id = player_id;
                                                i = 2;
                                            }
                                        }
                                        ;
                                    }
                                    delete game._id;
                                    app_database_1.databaseConnection.db.collection('games')
                                        .updateOne({
                                        _id: new mongodb.ObjectID(msgData._id)
                                    }, {
                                        $set: game
                                    })
                                        .then(function (result) {
                                        app_database_1.databaseConnection.db.collection('players')
                                            .find({ $or: [{ _id: new mongodb.ObjectID(game.team1[0].id) }, { _id: new mongodb.ObjectID(game.team1[1].id) }] })
                                            .toArray()
                                            .then(function (team1u) {
                                            app_database_1.databaseConnection.db.collection('players')
                                                .find({ $or: [{ _id: new mongodb.ObjectID(game.team2[0].id) }, { _id: new mongodb.ObjectID(game.team2[1].id) }] })
                                                .toArray()
                                                .then(function (team2u) {
                                                var team1p = [];
                                                var team2p = [];
                                                for (var j = 0; j < team1u.length; ++j) {
                                                    team1p.push({ id: team1u[j]._id, username: team1u[j].username, avatar: team1u[j].avatar });
                                                }
                                                for (var k = 0; k < team2u.length; ++k) {
                                                    team2p.push({ id: team2u[k]._id, username: team2u[k].username, avatar: team2u[k].avatar });
                                                }
                                                _this.emit('initLobby', { team1: team1p, team2: team2p });
                                                _this.to(msgData._id).emit('initLobby', { team1: team1p, team2: team2p });
                                            }).catch(function (err) { return _this.emit('initLobbyErr', console.log(err)); });
                                        }).catch(function (err) { return _this.emit('initLobbyErr', 'error team 1'); });
                                    }).catch(function (err) { return _this.emit('initLobbyErr', 'error update game'); });
                                }
                            }
                        }
                    }).catch(function (err) { return _this.emit('initLobbyErr', err); });
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
