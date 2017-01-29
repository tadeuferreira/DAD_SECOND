import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { UserService } from '../auth/user.service';
import { GameService } from '../gameCards/game.service';
import { WebSocketService } from '../notifications/websocket.service';

@Component({
    moduleId: module.id,
    selector: 'gamesearch',
    templateUrl:'gameSearch.component.html'

})
export class GameSearchComponent implements OnInit{

	public games: string[] = [];
	constructor(private gameService: GameService ,private userService: UserService, private router: Router) {}

	 ngOnInit() {
	 	if(!this.userService.isLoggedIn()){
			this.router.navigate(['login']);
		}else{
			 this.gameService.getGames().subscribe(response => {this.games = response.json();
			 	console.log(response.json());});
		}	
    }

    enterGame(m:any){
    	if(m.count < 4){
    		sessionStorage.setItem('game_id',m._id);
    		this.router.navigate(['game/play']);
    	}
    }


	
}