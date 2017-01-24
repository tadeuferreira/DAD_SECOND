import { Component, OnInit } from '@angular/core';

import {WebSocketService } from './websocket.service';

@Component({
    moduleId: module.id,
    selector: 'notification-panel',
    templateUrl: 'notification.component.html',
    styleUrls: ['../notifications/notification.component.css']
})
export class NotificationComponent implements OnInit {
    playersChannel: string[] = [];
    chatChannel: string[] = [];
    public username: string = sessionStorage.getItem('username');

    constructor(private websocketService: WebSocketService){
    }

    ngOnInit() {
        this.websocketService.getChatMessages().subscribe((m:any) => this.chatChannel.push(<string>m));
        this.websocketService.getPlayersMessages().subscribe((m:any) => this.chatChannel.push(<string>m));
        this.websocketService.sendPlayersMessages({username: this.username, msg: ''});
    }

}
