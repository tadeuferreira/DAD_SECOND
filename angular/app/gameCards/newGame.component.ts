import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { GameService } from '../gameCards/game.service';

@Component({
	moduleId: module.id,
	selector: 'newgame',
	template: '<h1> creating game ... </h1>'
})

export class NewGameComponent implements OnInit {


	constructor(private gameService: GameService ,private userService: UserService, private router: Router) {}

	ngOnInit() {
		if(!this.userService.isLoggedIn()){
			this.router.navigate(['login']);
		}else{
			this.gameService.createGame();
		}	
	}


}