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
            var player = request.body;
            console.log(player);
            if (player === undefined) {
                response.send(400, 'No player data');
                return next();
            }
            if (player.username === undefined || player.username === "") {
                response.send(400, 'No player username');
                return next();
            }
            if (player.password === undefined || player.password === "") {
                response.send(400, 'No player password');
                return next();
            }
            if (player.email === undefined || player.email === "") {
                response.send(400, 'No player email');
                return next();
            }
            app_database_1.databaseConnection.db.collection('players').findOne({
                username: player.username
            }).then(function (player) {
                if (player !== null) {
                    response.send(400, 'Player already exist');
                    return next();
                }
            }).catch(function (err) { return _this.handleError(err, response, next); });
            app_database_1.databaseConnection.db.collection('players').findOne({
                email: player.email
            }).then(function (player) {
                if (player !== null) {
                    response.send(400, 'Player already exist');
                    return next();
                }
            }).catch(function (err) { return _this.handleError(err, response, next); });
            player.password = sha1(player.password);
            app_database_1.databaseConnection.db.collection('players')
                .insertOne(player)
                .then(function (result) { return _this.returnPlayer(result.insertedId, response, next); })
                .catch(function (err) { return _this.handleError(err, response, next); });
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
                .find({ totalEstrelas: { $exists: true } })
                .sort({ totalEstrelas: -1 })
                .limit(10)
                .toArray()
                .then(function (players) {
                response.json(players || []);
                _this.settings.wsServer.notifyAll('players', Date.now() + ': Somebody accessed top 10 Star');
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getTop10Point = function (request, response, next) {
            app_database_1.databaseConnection.db.collection('players')
                .find({ totalPontos: { $exists: true } })
                .sort({ totalPontos: -1 })
                .limit(10)
                .toArray()
                .then(function (players) {
                response.json(players || []);
                _this.settings.wsServer.notifyAll('players', Date.now() + ': Somebody accessed top 10 Point');
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
