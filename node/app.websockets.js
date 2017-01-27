"use strict";
var io = require('socket.io');
var mongodb = require('mongodb');
var app_database_1 = require("./app.database");
var WebSocketServer = (function () {
    function WebSocketServer() {
        var _this = this;
        this.init = function (server) {
            _this.io = io.listen(server);
            _this.io.sockets.on('connection', function (client) {
                client.on('chat', function (data) { return _this.io.emit('chat', data); });
                client.on('players', function (msgData) {
                    this.emit('players', new Date().toLocaleTimeString('en-US', { hour12: false,
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric" }) + ': Welcome to Sueca (card game) Global Chat');
                    this.broadcast.emit('players', new Date().toLocaleTimeString('en-US', { hour12: false,
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric" }) + ': ' + msgData.username + ' has enter the chat');
                });
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
                    this.emit('gameNotification', new Date().toLocaleTimeString('en-US', { hour12: false,
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric" }) + ': ' + msgData.username + ': Welcome to Game Room');
                    this.broadcast.to(msgData.game_id).emit('gameNotification', new Date().toLocaleTimeString('en-US', { hour12: false,
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric" }) + ': ' + msgData.username + ' has arrived');
                });
                client.on('gameLobby', function (msgData) {
                    console.log('gameLobby');
                    switch (msgData.msg) {
                        case 'join':
                            _this.joinGame(msgData, client);
                            break;
                        case 'switch':
                            _this.changeTeamGame(msgData, client);
                            break;
                        case 'leave':
                            _this.leaveGame(msgData, client);
                            break;
                    }
                });
            });
        };
        this.responseGame = function (msgData, client, response) {
            console.log('response');
            client.join(msgData._id);
            var data;
            switch (response) {
                case 'changed':
                case 'joined':
                case 'left':
                    data = { msg: 'update' };
                    break;
                case 'start':
                    data = { msg: 'start' };
                    break;
                case 'full':
                    data = { msg: 'leave' };
                    break;
                case 'switch_fail':
                    data = { msg: 'switch_fail' };
                    break;
                case 'terminated':
                    data = { msg: 'terminated' };
                    break;
            }
            console.log(data);
            client.emit('gameLobby', data);
            if (response != 'switch_fail')
                client.to(msgData._id).emit('gameLobby', data);
        };
        this.notifyAll = function (channel, message) {
            _this.io.sockets.emit(channel, message);
        };
        this.joinGame = function (msgData, client) {
            console.log('join Game');
            return app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: new mongodb.ObjectID(msgData._id)
            }).then(function (game) {
                if (game !== null && game.state == 'pending') {
                    console.log('Game');
                    var ableToJoin = false;
                    var alreadyIn = false;
                    for (i = 0; i < 2; ++i) {
                        if (game.team1[i].id == null) {
                            ableToJoin = true;
                        }
                        if (game.team2[i].id == null) {
                            ableToJoin = true;
                        }
                        if (game.team1[i].id == msgData.player_id || game.team2[i].id == msgData.player_id) {
                            alreadyIn = true;
                        }
                    }
                    if (ableToJoin && !alreadyIn) {
                        for (var i = 0; i < 2; i++) {
                            if (game.team1[i].id == null) {
                                game.team1[i].id = msgData.player_id;
                                game.team1[i].avatar = msgData.player_avatar;
                                game.team1[i].username = msgData.player_username;
                                break;
                            }
                            if (game.team2[i].id == null) {
                                game.team2[i].id = msgData.player_id;
                                game.team2[i].avatar = msgData.player_avatar;
                                game.team2[i].username = msgData.player_username;
                                break;
                            }
                        }
                        game.count++;
                        game = _this.startGame(game);
                        var game_id = game._id;
                        delete game._id;
                        app_database_1.databaseConnection.db.collection('games')
                            .updateOne({
                            _id: game_id
                        }, {
                            $set: game
                        })
                            .then(function (result) {
                            if (game.count == 4) {
                                _this.responseGame(msgData, client, 'start');
                            }
                            else {
                                _this.responseGame(msgData, client, 'joined');
                            }
                        })
                            .catch(function (err) { return console.log(err.msg); });
                    }
                    else if (alreadyIn) {
                        _this.responseGame(msgData, client, 'joined');
                    }
                    else {
                        _this.responseGame(msgData, client, 'full');
                    }
                }
                else {
                    console.log('game not found or not on pending');
                }
            }).catch(function (err) { return console.log(err.msg); });
        };
        this.startGame = function (game) {
            if (game.count == 4) {
                game.state = 'in Progress';
                var team = _this.getRandomInt(1, 2);
                var pos = _this.getRandomInt(0, 1);
                var first_team = -1;
                var first_pos = -1;
                var first;
                //selects the first player to play;
                if (team == 1) {
                    first = game.team1[pos].id;
                }
                else if (team == 2) {
                    first = game.team2[pos].id;
                }
                for (var i = 0; i < 2; ++i) {
                    if (game.team1[i].id == first) {
                        first_team = 1;
                        first_pos = i;
                    }
                    if (game.team2[i].id == first) {
                        first_team = 2;
                        first_pos = i;
                    }
                }
                var player_list = [];
                // third player is first's friend
                game.basicOrder[0] = (first_team == 1 ? game.team1[first_pos].id : game.team2[first_pos].id);
                game.basicOrder[1] = (first_team == 1 ? (first_pos == 0 ? game.team2[1].id : game.team2[0].id) : (first_pos == 0 ? game.team1[1].id : game.team1[0].id));
                game.basicOrder[2] = (first_team == 1 ? (first_pos == 0 ? game.team1[1].id : game.team1[0].id) : (first_pos == 0 ? game.team2[1].id : game.team2[0].id));
                game.basicOrder[3] = (first_team == 1 ? (first_pos == 0 ? game.team2[0].id : game.team2[1].id) : (first_pos == 0 ? game.team1[0].id : game.team1[1].id));
                game.pack = _this.createCards();
            }
            return game;
        };
        this.changeTeamGame = function (msgData, client) {
            app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: new mongodb.ObjectID(msgData._id)
            })
                .then(function (game) {
                if (game !== null) {
                    var team = 0;
                    for (var i = 0; i < 2; ++i) {
                        if (game.team1[i].id == msgData.player_id) {
                            team = 1;
                        }
                        if (game.team2[i].id == msgData.player_id) {
                            team = 2;
                        }
                    }
                    var isChanged = false;
                    if (team === 1) {
                        for (var j = 0; j < 2; ++j) {
                            if (game.team2[j].id == null) {
                                game.team2[j].id = msgData.player_id;
                                isChanged = true;
                                for (var l = 0; l < 2; ++l) {
                                    if (game.team1[l].id == msgData.player_id) {
                                        game.team1[l].id = null;
                                    }
                                }
                                j = 0;
                                break;
                            }
                        }
                    }
                    else if (team === 2) {
                        for (var k = 0; k < 2; ++k) {
                            if (game.team1[k].id == null) {
                                game.team1[k].id = msgData.player_id;
                                isChanged = true;
                                for (var d = 0; d < 2; ++d) {
                                    if (game.team2[d].id == msgData.player_id) {
                                        game.team2[d].id = null;
                                    }
                                }
                                k = 0;
                                break;
                            }
                        }
                    }
                    if (isChanged) {
                        delete game._id;
                        app_database_1.databaseConnection.db.collection('games')
                            .updateOne({
                            _id: new mongodb.ObjectID(msgData._id)
                        }, {
                            $set: game
                        })
                            .then(function (result) {
                            _this.responseGame(msgData, client, 'changed');
                        })
                            .catch(function (err) { return console.log(err.msg); });
                    }
                    else {
                        _this.responseGame(msgData, client, 'switch_fail');
                    }
                }
                else {
                    console.log('game not found');
                }
            })
                .catch(function (err) { return console.log(err.msg); });
        };
        this.leaveGame = function (msgData, client) {
            app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: new mongodb.ObjectID(msgData._id)
            })
                .then(function (game) {
                var ownerPresent = false;
                if (game !== null) {
                    if (game.owner == msgData.player_id) {
                        ownerPresent = true;
                        game.state = 'terminated';
                    }
                    else {
                        ownerPresent = false;
                        for (var i = 0; i < 2; ++i) {
                            if (game.team1[i].id == msgData.player_id) {
                                game.team1[i].id = null;
                            }
                            if (game.team2[i].id == msgData.player_id) {
                                game.team2[i].id = null;
                            }
                        }
                    }
                    var count = 0;
                    for (var i = 0; i < 2; ++i) {
                        if (game.team1[i].id != null) {
                            count++;
                        }
                        if (game.team2[i].id != null) {
                            count++;
                        }
                    }
                    game.count = count;
                    delete game._id;
                    app_database_1.databaseConnection.db.collection('games')
                        .updateOne({
                        _id: new mongodb.ObjectID(msgData._id)
                    }, {
                        $set: game
                    })
                        .then(function (result) {
                        if (ownerPresent) {
                            _this.responseGame(msgData, client, 'terminated');
                        }
                        else {
                            _this.responseGame(msgData, client, 'left');
                        }
                    })
                        .catch(function (err) { return console.log(err.msg); });
                }
                else {
                    console.log('game not found');
                }
            })
                .catch(function (err) { return console.log(err.msg); });
        };
    }
    WebSocketServer.prototype.createCards = function () {
        var pack = {
            suitTrump: -1,
            cards: {}
        };
        var cards = [];
        for (var i = 0; i < 4; ++i) {
            for (var j = 0; j < 10; ++j) {
                cards.push({ type: j, suit: i, isOnHand: false, isOnTable: false, isUsed: false, playerOwner: null, isTrump: false });
            }
        }
        cards = this.shuffleArray(cards);
        pack.cards = cards;
        return pack;
    };
    ;
    WebSocketServer.prototype.shuffleArray = function (array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };
    ;
    WebSocketServer.prototype.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    ;
    return WebSocketServer;
}());
exports.WebSocketServer = WebSocketServer;
;
