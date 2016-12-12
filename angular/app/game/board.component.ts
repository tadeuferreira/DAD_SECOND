import { Component, Input, OnInit } from '@angular/core';
import {WebSocketService } from '../notifications/websocket.service';

@Component({
    moduleId: module.id,
    selector: 'board',
    templateUrl: 'board.component.html',
    styleUrls: ['board.component.css']
})
export class BoardComponent implements OnInit{
    public elementos: number[] = [];

    constructor(private websocketService: WebSocketService) {}

    ngOnInit() {
        this.elementos = [];
        this.websocketService.getBoardMessages().subscribe((m:any) => {
            console.log(m);
            this.elementos = m;
        });
    }
    
    clickElemento(index: number){
        this.websocketService.sendClickElementMessage(index);
    }

    getColor(elemento: number){
        switch (elemento) {
            case 0: return 'lightgray';
            case 1: return 'blue';
            case 2: return 'red';
        }
        return 'white';
    }
}



