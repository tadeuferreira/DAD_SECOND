const io = require('socket.io');
const mongodb = require('mongodb');
import {databaseConnection as database} from './app.database';
export class WebSocketServer {
    public aboard: number[] = [];
    public dboard: number[] = [];
    public io: any;

    public initBoard(){
        for(let i=0; i<100; i++) {
            this.aboard[i]=0;
            this.dboard[i]=0;
        }
    }

    public init = (server: any) => {
        this.initBoard();
        this.io = io.listen(server);            
        this.io.sockets.on('connection', (client: any) => {

            
             client.on('exitLobby', function (msgData) {
                var gameID = new mongodb.ObjectID(msgData._id);
                var player_id = msgData.player._id;
                var i = 0;
                database.db.collection('games')
                .findOne({
                    _id: gameID
                })
                .then(game => {
                    if (game !== null) {
                        this.join(msgData._id);
                        if(game.owner == msgData.player._id){
                            game.state = 'terminated';
                            delete game._id;
                            database.db.collection('games')
                            .updateOne({
                                _id: gameID
                            }, {
                                $set: game
                            })
                            .then(result =>  {this.emit('exitLobby', {status : 'terminated'});this.to(msgData._id).emit('exitLobby', {status : 'terminated'});})
                            .catch(err => this.emit('initLobbyErr','Error'));
                        }else{
                            for (i = 0; i < 2; ++i) {
                                    if(game.team1[i].id == player_id){
                                        game.team1[i].id = null;
                                    }
                                };
                                for (i = 0; i < 2; ++i) {
                                    if(game.team2[i].id == player_id){
                                        game.team2[i].id = null;
                                    }
                                };
                            delete game._id;
                            database.db.collection('games')
                            .updateOne({
                                _id: gameID
                            }, {
                                $set: game
                            })
                            .then(result => {
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
                                                this.emit('initLobby',{team1 : team1p, team2 : team2p });
                                                this.to(msgData._id).emit('initLobby',{team1 : team1p, team2 : team2p });
                                            }).catch(err => this.emit('initLobbyErr', console.log(err)));
                                        }).catch(err => this.emit('initLobbyErr','error team 1'));
                            } )
                            .catch(err => this.emit('initLobbyErr','Error')); 
                        }
                    }
                }).catch(err => this.emit('initLobbyErr','Error'));      
            });


            client.on('initLobby', function (msgData) {
                var player_id = msgData.player._id;
                var i = 0;
                console.log('joing');
                database.db.collection('games')
                .findOne({
                    _id: new mongodb.ObjectID(msgData._id)
                })
                .then(game => {
                    if (game !== null){
                        if(game.state === 'pending'){
                            this.join(msgData._id);
                            console.log('pending');
                            if(msgData.msg =="Joinning"){
                                console.log('Joinning');
                                var ableToJoin = true;
                                for (i = 0; i < 2; ++i) {
                                    if(game.team1[i].id == player_id){
                                        ableToJoin = false;
                                    }
                                };
                                for (i = 0; i < 2; ++i) {
                                    if(game.team2[i].id == player_id){
                                        ableToJoin = false;
                                    }
                                };
                                console.log(ableToJoin);
                                if(ableToJoin){
                                    var isSet = false;
                                    for (i = 0; i < 2; ++i) {
                                        if(game.team1[i].id == null){
                                            game.team1[i].id = player_id;
                                            i = 2;
                                            isSet = true;
                                        }
                                    };
                                    for (i = 0; i < 2; ++i) {
                                        if(game.team2[i].id == null && !isSet){
                                            game.team2[i].id = player_id;
                                            i = 2;
                                        }
                                    };           
                                }
                                    delete game._id;
                                    database.db.collection('games')
                                    .updateOne({
                                        _id: new mongodb.ObjectID(msgData._id)
                                    }, {
                                        $set: game
                                    })
                                    .then(result => {
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
                                                this.emit('initLobby',{team1 : team1p, team2 : team2p });
                                                this.to(msgData._id).emit('initLobby',{team1 : team1p, team2 : team2p });
                                            }).catch(err => this.emit('initLobbyErr', console.log(err)));
                                        }).catch(err => this.emit('initLobbyErr','error team 1'));
                                    }).catch(err => this.emit('initLobbyErr','error update game'));
                            }   
                        }
                    }
                }).catch(err => this.emit('initLobbyErr',err));
            });
        });
    }
    public notifyAll = (channel: string, message: any) => {
        this.io.sockets.emit(channel, message);
    }

}

