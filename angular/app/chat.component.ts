import { Component } from '@angular/core';
import {WebSocketService } from './notifications/websocket.service';

@Component({
    moduleId: module.id,
    selector: 'chat-control',
    templateUrl: 'chat.component.html'
})
export class ChatComponent {
    message: string;

    constructor(private websocketService: WebSocketService) {}
    send(): void {
        this.websocketService.sendChatMessage(this.message);
        this.message = '';
    }
}
