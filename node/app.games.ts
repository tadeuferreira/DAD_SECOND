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
                console.log(game);
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
                    team1 : [{id : null, avatar: null, username: null},{id : null, avatar: null, username: null}],
                    team2 : [{id : null, avatar: null, username: null},{id : null, avatar: null, username: null}],
                    state : null,
                    first : null,
                    count : 0,
                    creationDate : null,
                    pack : {}
                };
                game.ownername = player.username;
                game.pack = this.createCards();
                game.owner = player._id.toString();
                game.state = gameInfo.state;
                game.creationDate = gameInfo.creationDate;
                
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

    public joinGame =  (request: any, response: any, next: any) => {
        var info = request.body;

        database.db.collection('games')
        .findOne({
            _id: new mongodb.ObjectID(info._id)
        }).then(game => {
            if (game !== null && game.state == 'pending') {
                var i = 0;
                var ableToJoin = false;
                var alreadyIn = false;

                for (i = 0; i < 2; ++i) {
                    if(game.team1[i].id == null){
                        ableToJoin = true;
                    }
                    if( game.team2[i].id == null){
                        ableToJoin = true;
                    }
                    if(game.team1[i].id == info.player_id || game.team2[i].id == info.player_id){
                        alreadyIn = true;
                    }
                }
                if(ableToJoin && !alreadyIn){
                    for(i = 0; i < 2; i++){
                        if(game.team1[i].id == null){
                            game.team1[i].id = info.player_id;
                            game.team1[i].avatar = info.player_avatar;
                            game.team1[i].username = info.player_username;
                            break;
                        }
                        if(game.team2[i].id == null){
                            game.team2[i].id = info.player_id;
                            game.team2[i].avatar = info.player_avatar;
                            game.team2[i].username = info.player_username;
                            break;
                        }
                    }
                    game.count++;           
                    if(game.count == 4){
                        game.state = 'in Progress';

                        var team = this.getRandomInt(1,2);  
                        var pos = this.getRandomInt(0,1);
                        //selects the first player to play;
                        if(team == 1){
                            game.first = game.team1[pos].id;
                        }else if(team == 2){
                            game.first = game.team2[pos].id;
                        }  

                    }


                    var game_id = game._id;
                    delete game._id;
                    database.db.collection('games')
                    .updateOne({
                        _id: game_id
                    }, {
                        $set: game
                    })
                    .then(result => {

                        if(game.count == 4){
                            response.send(200, 'start');
                            return next(); 
                        }else{
                            response.send(200, 'joined');
                            return next();  
                        }  
                    })
                    .catch(err => this.handleError(err, response, next));
                }else if(alreadyIn){
                    response.send(200, 'already In');
                    return next(); 
                }else{
                    response.send(400, 'Game is Full');
                    return next(); 
                }

            }else{
                response.send(400, 'Problem in joining Game');
                return next();
            }
        }).catch(err => this.handleError(err, response, next));
    }

    public playersGame =  (request: any, response: any, next: any) => {
        const id = new mongodb.ObjectID(request.params.id);
        console.log(id);
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
                response.send(404, 'No game found');
            }
            next();
        })
        .catch(err => this.handleError(err, response, next));
    }

    public leaveGame =  (request: any, response: any, next: any) => {
        var info = request.body;
        console.log(info);
        database.db.collection('games')
        .findOne({
            _id: new mongodb.ObjectID(info._id)
        })
        .then(game => {
            var ownerPresent = false;
            if (game !== null) {
                if(game.owner == info.player_id){
                    ownerPresent = true;
                    game.state = 'terminated';
                }else{
                    ownerPresent = false;
                    for (var i = 0; i < 2; ++i) {
                        if(game.team1[i].id == info.player_id){
                            game.team1[i].id = null;
                        }
                        if( game.team2[i].id == info.player_id){
                            game.team2[i].id = null;
                        }
                    }
                }
                delete game._id;
                database.db.collection('games')
                .updateOne({
                    _id: new mongodb.ObjectID(info._id)
                }, {
                    $set: game
                })
                .then(result => {
                    if(ownerPresent){
                        response.send(200, 'terminated');
                    }else{
                        response.send(200, 'left');
                    }
                })
                .catch(err => this.handleError(err, response, next));    
            } else {
                response.send(404, 'No game found');
            }
            next();
        })
        .catch(err => this.handleError(err, response, next));
    }
    public changeTeamGame =  (request: any, response: any, next: any) => {
        var info = request.body;
        console.log(info);
        database.db.collection('games')
        .findOne({
            _id: new mongodb.ObjectID(info._id)
        })
        .then(game => {
            if (game !== null) {
                var team = 0;
                for (var i = 0; i < 2; ++i) {
                    if(game.team1[i].id == info.player_id){
                        team = 1;
                    }
                    if( game.team2[i].id == info.player_id){
                        team = 2;
                    }
                }
                console.log(info.player_id);
                console.log(team);
                var isChanged = false;
                if(team === 1){
                    for (var j = 0; j < 2; ++j) {
                        if( game.team2[j].id == null){
                            game.team2[j].id = info.player_id;
                            isChanged = true;
                            for (var l = 0; l < 2; ++l) {
                                if(game.team1[l].id == info.player_id){
                                    game.team1[l].id = null;
                                }
                            }
                            j=0;
                            break;
                        }
                    }
                }else if(team === 2){
                    for (var k = 0; k < 2; ++k) {
                        if( game.team1[k].id == null){
                            game.team1[k].id = info.player_id;
                            isChanged = true;
                            for (var d = 0; d < 2; ++d) {
                                if(game.team2[d].id == info.player_id){
                                    game.team2[d].id = null;
                                }
                            }
                            k = 0;
                            break;
                        }
                    } 
                }

                if(isChanged){
                    delete game._id;
                    database.db.collection('games')
                    .updateOne({
                        _id: new mongodb.ObjectID(info._id)
                    }, {
                        $set: game
                    })
                    .then(result => {
                        response.send(200, 'changed');
                    })
                    .catch(err => this.handleError(err, response, next)); 
                }else{
                    response.send(200, 'full');
                }  
            } else {
                response.send(404, 'No game found');
            }
            next();
        })
        .catch(err => this.handleError(err, response, next));
    }

    private endGame =  (game: any, response: any, next: any) => {
        const id = game._id;
        game.state = 'terminated';
        delete game._id;
        database.db.collection('games')
        .updateOne({
            _id: id
        }, {
            $set: game
        })
        .then(result => response.send(200,'terminated'))
        .catch(err => this.handleError(err, response, next));  

    }




    // Routes for the games
    public init = (server: any, settings: HandlerSettings) => {
        server.get(settings.prefix + 'games', settings.security.authorize, this.getGames);

        server.get(settings.prefix + 'games/:id', settings.security.authorize, this.getGame);
        server.put(settings.prefix + 'games/:id', settings.security.authorize, this.updateGame);

        server.post(settings.prefix + 'games', settings.security.authorize, this.createGame);

        server.post(settings.prefix + 'games/join', settings.security.authorize, this.joinGame);
        server.post(settings.prefix + 'games/leave', settings.security.authorize, this.leaveGame);
        server.post(settings.prefix + 'games/change', settings.security.authorize, this.changeTeamGame);
        server.get(settings.prefix + 'games/players/:id', settings.security.authorize, this.playersGame);

        server.del(settings.prefix + 'games/:id', settings.security.authorize, this.deleteGame);
        console.log("Games routes registered");
    };    



    private createCards() {
        var pack = {
            suitTrump: -1,
            cards : {}
        };
        var cards = [];
        for (var i = 0; i < 4; ++i) {
            for (var j = 0; j < 10; ++j) {
                cards.push({type:j , suit: i , isOnHand: false, isUsed: false, playerOwner: null, isTrump: false});
            }
        }
        cards = this.shuffleArray(cards);
        pack.cards = cards;
        return pack;
    }

    private shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    private getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}