import { Component, Input, OnInit } from '@angular/core';

import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'game-history-player',
    templateUrl: 'gameHistoryPlayer.component.html'
})
export class GameHistoryPlayerComponent implements OnInit {
    public arrayGameHistoryPlayer: any[] = [];
    filteredItems: any[];
    inputName: string = '';
    username: string = sessionStorage.getItem("username");

    constructor(public router: Router, public http: Http) { }

    ngOnInit() {
        this.getGameHistoryPlayer();
        this.filteredItems = this.arrayGameHistoryPlayer;
    }

    getGameHistoryPlayer() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.get('http://localhost:7777/api/v1/gamesHistoryPlayer', <RequestOptionsArgs>{ headers: headers, withCredentials: false })
            .subscribe(
            response => {
                if (response.ok) {
                    this.arrayGameHistoryPlayer = response.json();
                }
            },
            error => {
                console.log(error.text());
            });
    }

    FilterByName() {
        this.filteredItems = [];

        if (this.inputName != "") {
            this.arrayGameHistoryPlayer.forEach(element => {
                if (element.name.toUpperCase().indexOf(this.inputName.toUpperCase()) >= 0) {
                    this.filteredItems.push(element);
                }
            });
        } else {
            this.filteredItems = this.arrayGameHistoryPlayer;
        }
        console.log(this.filteredItems);
        this.refreshItems();
    }

    refreshItems() {
        this.arrayGameHistoryPlayer = this.filteredItems;
    }
}