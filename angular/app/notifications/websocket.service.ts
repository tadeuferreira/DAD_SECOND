import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import {Observable} from 'rxjs/Observable';

import * as io from 'socket.io-client';

@Injectable()
export class WebSocketService {
    private socket: SocketIOClient.Socket;
    constructor() {
        if (!this.socket) {
            this.socket = io('http://localhost:7777');
            //this.socket = io(`http://${window.location.hostname}:${window.location.port}`);
        }
    }

    sendChatMessage(message: any) {
        this.socket.emit('chat', new Date().toLocaleTimeString('en-US', { hour12: false, 
                                                                          hour: "numeric", 
                                                                          minute: "numeric",
                                                                          second: "numeric"}) +': ' +sessionStorage.getItem('username') + ': ' + message);
    }
    getChatMessages(): Observable<any> {
        return this.listenOnChannel('chat');
    }
    sendPlayersMessages(message: any){
        this.socket.emit('players', message);
    }
    getPlayersMessages(): Observable<any> {
        return this.listenOnChannel('players');
    }
    

    sendGameChatMessage(message: any) {
        this.socket.emit('chatGame', message);
    }
    getGameChatMessages(): Observable<any> {
        return this.listenOnChannel('chatGame');
    }
    sendGamePlayersMessage(msgData: any) {
        this.socket.emit('gameNotification', msgData);
    }
    getGamePlayersMessages(): Observable<any> {
        return this.listenOnChannel('gameNotification');
    }

    sendLobby(msgData: any){
        this.socket.emit('gameLobby', msgData);
    }

    subLobby(): Observable<any> {
        return this.listenOnChannel('gameLobby');
    }

    unsubLobby(){
        this.socket.off('gameLobby', null);
    }

    
    unsubGame(){
        this.socket.off('gamePlay', null);
    }
    sendGame(msgData: any){
        this.socket.emit('gamePlay', msgData);
    }
    
    getGame(): Observable<any> {
        return this.listenOnChannel('gamePlay');
    }

    

    private listenOnChannel(channel: string): Observable<any> {
        return new Observable((observer:any) => {
            this.socket.on(channel, (data:any) => {
                observer.next(data);
            });
            return () => this.socket.disconnect();
        });
    }
}
