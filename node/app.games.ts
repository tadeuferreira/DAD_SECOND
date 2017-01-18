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
        .find({state: 'pending'})
        .toArray()
        .then(games => {
            for (var i = 0; i < games.length; ++i) {
                 var count = 0;
                for (var j = 0; j < games[i].team1.length; ++j) {
                    if(games[i].team1[j].id != null){
                        count++;
                    }
                }
                for (var k = 0; k < games[i].team1.length; ++k) {
                    if(games[i].team2[k].id != null){
                        count++;
                    }
                }
                games[i].count = count;
            }
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
        var gameInfo = request.body;

        database.db.collection('players').findOne({
            username: gameInfo.player.username
        }).then(player => {
            if (player !== null && player.id === gameInfo.player.id) {
                var game = {
                    ownername: '',
                    owner : null,
                    team1 : [{id : null},{id : null}],
                    team2 : [{id : null},{id : null}],
                    state : null,
                    count : 0,
                    creationDate : null,
                    pack : {}
                };
                game.ownername = player.username;
                game.pack = this.createCards();
                game.owner = new mongodb.ObjectID(player._id);
                game.state = gameInfo.state;
                game.creationDate = gameInfo.creationDate;
                game.count = 1;
                
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