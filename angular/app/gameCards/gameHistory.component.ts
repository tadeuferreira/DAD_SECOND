import { Component, Input, OnInit } from '@angular/core';

import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Router } from '@angular/router';

import { UserService } from '../auth/user.service';

@Component({
    moduleId: module.id,
    selector: 'game-history',
    templateUrl: 'gameHistory.component.html'
})
export class GameHistoryComponent implements OnInit {
    public arrayGameHistory: any[] = [];
    public arrayMyGameHistory: any[] = [];
    filteredItems: any[];
    inputName: string = '';
    username: string = sessionStorage.getItem("username");

    constructor(public router: Router, public http: Http, public userService: UserService) { }

    ngOnInit() {
        this.getGamesHistory();
        this.filteredItems = this.arrayGameHistory;
    }

    getGamesHistory() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.get('http://40.114.47.134:7777/api/v1/gamesHistory', <RequestOptionsArgs>{ headers: headers, withCredentials: false })
            .subscribe(
            response => {
                if (response.ok) {
                    this.arrayGameHistory = response.json();
                }
            },
            error => {
                console.log(error.text());
            });
    }

    getMyGamesHistory() {
        this.arrayGameHistory.forEach(element => {
            for (var i = 0; i < element.players.lenght; ++i) {
                if (element.players[i].username == this.username) {
                    this.arrayMyGameHistory.push(element);
                }
            }
        });
    }

    FilterByName() {
        this.filteredItems = [];

        if (this.inputName != "") {
            this.arrayGameHistory.forEach(element => {
                if (element.owner.username.toUpperCase().indexOf(this.inputName.toUpperCase()) >= 0) {
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

    isLoggedIn() {
        return this.userService.isLoggedIn();
    }
}