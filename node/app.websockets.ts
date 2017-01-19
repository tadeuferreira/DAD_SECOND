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
                
                console.log(msgData);
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

