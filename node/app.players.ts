const mongodb = require('mongodb');
const util = require('util');
const sha1 = require('sha1');

import {HandlerSettings} from './handler.settings';
import {databaseConnection as database} from './app.database';

export class Player {

    private settings: HandlerSettings = null;

    private handleError = (err: string, response: any, next: any) => {
    	response.send(500, err);
        next();
    }

    private returnPlayer = (id:string, response: any, next: any) => {
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

    public getPlayer =  (request: any, response: any, next: any) => {
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
        const player = request.body;
        console.log(player);
        if (player === undefined) {
            response.send(400, 'No player data');
            return next();
        }
        if(player.username === undefined || player.username === ""){
            response.send(400, 'No player username');
            return next();
        }
        if(player.password === undefined || player.password === ""){
            response.send(400, 'No player password');
            return next();
        }
        if(player.email === undefined || player.email === ""){
            response.send(400, 'No player email');
            return next();
        }
        database.db.collection('players').findOne({
            username: player.username
        }).then(player => {
            if (player !== null) {
                response.send(400, 'Player already exist');
                return next();
            }
        }).catch(err => this.handleError(err, response, next));
        database.db.collection('players').findOne({
            email: player.email
        }).then(player => {
            if (player !== null) {
                response.send(400, 'Player already exist');
                return next();
            }
        }).catch(err => this.handleError(err, response, next));

        player.password = sha1(player.password);
        database.db.collection('players')
        .insertOne(player)
        .then(result => this.returnPlayer(result.insertedId, response, next))
        .catch(err => this.handleError(err, response, next));
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
        .find({ totalEstrelas: { $exists: true } })
        .sort({totalEstrelas:-1})
        .limit(10)
        .toArray()
        .then(players => {
            response.json(players || []);
            this.settings.wsServer.notifyAll('players', Date.now() + ': Somebody accessed top 10 Star');
            next();
        })
        .catch(err => this.handleError(err, response, next));
    }

    public getTop10Point = (request: any, response: any, next: any) => {
        database.db.collection('players')
        .find({ totalPontos: { $exists: true } })
        .sort({totalPontos:-1})
        .limit(10)
        .toArray()
        .then(players => {
            response.json(players || []);
            this.settings.wsServer.notifyAll('players', Date.now() + ': Somebody accessed top 10 Point');
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