import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { GameService } from '../gameCards/game.service';
import { WebSocketService } from '../notifications/websocket.service';

@Component({
	moduleId: module.id,
	selector: 'gamelobby',
	templateUrl:'gameLobby.component.html'

})
export class GameLobbyComponent implements OnInit, OnDestroy{
	private players: string[] = [];
	public team1: string[] = [];
	public team2: string[] = [];
	private game_id: string = sessionStorage.getItem('game_id');
	private player_id: string = sessionStorage.getItem('id');
	private gameIsStarting :boolean = false;

	constructor(private websocketService: WebSocketService, private gameService: GameService ,private userService: UserService, private router: Router) {}

	ngOnInit() {
		if(!this.userService.isLoggedIn()){
			this.router.navigate(['login']);
		}else{
			//join game 
			this.websocketService.sendLobby({_id: this.game_id, player_id: this.player_id, player_avatar: sessionStorage.getItem('avatar'),player_username: sessionStorage.getItem('username'),msg:'join'});

			this.websocketService.subLobby().subscribe(response => {

				switch (response.msg) {
					case 'update':
					this.gameService.getPlayersGame().subscribe(response => {
						if(response.ok)
							this.setPlayers(response);},
						error => {
							console.log(error.text());
						}
						);
					break;
					case 'start':
					this.gameIsStarting = true;
					this.router.navigate(['game/playing']);
					break;
					case 'switch_fail':
					alert('cant switch team');
					break;
					case 'terminated':
					this.end();
					break;
				}

			});
		}
	}

	ngOnDestroy() {
		if(!this.gameIsStarting)
			this.websocketService.sendLobby({_id: this.game_id, player_id: this.player_id, msg:'leave'});
	}


	setPlayers(response: any){
		var json = JSON.parse(response._body);
		this.team1 = json.team1;
		this.team2 = json.team2;
	}

	changeTeam(){
		this.websocketService.sendLobby({_id: this.game_id, player_id: this.player_id, msg:'switch'});
	}

	leave(){
		this.websocketService.sendLobby({_id: this.game_id, player_id: this.player_id, msg:'leave'});
		this.end();
	}

	getGameId(){
		return this.game_id;
	}

	end(){
		this.websocketService.unsubLobby();
		this.router.navigate(['dashboard']);
	}

}