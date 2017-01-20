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


/*
    // Extra Exercise
    sendClickElementMessage(index: number, board: string) {
        this.socket.emit('clickElement%'+board, index);
    }
    getBoardMessages(channel: string): Observable<any> {
        return this.listenOnChannel(channel);
    }
    */

    
    getInitLobbyErr(): Observable<any> {
        return this.listenOnChannel('initLobbyErr');
    }
    getInitLobby(): Observable<any> {
        return this.listenOnChannel('initLobby');
    }
    sendInitLobby(msgData: any){
        this.socket.emit('initLobby', msgData);
    }
    sendExitLobby(msgData: any){
        this.socket.emit('exitLobby', msgData);
    }
    getExitLobby(): Observable<any> {
        return this.listenOnChannel('exitLobby');
    }
    unsubLobby(){
        this.socket.off('initLobby', null);
        this.socket.off('exitLobby', null);
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
