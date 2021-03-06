import { Component, Input, OnInit } from '@angular/core';
import { WebSocketService } from '../notifications/websocket.service';

import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'gameChat',
    templateUrl: 'gameChat.component.html',
    styleUrls: [ '../gameCards/gameChat.component.css' ]
})

export class GameChatComponent {
    @Input() game_id: string;
    public message: string;
    public chatGameChannel: string[] = [];
    public username: string = sessionStorage.getItem('username');


    constructor(public router: Router, public http: Http, private websocketService: WebSocketService) {}

    send(): void {
        this.websocketService.sendGameChatMessage({game_id: this.game_id, msg: this.message, username: this.username});
        this.message = '';
    }

    ngOnInit() {
        this.websocketService.getGameChatMessages().subscribe((m: any) => this.chatGameChannel.push(<string>m));
        this.websocketService.getGamePlayersMessages().subscribe((m: any) => this.chatGameChannel.push(<string>m));
        this.websocketService.sendGamePlayersMessage({game_id: this.game_id, msg: '', username: this.username});
    }
}
