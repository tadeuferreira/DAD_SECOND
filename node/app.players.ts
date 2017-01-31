const mongodb = require('mongodb');
const util = require('util');
const sha1 = require('sha1');

import { HandlerSettings } from './handler.settings';
import { databaseConnection as database } from './app.database';

export class Player {

    private settings: HandlerSettings = null;

    private handleError = (err: string, response: any, next: any) => {
        response.send(500, err);
        next();
    }

    private returnPlayer = (id: string, response: any, next: any) => {
        database.db.collection('players')
            .findOne({
                _id: id
            })
            .then((player) => {
                if (player === null) {
                    response.send(404, 'Player not found');
                } else {
                    response.json(player);
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getPlayers = (request: any, response: any, next: any) => {
        database.db.collection('players')
            .find()
            .toArray()
            .then(players => {
                response.json(players || []);
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getPlayer = (request: any, response: any, next: any) => {
        const id = new mongodb.ObjectID(request.params.id);
        this.returnPlayer(id, response, next);
    }

    public updatePlayer = (request: any, response: any, next: any) => {
        const id = new mongodb.ObjectID(request.params.id);
        const player = request.body;

        if (player === undefined) {
            response.send(400, 'No player data');
            return next();
        }
        delete player._id;
        player.password = sha1(player.password);
        database.db.collection('players')
            .updateOne({
                _id: id
            }, {
                $set: player
            })
            .then(result => this.returnPlayer(id, response, next))
            .catch(err => this.handleError(err, response, next));
    }

    public createPlayer = (request: any, response: any, next: any) => {
        const newplayer = request.body;
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
        database.db.collection('players').findOne({
            username: newplayer.username
        }).then(player => {
            if (player !== null) {
                response.send(400, 'Player already exist');
                return next();
            } else {
                database.db.collection('players').findOne({
                    email: newplayer.email
                }).then(player => {
                    if (player !== null) {
                        response.send(400, 'Player already exist');
                        return next();
                    } else {

                        newplayer.password = sha1(newplayer.password);
                        database.db.collection('players')
                            .insertOne(newplayer)
                            .then(result => this.returnPlayer(result.insertedId, response, next))
                            .catch(err => this.handleError(err, response, next));
                    }
                }).catch(err => this.handleError(err, response, next));
            }
        }).catch(err => this.handleError(err, response, next));

    }

    public deletePlayer = (request: any, response: any, next: any) => {
        var id = new mongodb.ObjectID(request.params.id);
        database.db.collection('players')
            .deleteOne({
                _id: id
            })
            .then(result => {
                if (result.deletedCount === 1) {
                    response.json({
                        msg: util.format('Player -%s- Deleted', id)
                    });
                } else {
                    response.send(404, 'No player found');
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getTop10Star = (request: any, response: any, next: any) => {
        database.db.collection('players')
            .find({ totalStars: { $exists: true } })
            .sort({ totalStars: -1 })
            .limit(10)
            .toArray()
            .then(players => {
                response.json(players || []);
                this.settings.wsServer.notifyAll('players', new Date().toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric"
                }) + ': Somebody accessed top 10 Star');
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getTop10Point = (request: any, response: any, next: any) => {
        database.db.collection('players')
            .find({ totalPoints: { $exists: true } })
            .sort({ totalPoints: -1 })
            .limit(10)
            .toArray()
            .then(players => {
                response.json(players || []);
                this.settings.wsServer.notifyAll('players', new Date().toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric"
                }) + ': Somebody accessed top 10 Point');
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    // Routes for the games
    public init = (server: any, settings: HandlerSettings) => {
        this.settings = settings;
        server.get(settings.prefix + 'top10Stars', this.getTop10Star);
        server.get(settings.prefix + 'top10Points', this.getTop10Point);
        server.get(settings.prefix + 'players', settings.security.authorize, this.getPlayers);
        server.get(settings.prefix + 'players/:id', settings.security.authorize, this.getPlayer);
        server.put(settings.prefix + 'players/:id', settings.security.authorize, this.updatePlayer);
        server.post(settings.prefix + 'register', this.createPlayer);
        server.del(settings.prefix + 'players/:id', settings.security.authorize, this.deletePlayer);
        console.log("Players routes registered");
    };
}