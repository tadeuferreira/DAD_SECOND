"use strict";
var mongodb = require('mongodb');
var util = require('util');
var sha1 = require('sha1');
var app_database_1 = require("./app.database");
var Player = (function () {
    function Player() {
        var _this = this;
        this.settings = null;
        this.handleError = function (err, response, next) {
            response.send(500, err);
            next();
        };
        this.returnPlayer = function (id, response, next) {
            app_database_1.databaseConnection.db.collection('players')
                .findOne({
                _id: id
            })
                .then(function (player) {
                if (player === null) {
                    response.send(404, 'Player not found');
                }
                else {
                    response.json(player);
                }
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getPlayers = function (request, response, next) {
            app_database_1.databaseConnection.db.collection('players')
                .find()
                .toArray()
                .then(function (players) {
                response.json(players || []);
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getPlayer = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            _this.returnPlayer(id, response, next);
        };
        this.updatePlayer = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            var player = request.body;
            if (player === undefined) {
                response.send(400, 'No player data');
                return next();
            }
            delete player._id;
            player.password = sha1(player.password);
            app_database_1.databaseConnection.db.collection('players')
                .updateOne({
                _id: id
            }, {
                $set: player
            })
                .then(function (result) { return _this.returnPlayer(id, response, next); })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.createPlayer = function (request, response, next) {
            var newplayer = request.body;
            if (newplayer === undefined) {
                response.send(400, 'No player data');
                return next();
            }
            if (newplayer.username === undefined || newplayer.username === "") {
                response.send(400, 'No player username');
                return next();
            }
            if (newplayer.name === undefined || newplayer.name === "") {
                response.send(400, 'No player name');
                return next();
            }
            if (newplayer.password === undefined || newplayer.password === "") {
                response.send(400, 'No player password');
                return next();
            }
            if (newplayer.email === undefined || newplayer.email === "") {
                response.send(400, 'No player email');
                return next();
            }
            app_database_1.databaseConnection.db.collection('players').findOne({
                username: newplayer.username
            }).then(function (player) {
                if (player !== null) {
                    response.send(400, 'Player already exist');
                    return next();
                }
                else {
                    app_database_1.databaseConnection.db.collection('players').findOne({
                        email: newplayer.email
                    }).then(function (player) {
                        if (player !== null) {
                            response.send(400, 'Player already exist');
                            return next();
                        }
                        else {
                            newplayer.password = sha1(newplayer.password);
                            app_database_1.databaseConnection.db.collection('players')
                                .insertOne(newplayer)
                                .then(function (result) { return _this.returnPlayer(result.insertedId, response, next); })
                                .catch(function (err) { return _this.handleError(err, response, next); });
                        }
                    }).catch(function (err) { return _this.handleError(err, response, next); });
                }
            }).catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.deletePlayer = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            app_database_1.databaseConnection.db.collection('players')
                .deleteOne({
                _id: id
            })
                .then(function (result) {
                if (result.deletedCount === 1) {
                    response.json({
                        msg: util.format('Player -%s- Deleted', id)
                    });
                }
                else {
                    response.send(404, 'No player found');
                }
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getTop10Star = function (request, response, next) {
            app_database_1.databaseConnection.db.collection('players')
                .find({ totalStars: { $exists: true } })
                .sort({ totalStars: -1 })
                .limit(10)
                .toArray()
                .then(function (players) {
                response.json(players || []);
                _this.settings.wsServer.notifyAll('players', new Date().toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric"
                }) + ': Somebody accessed top 10 Star');
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getTop10Point = function (request, response, next) {
            app_database_1.databaseConnection.db.collection('players')
                .find({ totalPoints: { $exists: true } })
                .sort({ totalPoints: -1 })
                .limit(10)
                .toArray()
                .then(function (players) {
                response.json(players || []);
                _this.settings.wsServer.notifyAll('players', new Date().toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric"
                }) + ': Somebody accessed top 10 Point');
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        // Routes for the games
        this.init = function (server, settings) {
            _this.settings = settings;
            server.get(settings.prefix + 'top10Stars', _this.getTop10Star);
            server.get(settings.prefix + 'top10Points', _this.getTop10Point);
            server.get(settings.prefix + 'players', settings.security.authorize, _this.getPlayers);
            server.get(settings.prefix + 'players/:id', settings.security.authorize, _this.getPlayer);
            server.put(settings.prefix + 'players/:id', settings.security.authorize, _this.updatePlayer);
            server.post(settings.prefix + 'register', _this.createPlayer);
            server.del(settings.prefix + 'players/:id', settings.security.authorize, _this.deletePlayer);
            console.log("Players routes registered");
        };
    }
    return Player;
}());
exports.Player = Player;
