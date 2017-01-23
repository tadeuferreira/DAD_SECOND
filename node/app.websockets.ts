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

      //chat 
      client.emit('players', new Date().toLocaleTimeString('en-US', { hour12: false, 
        hour: "numeric", 
        minute: "numeric",
        second: "numeric"}) + ': Welcome to Sueca (card game) Chat');

      client.broadcast.emit('players', new Date().toLocaleTimeString('en-US', { hour12: false, 
        hour: "numeric", 
        minute: "numeric",
        second: "numeric"})  + ': A new player has arrived');

      client.on('chat', (data) => this.io.emit('chat', data));



      client.on('chatGame', function (msgData) {
        this.join(msgData.game_id);
        this.emit('chatGame', new Date().toLocaleTimeString('en-US', { hour12: false, 
          hour: "numeric", 
          minute: "numeric",
          second: "numeric"})+ ': ' +msgData.username + ': ' + msgData.msg);
        this.to(msgData.game_id).emit('chatGame', new Date().toLocaleTimeString('en-US', { hour12: false, 
          hour: "numeric", 
          minute: "numeric",
          second: "numeric"})+ ': ' + msgData.username + ': ' + msgData.msg);

      });

      client.on('gameNotification', function (msgData) {
        this.join(msgData.game_id);
        this.emit('gameNotification', msgData.username + ': Welcome to game Room ' + msgData.game_id);
        this.broadcast.to(msgData.game_id).emit('gameNotification', new Date().toLocaleTimeString('en-US', { hour12: false, 
          hour: "numeric", 
          minute: "numeric",
          second: "numeric"})  + ': ' + msgData.username + ' has arrived');


      });

      client.on('gamePlay', function (msgData) {

        switch(msgData.msg){
          case 'startGame':
          this.join(msgData._id);
          this.emit('gamePlay', {_id: msgData._id, msg: 'play', pos : 0});
          this.to(msgData._id).emit('gamePlay',  {_id: msgData._id, msg: 'play', pos : 0});
          break;

          case 'next':
          this.join(msgData._id);

          this.emit('gamePlay', {_id: msgData._id , msg : 'update' , pos: msgData.my_pos, card: msgData.card});
          this.to(msgData._id).emit('gamePlay', {_id: msgData._id , msg : 'update' , pos: msgData.my_pos, card: msgData.card});

          this.emit('gamePlay', {_id: msgData._id , msg : 'play' , pos: msgData.next_pos});
          this.to(msgData._id).emit('gamePlay', {_id: msgData._id , msg : 'play' , pos: msgData.next_pos});
          break;
          /*
          case 'endTurn':
          this.join(msgData._id);
          this.emit('gamePlay', {_id: msgData._id , msg : 'terminated'});
          this.to(msgData._id).emit('gamePlay', {_id: msgData._id , msg : 'terminated'});
          break;

          case 'endGame':
          this.join(msgData._id);
          this.emit('gamePlay', {_id: msgData._id , msg : 'terminated'});
          this.to(msgData._id).emit('gamePlay', {_id: msgData._id , msg : 'terminated'});
          break;*/
        }
      });


      client.on('exitLobby', function (msgData) {

        switch(msgData.msg){
          case 'left':
          this.join(msgData._id);
          this.emit('initLobby', {_id: msgData._id , msg : 'refresh'});
          this.to(msgData._id).emit('initLobby', {_id: msgData._id , msg : 'refresh'});
          break;
          case 'terminated':
          this.join(msgData._id);
          this.emit('exitLobby', {_id: msgData._id , msg : 'terminated'});
          this.to(msgData._id).emit('exitLobby', {_id: msgData._id , msg : 'terminated'});
          break;
        }
      });


      client.on('initLobby', function (msgData) {
        this.join(msgData._id);
        switch(msgData.msg){
          case 'joining':
          this.emit('initLobby', {_id: msgData._id , msg : 'refresh'});
          this.to(msgData._id).emit('initLobby', {_id: msgData._id , msg : 'refresh'});
          break;
          case 'start':
          this.emit('initLobby', {_id: msgData._id , msg : 'startGame'});
          this.to(msgData._id).emit('initLobby', {_id: msgData._id , msg : 'startGame'});
          break;
          case 'already In':
          this.emit('initLobby', {_id: msgData._id , msg : 'refresh'});
          this.to(msgData._id).emit('initLobby', {_id: msgData._id , msg : 'refresh'});
          break;
          case 'changed':
          this.emit('initLobby', {_id: msgData._id , msg : 'refresh'});
          this.to(msgData._id).emit('initLobby', {_id: msgData._id , msg : 'refresh'});
          break;
        }
      });
    });
  }
  public notifyAll = (channel: string, message: any) => {
    this.io.sockets.emit(channel, message);
  }

}

