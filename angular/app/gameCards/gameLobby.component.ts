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
	private gameIsStarting = false;
	constructor(private websocketService: WebSocketService, private gameService: GameService ,private userService: UserService, private router: Router) {}

	ngOnInit() {
		if(!this.userService.isLoggedIn()){
			this.router.navigate(['login']);
		}else{
			this.gameService.joinGame().subscribe(response => {
				if (response.ok) {
					switch (response._body) {
						case '"joined"':
						this.websocketService.sendInitLobby({_id: sessionStorage.getItem('game_id'), msg: 'joining'});
						break;
						case '"start"':
						this.websocketService.sendInitLobby({_id: sessionStorage.getItem('game_id'), msg: 'start'});
						break;	
						case '"already In"':
						this.websocketService.sendInitLobby({_id: sessionStorage.getItem('game_id'), msg: 'already In'});
						break;
					}
					this.websocketService.getInitLobby().subscribe((p: any) => 
						{
							if(p.msg == 'refresh'){
								this.gameService.getPlayersGame().subscribe(response => {
									this.setPlayers(response);
								}, error => {
									console.log(error);
								}
								);
							}else if(p.msg == 'startGame'){
								this.websocketService.unsubLobby();
								this.gameIsStarting = true;
								this.router.navigate(['game/playing']);

							}
						});
					this.websocketService.getExitLobby().subscribe((p: any) => { 	
							if(p.msg == 'terminated'){
								this.router.navigate(['dashboard']);
					}});

				}else{
					this.router.navigate(['dashboard']);
				}
			}, error => {
				console.log(error);
			});
		}	
	}

	ngOnDestroy() {
		if(!this.gameIsStarting)
			this.leave();
	}


	setPlayers(response: any){
		var json = JSON.parse(response._body);
		this.team1 = json.team1;
		this.team2 = json.team2;
		console.log(json);
	}

	changeTeam(){
		this.gameService.changeTeamGame().subscribe(response => {
				if (response.ok) {
					switch (response._body) {
						case '"changed"':
							this.websocketService.sendInitLobby({_id: sessionStorage.getItem('game_id'), msg: 'changed'});
							break;					
						case '"full"':			
							alert('The other team is full');
							break;
					}			
				}
			}, error => {
				console.log(error);
			}
			);
	}

	leave(){
		this.gameService.leaveGame().subscribe(response => {
				if (response.ok) {
					switch (response._body) {
						case '"terminated"':
							this.websocketService.sendExitLobby({_id: sessionStorage.getItem('game_id'), msg: 'terminated'});
							break;
						
						case '"left"':
							this.websocketService.sendExitLobby({_id: sessionStorage.getItem('game_id'), msg: 'left'});
							break;
					}
					this.router.navigate(['dashboard']);
					
				}
			}, error => {
				console.log(error);
			}
			);
	}

}