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
/*
            client.emit('players', Date.now() + ': Welcome to battleship');
            client.broadcast.emit('players', Date.now() + ': A new player has arrived');
            client.on('chat', (data) => this.io.emit('chat', data));
            console.log("login");
            //Extra Exercise
            client.emit('aboard', this.aboard);
            client.emit('dboard', this.dboard);

            client.on('clickElement%dboard', (indexElement) => {
                this.dboard[indexElement]++;
                if (this.dboard[indexElement] > 2) {
                    this.dboard[indexElement] = 0;
                }
                this.notifyAll('dboard', this.dboard);
            });
            client.on('clickElement%aboard', (indexElement) => {
                this.aboard[indexElement]++;
                if (this.aboard[indexElement] > 2) {
                    this.aboard[indexElement] = 0;
                }
                this.notifyAll('aboard', this.aboard);
            });

        });
    };*/

    client.on('initLobby', function (msgData) {
             //check if game exists 

             this.join(msgData._id);

             //if msg == joinning

                 //if is owner 
                     //emit owner player
                 //else check available position and join
                     //add to db
                 //if is full 
                     //emit player then statr the game
                 //else
                     //emit player


             //if msg == change team
                 //do team code


    });
   public notifyAll = (channel: string, message: any) => {
        this.io.sockets.emit(channel, message);
    }; 
};
