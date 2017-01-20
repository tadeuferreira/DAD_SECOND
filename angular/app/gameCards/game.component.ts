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
                this.game = new Game(response.json());
                this.websocketService.sendGame({_id: sessionStorage.getItem('game_id'), msg: 'ready start'});
                this.websocketService.getGame().subscribe((p: any) => { 	
							if(p.msg == 'yourturn'){
								this.router.navigate(['dashboard']);
					}});


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