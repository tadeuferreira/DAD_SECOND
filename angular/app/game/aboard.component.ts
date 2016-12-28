import { Component, Input, OnInit } from '@angular/core';
import {WebSocketService } from '../notifications/websocket.service';

@Component({
    moduleId: module.id,
    selector: 'aboard',
    templateUrl: 'board.component.html',
    styleUrls: ['board.component.css']
})
export class ABoardComponent implements OnInit{
    public elementos: number[] = [];

    constructor(private websocketService: WebSocketService) {}

    ngOnInit() {
        this.elementos = [];
        this.websocketService.getBoardMessages("aboard").subscribe((m:any) => {
            console.log(m);
            this.elementos = m;
        });
    }
    
    clickElemento(index: number){
        this.websocketService.sendClickElementMessage(index, "aboard");
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



