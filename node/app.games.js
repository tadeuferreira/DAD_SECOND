"use strict";
var mongodb = require('mongodb');
var util = require('util');
var app_database_1 = require("./app.database");
var Game = (function () {
    function Game() {
        var _this = this;
        this.handleError = function (err, response, next) {
            response.send(500, err);
            next();
        };
        this.returnGame = function (id, response, next) {
            app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: id
            })
                .then(function (game) {
                if (game === null) {
                    response.send(404, 'Game not found');
                }
                else {
                    response.json(game);
                }
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.returnGameId = function (id, response, next) {
            app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: id
            })
                .then(function (game) {
                if (game === null) {
                    response.send(404, 'Game not found');
                }
                else {
                    response.json({ _id: id });
                }
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getGames = function (request, response, next) {
            app_database_1.databaseConnection.db.collection('games')
                .find({ state: 'pending' })
                .toArray()
                .then(function (games) {
                response.json(games || []);
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getGame = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            _this.returnGame(id, response, next);
        };
        this.updateGame = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            var game = request.body;
            if (game === undefined) {
                response.send(400, 'No game data');
                return next();
            }
            delete game._id;
            app_database_1.databaseConnection.db.collection('games')
                .updateOne({
                _id: id
            }, {
                $set: game
            })
                .then(function (result) { return _this.returnGame(id, response, next); })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.deleteGame = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            app_database_1.databaseConnection.db.collection('games')
                .deleteOne({
                _id: id
            })
                .then(function (result) {
                if (result.deletedCount === 1) {
                    response.json({
                        msg: util.format('Game -%s- Deleted', id)
                    });
                }
                else {
                    response.send(404, 'No game found');
                }
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.createGame = function (request, response, next) {
            var gameInfo = request.body;
            app_database_1.databaseConnection.db.collection('players').findOne({
                username: gameInfo.player.username
            }).then(function (player) {
                if (player !== null && player.id === gameInfo.player.id) {
                    var game = {
                        ownername: '',
                        owner: null,
                        team1: [{ id: null, avatar: null, username: null, ready: false }, { id: null, avatar: null, username: null, ready: false }],
                        team2: [{ id: null, avatar: null, username: null, ready: false }, { id: null, avatar: null, username: null, ready: false }],
                        basicOrder: [{ id: null }, { id: null }, { id: null }, { id: null }],
                        state: null,
                        renounce1: false,
                        renounce2: false,
                        firstToPlay: 0,
                        lastToPlay: 3,
                        count: 0,
                        creationDate: null,
                        pack: {}
                    };
                    game.ownername = player.username;
                    game.pack = [];
                    game.owner = player._id.toString();
                    game.state = gameInfo.state;
                    game.creationDate = gameInfo.creationDate;
                    app_database_1.databaseConnection.db.collection('games')
                        .insertOne(game)
                        .then(function (result) { return _this.returnGameId(result.insertedId, response, next); })
                        .catch(function (err) { return _this.handleError(err, response, next); });
                }
                else {
                    response.send(400, 'Problem in creating Game');
                    return next();
                }
            }).catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.readyToPlay = function (request, response, next) {
            var game_id = request.body._id;
            var player_id = request.body.player_id;
            app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: new mongodb.ObjectID(game_id)
            })
                .then(function (game) {
                if (game != null) {
                    var alreadyReady = false;
                    for (var i = 0; i < 2; ++i) {
                        if (game.team1[i].id == player_id) {
                            if (game.team1[i].ready)
                                alreadyReady = true;
                            game.team1[i].ready = true;
                        }
                        if (game.team2[i].id == player_id) {
                            if (game.team2[i].ready)
                                alreadyReady = true;
                            game.team2[i].ready = true;
                        }
                    }
                    var isGameReady = false;
                    var count = 0;
                    for (var i = 0; i < 2; ++i) {
                        if (game.team1[i].ready) {
                            count++;
                        }
                        if (game.team2[i].ready) {
                            count++;
                        }
                    }
                    if (count == 4) {
                        isGameReady = true;
                    }
                    delete game._id;
                    app_database_1.databaseConnection.db.collection('games')
                        .updateOne({
                        _id: new mongodb.ObjectID(game_id)
                    }, {
                        $set: game
                    })
                        .then(function (result) {
                        if (isGameReady) {
                            if (alreadyReady)
                                response.send(200, 'gameStartedAlready');
                            else
                                response.send(200, 'gameReady');
                        }
                        else {
                            response.send(200, 'ready');
                        }
                    })
                        .catch(function (err) { return _this.handleError(err, response, next); });
                }
                else {
                    response.send(404, 'No Game found');
                }
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getPlayers = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: id
            })
                .then(function (game) {
                if (game != null) {
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
                            response.json({ team1: team1p, team2: team2p });
                        }).catch(function (err) { return _this.handleError(err, response, next); });
                    }).catch(function (err) { return _this.handleError(err, response, next); });
                }
                else {
                    response.send(404, 'No Game found');
                }
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        // Routes for the games
        this.init = function (server, settings) {
            server.get(settings.prefix + 'games', settings.security.authorize, _this.getGames);
            server.get(settings.prefix + 'games/:id', settings.security.authorize, _this.getGame);
            server.put(settings.prefix + 'games/:id', settings.security.authorize, _this.updateGame);
            server.post(settings.prefix + 'games', settings.security.authorize, _this.createGame);
            server.post(settings.prefix + 'games/ready', settings.security.authorize, _this.readyToPlay);
            server.get(settings.prefix + 'games/players/:id', settings.security.authorize, _this.getPlayers);
            server.del(settings.prefix + 'games/:id', settings.security.authorize, _this.deleteGame);
            console.log("Games routes registered");
        };
    }
    return Game;
}());
exports.Game = Game;
