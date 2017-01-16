const mongodb = require('mongodb');
const util = require('util');
import {HandlerSettings} from './handler.settings';
import {databaseConnection as database} from './app.database';

export class Game {

    private handleError = (err: string, response: any, next: any) => {
    	response.send(500, err);
        next();
    }

    private returnGame = (id:string, response: any, next: any) => {
        database.db.collection('games')
        .findOne({
            _id: id
        })
        .then(game => {
            if (game === null) {
                response.send(404, 'Game not found');
            } else {
                response.json(game);
            }
            next();
        })
        .catch(err => this.handleError(err, response, next));
    }

    public getGames = (request: any, response: any, next: any) => {
        database.db.collection('games')
        .find()
        .toArray()
        .then(games => {
            response.json(games || []);
            next();
        })
        .catch(err => this.handleError(err, response, next));
    }

    public getGame =  (request: any, response: any, next: any) => {
        const id = new mongodb.ObjectID(request.params.id);
        this.returnGame(id, response, next);
    }

    public updateGame =  (request: any, response: any, next: any) => {
        const id = new mongodb.ObjectID(request.params.id);
        const game = request.body;

        if (game === undefined) {
            response.send(400, 'No game data');
            return next();
        }
        delete game._id;
        database.db.collection('games')
        .updateOne({
            _id: id
        }, {
            $set: game
        })
        .then(result => this.returnGame(id, response, next))
        .catch(err => this.handleError(err, response, next));
    }

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

    public deleteGame =  (request: any, response: any, next: any) => {
        const id = new mongodb.ObjectID(request.params.id);
        database.db.collection('games')
        .deleteOne({
            _id: id
        })
        .then(result => {
            if (result.deletedCount === 1) {
                response.json({
                    msg: util.format('Game -%s- Deleted', id)
                });
            } else {
                response.send(404, 'No game found');
            }
            next();
        })
        .catch(err => this.handleError(err, response, next));
    }

    public createGame =  (request: any, response: any, next: any) => {
        var player = request.body;

        database.db.collection('players').findOne({
            username: player.username
        }).then(player => {
            if (player !== null) {
                var game = {
                    owner : null,
                    second : null,
                    third : null,
                    fourth : null,
                    state : 0,
                    pack : {}
                };
                game.pack = this.createCards();
                game.owner = player.id;
                database.db.collection('games')
                .insertOne(game)
                .then(result => this.returnGame(result.insertedId, response, next))
                .catch(err => this.handleError(err, response, next));
            }else{
                response.send(400, 'Problem in creating Game');
                return next();
            }
        }).catch(err => this.handleError(err, response, next));
    }

    // Routes for the games
    public init = (server: any, settings: HandlerSettings) => {
        server.get(settings.prefix + 'games', settings.security.authorize, this.getGames);
        server.get(settings.prefix + 'games/:id', settings.security.authorize, this.getGame);
        server.put(settings.prefix + 'games/:id', settings.security.authorize, this.updateGame);
        server.post(settings.prefix + 'games', settings.security.authorize, this.createGame);
        server.del(settings.prefix + 'games/:id', settings.security.authorize, this.deleteGame);
        //server.del(settings.prefix + 'test',  this.test);
        console.log("Games routes registered");
    };    



    private createCards() {
        var pack = {
            trump : 0,
            cards : {}
        };
        var cards = [];
        for (var i = 0; i < 4; ++i) {
            for (var j = 0; j < 10; ++j) {
                cards.push({type:j , suit: i , isOnHand: false, isUsed: false, playerOwner: null});
            }
        }
        pack.cards = cards;
        return pack;
    }
}