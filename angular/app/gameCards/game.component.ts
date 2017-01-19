import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { GameService } from '../gameCards/game.service';
import { WebSocketService } from '../notifications/websocket.service';
import { Game } from '../gameEngine/game';

@Component({
	moduleId: module.id,
	selector: 'game-playing',
	templateUrl:'game.component.html'

})
export class GameComponent implements OnInit, OnDestroy{

	game : Game;

	constructor(private websocketService: WebSocketService, private gameService: GameService ,private userService: UserService, private router: Router) {}


	ngOnInit(){
		if(!this.userService.isLoggedIn()){
			this.router.navigate(['login']);
		}else{
			this.gameService.getGame().subscribe(
            response => {
            	console.log(response.json());
            	console.log(response.json().pack);
                //this.game = new Game(response.json());
            },
            error => {
                console.log(error.text());
            }
            );
		}

	}

	ngOnDestroy(){

	}
}