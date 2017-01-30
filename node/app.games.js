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
                        onPlay: 0,
                        count: 0,
                        round: 0,
                        table: [null, null, null, null],
                        creationDate: null,
                        firstTrump: null,
                        pack: null,
                        history: []
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
        this.getGameHistory = function (request, response, next) {
            app_database_1.databaseConnection.db.collection('gameHistory')
                .find({ game: { $exists: true } })
                .toArray()
                .then(function (games) {
                response.json(games || []);
                console.log(response.json());
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        // Routes for the games
        this.init = function (server, settings) {
            server.get(settings.prefix + 'games', settings.security.authorize, _this.getGames);
            server.get(settings.prefix + 'gameHistory', _this.getGameHistory);
            server.get(settings.prefix + 'games/:id', settings.security.authorize, _this.getGame);
            server.put(settings.prefix + 'games/:id', settings.security.authorize, _this.updateGame);
            server.post(settings.prefix + 'games', settings.security.authorize, _this.createGame);
            server.get(settings.prefix + 'games/players/:id', settings.security.authorize, _this.getPlayers);
            server.del(settings.prefix + 'games/:id', settings.security.authorize, _this.deleteGame);
            console.log("Games routes registered");
        };
    }
    return Game;
}());
exports.Game = Game;
