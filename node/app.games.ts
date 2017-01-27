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
    private returnGameId = (id:string, response: any, next: any) => {
        database.db.collection('games')
        .findOne({
            _id: id
        })
        .then(game => {
            if (game === null) {
                response.send(404, 'Game not found');
            } else {
                response.json({_id: id});
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
        var game = request.body;

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
                    team1 : [{id : null, avatar: null, username: null, ready: false},{id : null, avatar: null, username: null, ready: false}],
                    team2 : [{id : null, avatar: null, username: null, ready: false},{id : null, avatar: null, username: null, ready: false}],
                    basicOrder : [{id : null},{id : null},{id : null},{id : null}],
                    state : null,
                    renounce1 : false,
                    renounce2 : false,
                    firstToPlay: 0,
                    lastToPlay: 3,
                    count : 0,
                    creationDate : null,
                    pack : {}
                };
                game.ownername = player.username;
                game.pack = [];
                game.owner = player._id.toString();
                game.state = gameInfo.state;
                game.creationDate = gameInfo.creationDate;
                
                database.db.collection('games')
                .insertOne(game)
                .then(result => this.returnGameId(result.insertedId, response, next))
                .catch(err => this.handleError(err, response, next));
            }else{
                response.send(400, 'Problem in creating Game');
                return next();
            }
        }).catch(err => this.handleError(err, response, next));
    }

private readyToPlay =  (request: any, response: any, next: any) => {

    const game_id = request.body._id;
    const player_id = request.body.player_id;

    database.db.collection('games')
    .findOne({
        _id: new mongodb.ObjectID(game_id)
    })
    .then(game => {
        if(game != null){
            var alreadyReady = false;
            for (var i = 0; i < 2; ++i) {
                if(game.team1[i].id == player_id){
                    if(game.team1[i].ready)
                        alreadyReady = true;
                    game.team1[i].ready = true;
                }
                if( game.team2[i].id == player_id){
                    if(game.team2[i].ready)
                        alreadyReady = true;
                    game.team2[i].ready = true;
                }
            }
            var isGameReady = false;
            var count = 0;
            for (var i = 0; i < 2; ++i) {
                if(game.team1[i].ready){
                    count++;
                }
                if( game.team2[i].ready){
                    count++;
                }
            }
            if(count == 4){
                isGameReady = true;
            }
            delete game._id;
            database.db.collection('games')
            .updateOne({
                _id: new mongodb.ObjectID(game_id)
            }, {
                $set: game
            })
            .then(result => {
                if(isGameReady){
                    if(alreadyReady)
                        response.send(200, 'gameStartedAlready');
                    else
                        response.send(200, 'gameReady');
                }else{
                    response.send(200, 'ready');
                }
            })
            .catch(err => this.handleError(err, response, next));  



        }else{
            response.send(404,'No Game found');
        }
    })
    .catch(err => this.handleError(err, response, next));
}


public getPlayers =  (request: any, response: any, next: any) => {
    const id = new mongodb.ObjectID(request.params.id);
    database.db.collection('games')
    .findOne({
      _id: id
    })
    .then(game => {
      if (game != null) {
        database.db.collection('players')
        .find({ $or : [{_id : new mongodb.ObjectID(game.team1[0].id)},{_id : new mongodb.ObjectID(game.team1[1].id)}]})
        .toArray()
        .then(team1u => {
          database.db.collection('players')
          .find({ $or : [{_id : new mongodb.ObjectID(game.team2[0].id)},{_id : new mongodb.ObjectID(game.team2[1].id)}]})
          .toArray()
          .then(team2u => {
            let team1p:any = [];
            let team2p:any = [];
            for (var j = 0; j < team1u.length; ++j) {
              team1p.push({id : team1u[j]._id, username : team1u[j].username,  avatar : team1u[j].avatar});
            }for (var k = 0; k < team2u.length; ++k) {
              team2p.push({id : team2u[k]._id, username : team2u[k].username,  avatar : team2u[k].avatar});
            }
            response.json({team1 : team1p, team2 : team2p });
          }).catch(err => this.handleError(err, response, next));
        }).catch(err => this.handleError(err, response, next));

      } else {
        response.send(404,'No Game found');
      }
    })
    .catch(err => this.handleError(err, response, next));
  };

// Routes for the games
public init = (server: any, settings: HandlerSettings) => {
    server.get(settings.prefix + 'games', settings.security.authorize, this.getGames);

    server.get(settings.prefix + 'games/:id', settings.security.authorize, this.getGame);
    server.put(settings.prefix + 'games/:id', settings.security.authorize, this.updateGame);

    server.post(settings.prefix + 'games', settings.security.authorize, this.createGame);

    server.post(settings.prefix + 'games/ready', settings.security.authorize, this.readyToPlay);
    server.get(settings.prefix + 'games/players/:id', settings.security.authorize, this.getPlayers);

    server.del(settings.prefix + 'games/:id', settings.security.authorize, this.deleteGame);
    console.log("Games routes registered");
};    
}