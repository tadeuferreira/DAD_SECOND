import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { UserService } from '../auth/user.service';
import { GameService } from '../gameCards/game.service';
import { WebSocketService } from '../notifications/websocket.service';

@Component({
	moduleId: module.id,
	selector: 'gamelobby',
	templateUrl:'gameLobby.component.html'

})
export class GameLobbyComponent implements OnInit, OnDestroy{
	id_game: string;
	private sub: any;
	private players: string[] = [];
	public team1: string[] = [];
	public team2: string[] = [];
	constructor(private websocketService: WebSocketService, private activatedRoute: ActivatedRoute, private gameService: GameService ,private userService: UserService, private router: Router) {}

	ngOnInit() {
		if(!this.userService.isLoggedIn()){
			this.router.navigate(['login']);
		}else{
			this.sub = this.activatedRoute.params.subscribe(params => {
				this.id_game = params['id'];
			});
			console.log(this.id_game);
			this.gameService.joinGame(this.id_game).subscribe(response => {
				console.log(response);
				if (response.ok) {
					switch (response._body) {
						case '"joined"':
						console.log('joined');
						this.websocketService.getInitLobby().subscribe((p: any) => 
						{
							if(p.msg == 'refresh'){
								this.gameService.getPlayersGame(this.id_game).subscribe(response => {
									this.setPlayers(response);
								}, error => {
									console.log(error);
								}
								);
							}
						});
						console.log('joinning sent');
						this.websocketService.sendInitLobby({_id: this.id_game, msg: 'joining'});
						break;
						
						case '"already In"':
						this.websocketService.getInitLobby().subscribe((p: any) => 
							{
							if(p.msg == 'refresh'){
								this.gameService.getPlayersGame(this.id_game).subscribe(response => {
									this.setPlayers(response);
								}, error => {
									console.log(error);
								}
								);
							}
						});
						this.websocketService.sendInitLobby({_id: this.id_game, msg: 'already In'});
						break;
					}
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
		console.log('leaving');
		this.gameService.leaveGame(this.id_game).subscribe(response => {
				console.log(response);
				if (response.ok) {
					switch (response._body) {
						case '"terminated"':
						console.log('terminated');
							this.websocketService.sendExitLobby({_id: this.id_game, msg: 'terminated'});
							break;
						
						case '"left"':
						console.log('left');
							this.websocketService.sendExitLobby({_id: this.id_game, msg: 'left'});
							break;
					}
					
				}
			}, error => {
				console.log(error);
			}
			);

	}


	setPlayers(response: any){
		var json = JSON.parse(response._body);
		this.team1 = json.team1;
		this.team2 = json.team2;
		console.log(json);
	}

}