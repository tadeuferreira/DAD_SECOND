import { Component, Input, OnInit } from '@angular/core';
import {WebSocketService } from '../notifications/websocket.service';

@Component({
    moduleId: module.id,
    selector: 'dboard',
    templateUrl: 'board.component.html',
    styleUrls: ['board.component.css']
})
export class DBoardComponent implements OnInit{
    public elementos: number[] = [];

    constructor(private websocketService: WebSocketService) {}

    ngOnInit() {
        this.elementos = [];
        this.websocketService.getBoardMessages("dboard").subscribe((m:any) => {
            console.log(m);
            this.elementos = m;
        });
    }
    
    clickElemento(index: number){
        this.websocketService.sendClickElementMessage(index, "dboard");
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



