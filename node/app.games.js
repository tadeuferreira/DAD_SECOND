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
                    game.owner = player._id.toString();
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
        this.joinGame = function (request, response, next) {
            var info = request.body;
            app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: new mongodb.ObjectID(info._id)
            }).then(function (game) {
                if (game !== null && game.state == 'pending') {
                    var i = 0;
                    var ableToJoin = false;
                    var alreadyIn = false;
                    for (i = 0; i < 2; ++i) {
                        if (game.team1[i].id == null) {
                            ableToJoin = true;
                        }
                        if (game.team2[i].id == null) {
                            ableToJoin = true;
                        }
                        if (game.team1[i].id == info.player_id || game.team2[i].id == info.player_id) {
                            alreadyIn = true;
                        }
                    }
                    if (ableToJoin && !alreadyIn) {
                        for (i = 0; i < 2; i++) {
                            if (game.team1[i].id == null) {
                                game.team1[i].id = info.player_id;
                                break;
                            }
                            if (game.team2[i].id == null) {
                                game.team2[i].id = info.player_id;
                                break;
                            }
                        }
                        var game_id = game._id;
                        delete game._id;
                        app_database_1.databaseConnection.db.collection('games')
                            .updateOne({
                            _id: game_id
                        }, {
                            $set: game
                        })
                            .then(function (result) {
                            response.send(200, 'joined');
                            return next();
                        })
                            .catch(function (err) { return _this.handleError(err, response, next); });
                    }
                    else if (alreadyIn) {
                        response.send(200, 'already In');
                        return next();
                    }
                    else {
                        response.send(400, 'Game is Full');
                        return next();
                    }
                }
                else {
                    response.send(400, 'Problem in joining Game');
                    return next();
                }
            }).catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.playersGame = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            console.log(id);
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
                    response.send(404, 'No game found');
                }
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.leaveGame = function (request, response, next) {
            var info = request.body;
            console.log(info);
            app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: new mongodb.ObjectID(info._id)
            })
                .then(function (game) {
                var ownerPresent = false;
                if (game !== null) {
                    if (game.owner == info.player_id) {
                        ownerPresent = true;
                        game.state = 'terminated';
                    }
                    else {
                        ownerPresent = false;
                        for (var i = 0; i < 2; ++i) {
                            if (game.team1[i].id == info.player_id) {
                                game.team1[i].id = null;
                            }
                            if (game.team2[i].id == info.player_id) {
                                game.team2[i].id = null;
                            }
                        }
                    }
                    delete game._id;
                    app_database_1.databaseConnection.db.collection('games')
                        .updateOne({
                        _id: new mongodb.ObjectID(info._id)
                    }, {
                        $set: game
                    })
                        .then(function (result) {
                        if (ownerPresent) {
                            response.send(200, 'terminated');
                        }
                        else {
                            response.send(200, 'left');
                        }
                    })
                        .catch(function (err) { return _this.handleError(err, response, next); });
                }
                else {
                    response.send(404, 'No game found');
                }
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.changeTeamGame = function (request, response, next) {
            var info = request.body;
            console.log(info);
            app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: new mongodb.ObjectID(info._id)
            })
                .then(function (game) {
                if (game !== null) {
                    var team = 0;
                    for (var i = 0; i < 2; ++i) {
                        if (game.team1[i].id == info.player_id) {
                            team = 1;
                        }
                        if (game.team2[i].id == info.player_id) {
                            team = 2;
                        }
                    }
                    console.log(info.player_id);
                    console.log(team);
                    var isChanged = false;
                    if (team === 1) {
                        for (var j = 0; j < 2; ++j) {
                            if (game.team2[j].id == null) {
                                game.team2[j].id = info.player_id;
                                isChanged = true;
                                for (var l = 0; l < 2; ++l) {
                                    if (game.team1[l].id == info.player_id) {
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
                                game.team1[k].id = info.player_id;
                                isChanged = true;
                                for (var d = 0; d < 2; ++d) {
                                    if (game.team2[d].id == info.player_id) {
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
                            _id: new mongodb.ObjectID(info._id)
                        }, {
                            $set: game
                        })
                            .then(function (result) {
                            response.send(200, 'changed');
                        })
                            .catch(function (err) { return _this.handleError(err, response, next); });
                    }
                    else {
                        response.send(200, 'full');
                    }
                }
                else {
                    response.send(404, 'No game found');
                }
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.endGame = function (game, response, next) {
            var id = game._id;
            game.state = 'terminated';
            delete game._id;
            app_database_1.databaseConnection.db.collection('games')
                .updateOne({
                _id: id
            }, {
                $set: game
            })
                .then(function (result) { return response.send(200, 'terminated'); })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        // Routes for the games
        this.init = function (server, settings) {
            server.get(settings.prefix + 'games', settings.security.authorize, _this.getGames);
            server.get(settings.prefix + 'games/:id', settings.security.authorize, _this.getGame);
            server.put(settings.prefix + 'games/:id', settings.security.authorize, _this.updateGame);
            server.post(settings.prefix + 'games', settings.security.authorize, _this.createGame);
            server.post(settings.prefix + 'games/join', settings.security.authorize, _this.joinGame);
            server.post(settings.prefix + 'games/leave', settings.security.authorize, _this.leaveGame);
            server.post(settings.prefix + 'games/change', settings.security.authorize, _this.changeTeamGame);
            server.get(settings.prefix + 'games/players/:id', settings.security.authorize, _this.playersGame);
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
