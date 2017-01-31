import { Component, Input, OnInit } from '@angular/core';

import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'game-history',
    templateUrl: 'gameHistory.component.html'
})
export class GameHistoryComponent implements OnInit {
    public arrayGameHistory: any[] = [];
    filteredItems: any[];
    inputName: string = '';
    @Input() isMyGames: boolean;

    constructor(public router: Router, public http: Http) { }

    ngOnInit() {
        this.getGameHistory();
        this.filteredItems = this.arrayGameHistory;
    }

    getGameHistory() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.get('http://localhost:7777/api/v1/gamesHistory', <RequestOptionsArgs>{ headers: headers, withCredentials: false })
            .subscribe(
            response => {
                if (response.ok) {
                    this.arrayGameHistory = response.json();
                    console.log('game history');
                    console.log(response.json());
                    console.log(this.arrayGameHistory);


                }
            },
            error => {
                console.log(error.text());
            });
    }

    


    FilterByName() {
        this.filteredItems = [];

        if (this.inputName != "") {
            this.arrayGameHistory.forEach(element => {
                if (element.name.toUpperCase().indexOf(this.inputName.toUpperCase()) >= 0) {
                    this.filteredItems.push(element);
                }
            });
        } else {
            this.filteredItems = this.arrayGameHistory;
        }
        console.log(this.filteredItems);
        this.refreshItems();
    }

    refreshItems() {
        this.arrayGameHistory = this.filteredItems;
    }
}