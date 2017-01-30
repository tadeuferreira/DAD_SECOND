import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../auth/user.service';
import { GameService } from '../gameCards/game.service';
import { WebSocketService } from '../notifications/websocket.service';

@Component({
	moduleId: module.id,
	selector: 'gamesearch',
	templateUrl: 'gameSearch.component.html'

})
export class GameSearchComponent implements OnInit {

	public games: any[] = [];
	filteredItems: any[];
	inputName: string = '';

	constructor(private gameService: GameService, private userService: UserService, private router: Router) { }

	ngOnInit() {
		if (!this.userService.isLoggedIn()) {
			this.router.navigate(['login']);
		} else {
			this.getGames();
			this.filteredItems = this.games;
		}
	}

	enterGame(m: any) {
		if (m.count < 4) {
			sessionStorage.setItem('game_id', m._id);
			this.router.navigate(['game/play']);
		}
	}

	getGames() {
		this.gameService.getGames().subscribe(response => {
			this.games = response.json();
		});
	}


	FilterByName() {
		this.filteredItems = [];
		if (this.inputName != "") {
			this.games.forEach(element => {
				if (element.ownername.toUpperCase().indexOf(this.inputName.toUpperCase()) >= 0) {
					this.filteredItems.push(element);
				}
			});
		} else {
			this.filteredItems = this.games;
		}
		console.log(this.filteredItems);
		this.refreshItems();
	}

	refreshItems() {
		this.games = this.filteredItems;
	}

}