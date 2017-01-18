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
        this.getGames = function (request, response, next) {
            app_database_1.databaseConnection.db.collection('games')
                .find({ state: 'pending' })
                .toArray()
                .then(function (games) {
                for (var i = 0; i < games.length; ++i) {
                    var count = 0;
                    for (var j = 0; j < games[i].team1.length; ++j) {
                        if (games[i].team1[j].id != null) {
                            count++;
                        }
                    }
                    for (var k = 0; k < games[i].team1.length; ++k) {
                        if (games[i].team2[k].id != null) {
                            count++;
                        }
                    }
                    games[i].count = count;
                }
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
        /* public createGame =  (request: any, response: any, next: any) => {
             var game = request.body;
             if (game === undefined) {
                 response.send(400, 'No game data');
                 return next();
             }
             database.db.collection('games')
             .insertOne(game)
             .then(result => this.returnGame(result.insertedId, response, next))
             .catch(err => this.handleError(err, response, next));
         }*/
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
                        team1: [{ id: null }, { id: null }],
                        team2: [{ id: null }, { id: null }],
                        state: null,
                        count: 0,
                        creationDate: null,
                        pack: {}
                    };
                    game.ownername = player.username;
                    game.pack = _this.createCards();
                    game.owner = new mongodb.ObjectID(player._id);
                    game.state = gameInfo.state;
                    game.creationDate = gameInfo.creationDate;
                    game.count = 1;
                    app_database_1.databaseConnection.db.collection('games')
                        .insertOne(game)
                        .then(function (result) { return _this.returnGame(result.insertedId, response, next); })
                        .catch(function (err) { return _this.handleError(err, response, next); });
                }
                else {
                    response.send(400, 'Problem in creating Game');
                    return next();
                }
            }).catch(function (err) { return _this.handleError(err, response, next); });
        };
        // Routes for the games
        this.init = function (server, settings) {
            server.get(settings.prefix + 'games', settings.security.authorize, _this.getGames);
            server.get(settings.prefix + 'games/:id', settings.security.authorize, _this.getGame);
            server.put(settings.prefix + 'games/:id', settings.security.authorize, _this.updateGame);
            server.post(settings.prefix + 'games', settings.security.authorize, _this.createGame);
            server.del(settings.prefix + 'games/:id', settings.security.authorize, _this.deleteGame);
            console.log("Games routes registered");
        };
    }
    Game.prototype.createCards = function () {
        var pack = {
            trump: 0,
            cards: {}
        };
        var cards = [];
        for (var i = 0; i < 4; ++i) {
            for (var j = 0; j < 10; ++j) {
                cards.push({ type: j, suit: i, isOnHand: false, isUsed: false, playerOwner: null });
            }
        }
        pack.cards = cards;
        return pack;
    };
    return Game;
}());
exports.Game = Game;
