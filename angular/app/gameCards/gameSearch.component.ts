import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { UserService } from '../auth/user.service';
import { GameService } from '../gameCards/game.service';
import { WebSocketService } from '../notifications/websocket.service';
import { Player } from '../gameEngine/player';

@Component({
    moduleId: module.id,
    selector: 'gamesearch',
    templateUrl:'gameSearch.component.html'

})
export class GameSearchComponent implements OnInit, OnDestroy{

	public games: string[] = [];
	constructor(private gameService: GameService ,private userService: UserService, private router: Router) {}

	 ngOnInit() {
	 	if(!this.userService.isLoggedIn()){
			this.router.navigate(['login']);
		}else{
			 this.gameService.getGames().subscribe(response => this.games = response.json());
		}	
    }

    enterGame(m:any){
    	if(m.count < 4){
    		this.router.navigate(['game',m._id]);
    	}
    }


	
}